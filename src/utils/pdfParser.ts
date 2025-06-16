import * as pdfjsLib from 'pdfjs-dist';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { ResumeData } from '../types/resume';

// Use local worker script from pdfjs-dist with Vite URL import
pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

export const parsePDFFile = async (file: File): Promise<ResumeData> => {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let fullText = '';
  const textItems: Array<{ str: string; x: number; y: number; height: number }> = [];

  // Extract text with positioning information
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    
    content.items.forEach((item: any) => {
      if (item.str && item.str.trim()) {
        textItems.push({
          str: item.str.trim(),
          x: item.transform[4],
          y: item.transform[5],
          height: item.height || 12
        });
        fullText += item.str + ' ';
      }
    });
  }

  // Sort text items by position (top to bottom, left to right)
  textItems.sort((a, b) => {
    const yDiff = b.y - a.y; // Higher y values first (top to bottom)
    if (Math.abs(yDiff) > 5) return yDiff;
    return a.x - b.x; // Left to right for same line
  });

  const lines = groupTextIntoLines(textItems);
  return parseLinkedInContent(lines, fullText);
};

const groupTextIntoLines = (textItems: Array<{ str: string; x: number; y: number; height: number }>) => {
  const lines: string[] = [];
  let currentLine = '';
  let currentY = textItems[0]?.y || 0;
  
  textItems.forEach((item, index) => {
    const yDiff = Math.abs(item.y - currentY);
    
    if (yDiff > 5 && currentLine.trim()) {
      lines.push(currentLine.trim());
      currentLine = item.str;
      currentY = item.y;
    } else {
      if (currentLine && !currentLine.endsWith(' ') && !item.str.startsWith(' ')) {
        currentLine += ' ';
      }
      currentLine += item.str;
    }
    
    if (index === textItems.length - 1 && currentLine.trim()) {
      lines.push(currentLine.trim());
    }
  });
  
  return lines.filter(line => line.trim().length > 0);
};

const parseLinkedInContent = (lines: string[], fullText: string): ResumeData => {
  const resume: ResumeData = {
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: []
  };

  // Extract personal information
  extractPersonalInfo(lines, fullText, resume);
  
  // Extract sections
  const sections = identifySections(lines);
  
  if (sections.summary.length > 0) {
    extractSummary(sections.summary, resume);
  }
  
  if (sections.experience.length > 0) {
    extractExperience(sections.experience, resume);
  }
  
  if (sections.education.length > 0) {
    extractEducation(sections.education, resume);
  }
  
  if (sections.skills.length > 0) {
    extractSkills(sections.skills, resume);
  }

  return resume;
};

const extractPersonalInfo = (lines: string[], fullText: string, resume: ResumeData) => {
  // Extract email
  const emailMatch = fullText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    resume.personalInfo.email = emailMatch[1];
  }

  // Extract phone (various formats)
  const phoneMatch = fullText.match(/(\+?[\d\s\-\(\)\.]{8,})/);
  if (phoneMatch) {
    const phone = phoneMatch[1].replace(/[^\d\+]/g, '');
    if (phone.length >= 8) {
      resume.personalInfo.phone = phoneMatch[1].trim();
    }
  }

  // Extract LinkedIn URL
  const linkedinMatch = fullText.match(/(https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+)/);
  if (linkedinMatch) {
    resume.personalInfo.linkedin = linkedinMatch[1];
  }

  // Extract name and title from first few lines
  const firstLines = lines.slice(0, 10);
  let nameFound = false;
  
  for (let i = 0; i < firstLines.length; i++) {
    const line = firstLines[i];
    
    // Skip common header words
    if (line.toLowerCase().includes('resume') || 
        line.toLowerCase().includes('cv') ||
        line.toLowerCase().includes('curriculum') ||
        line.length < 2) {
      continue;
    }
    
    // Name is usually the first substantial line
    if (!nameFound && line.length > 2 && line.length < 50 && 
        !line.includes('@') && !line.includes('http') &&
        !/\d{4}/.test(line)) {
      resume.personalInfo.name = line;
      nameFound = true;
    } else if (nameFound && !resume.personalInfo.title && 
               line.length > 2 && line.length < 100 &&
               !line.includes('@') && !line.includes('http') &&
               !/\d{4}/.test(line)) {
      resume.personalInfo.title = line;
      break;
    }
  }

  // Extract location (look for city, country patterns)
  const locationMatch = fullText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  if (locationMatch) {
    resume.personalInfo.location = locationMatch[1];
  }
};

const identifySections = (lines: string[]) => {
  const sections = {
    summary: [] as string[],
    experience: [] as string[],
    education: [] as string[],
    skills: [] as string[],
    certifications: [] as string[]
  };

  let currentSection = '';
  let sectionStart = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    
    // Identify section headers
    if (line.includes('summary') || line.includes('about') || line.includes('profile')) {
      if (currentSection && sectionStart >= 0) {
        sections[currentSection as keyof typeof sections] = lines.slice(sectionStart, i);
      }
      currentSection = 'summary';
      sectionStart = i + 1;
    } else if (line.includes('experience') || line.includes('employment') || line.includes('work history')) {
      if (currentSection && sectionStart >= 0) {
        sections[currentSection as keyof typeof sections] = lines.slice(sectionStart, i);
      }
      currentSection = 'experience';
      sectionStart = i + 1;
    } else if (line.includes('education') || line.includes('academic') || line.includes('qualification')) {
      if (currentSection && sectionStart >= 0) {
        sections[currentSection as keyof typeof sections] = lines.slice(sectionStart, i);
      }
      currentSection = 'education';
      sectionStart = i + 1;
    } else if (line.includes('skill') || line.includes('competenc') || line.includes('technical')) {
      if (currentSection && sectionStart >= 0) {
        sections[currentSection as keyof typeof sections] = lines.slice(sectionStart, i);
      }
      currentSection = 'skills';
      sectionStart = i + 1;
    } else if (line.includes('certification') || line.includes('license') || line.includes('credential')) {
      if (currentSection && sectionStart >= 0) {
        sections[currentSection as keyof typeof sections] = lines.slice(sectionStart, i);
      }
      currentSection = 'certifications';
      sectionStart = i + 1;
    }
  }

  // Add the last section
  if (currentSection && sectionStart >= 0) {
    sections[currentSection as keyof typeof sections] = lines.slice(sectionStart);
  }

  return sections;
};

const extractSummary = (lines: string[], resume: ResumeData) => {
  resume.summary = lines.join(' ').trim();
};

const extractExperience = (lines: string[], resume: ResumeData) => {
  let currentExp: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for date patterns (various formats)
    const dateMatch = line.match(/(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|Present)/i) ||
                     line.match(/(\d{4})\s*[-–]\s*(\d{4}|Present)/i) ||
                     line.match(/(\w+\s+\d{4})\s*[-–]\s*(Present)/i);
    
    if (dateMatch) {
      // Save previous experience
      if (currentExp) {
        resume.experience.push(currentExp);
      }
      
      // Start new experience
      currentExp = {
        id: Date.now().toString() + Math.random(),
        position: '',
        company: '',
        location: '',
        startDate: dateMatch[1],
        endDate: dateMatch[2],
        current: dateMatch[2].toLowerCase() === 'present',
        description: []
      };
      
      // Look for position and company in nearby lines
      for (let j = Math.max(0, i - 3); j < Math.min(lines.length, i + 3); j++) {
        if (j === i) continue;
        
        const nearbyLine = lines[j];
        if (nearbyLine && nearbyLine.length > 2 && nearbyLine.length < 100 &&
            !nearbyLine.match(/\d{4}/) && !nearbyLine.includes('@')) {
          
          if (!currentExp.position) {
            currentExp.position = nearbyLine;
          } else if (!currentExp.company) {
            currentExp.company = nearbyLine;
          }
        }
      }
    } else if (currentExp && line.length > 10 && 
               !line.match(/\d{4}/) && 
               line.includes(' ')) {
      // Add to description
      currentExp.description.push(line);
    }
  }
  
  // Add the last experience
  if (currentExp) {
    resume.experience.push(currentExp);
  }
};

const extractEducation = (lines: string[], resume: ResumeData) => {
  let currentEdu: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for date patterns
    const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4})/);
    
    if (dateMatch) {
      // Save previous education
      if (currentEdu) {
        resume.education.push(currentEdu);
      }
      
      // Start new education
      currentEdu = {
        id: Date.now().toString() + Math.random(),
        degree: '',
        school: '',
        location: '',
        startDate: dateMatch[1],
        endDate: dateMatch[2]
      };
      
      // Look for degree and school in nearby lines
      for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 2); j++) {
        if (j === i) continue;
        
        const nearbyLine = lines[j];
        if (nearbyLine && nearbyLine.length > 2 && 
            !nearbyLine.match(/\d{4}/) && !nearbyLine.includes('@')) {
          
          if (!currentEdu.degree) {
            currentEdu.degree = nearbyLine;
          } else if (!currentEdu.school) {
            currentEdu.school = nearbyLine;
          }
        }
      }
    }
  }
  
  // Add the last education
  if (currentEdu) {
    resume.education.push(currentEdu);
  }
};

const extractSkills = (lines: string[], resume: ResumeData) => {
  const skillsText = lines.join(' ');
  
  // Common skill separators
  const skills = skillsText.split(/[,•·\n]/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 1 && skill.length < 50)
    .slice(0, 20); // Limit to 20 skills
  
  skills.forEach(skill => {
    resume.skills.push({
      id: Date.now().toString() + Math.random(),
      name: skill,
      level: 'Intermediate'
    });
  });
};