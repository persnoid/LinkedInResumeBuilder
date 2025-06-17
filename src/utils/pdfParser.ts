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

  // Extract personal information first
  extractPersonalInfo(lines, fullText, resume);
  
  // Find section boundaries
  const sectionIndices = findSectionBoundaries(lines);
  
  // Extract each section based on boundaries
  if (sectionIndices.summary.start !== -1) {
    extractSummarySection(lines, sectionIndices.summary, resume);
  }
  
  if (sectionIndices.experience.start !== -1) {
    extractExperienceSection(lines, sectionIndices.experience, resume);
  }
  
  if (sectionIndices.education.start !== -1) {
    extractEducationSection(lines, sectionIndices.education, resume);
  }
  
  if (sectionIndices.skills.start !== -1) {
    extractSkillsSection(lines, sectionIndices.skills, resume);
  }

  return resume;
};

const findSectionBoundaries = (lines: string[]) => {
  const sections = {
    summary: { start: -1, end: -1 },
    experience: { start: -1, end: -1 },
    education: { start: -1, end: -1 },
    skills: { start: -1, end: -1 },
    certifications: { start: -1, end: -1 }
  };

  const sectionHeaders = [
    { key: 'summary', patterns: ['summary', 'about', 'profile', 'overview'] },
    { key: 'experience', patterns: ['experience', 'employment', 'work history', 'career', 'professional experience'] },
    { key: 'education', patterns: ['education', 'academic', 'qualification', 'degree'] },
    { key: 'skills', patterns: ['skills', 'competenc', 'technical', 'expertise'] },
    { key: 'certifications', patterns: ['certification', 'license', 'credential'] }
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    
    for (const section of sectionHeaders) {
      if (section.patterns.some(pattern => line.includes(pattern)) && line.length < 50) {
        sections[section.key as keyof typeof sections].start = i + 1;
        
        // Set end of previous section
        const sectionKeys = Object.keys(sections) as Array<keyof typeof sections>;
        for (const key of sectionKeys) {
          if (sections[key].start !== -1 && sections[key].end === -1 && key !== section.key) {
            sections[key].end = i;
          }
        }
        break;
      }
    }
  }

  // Set end for the last section
  const sectionKeys = Object.keys(sections) as Array<keyof typeof sections>;
  for (const key of sectionKeys) {
    if (sections[key].start !== -1 && sections[key].end === -1) {
      sections[key].end = lines.length;
    }
  }

  return sections;
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
  } else {
    // Look for linkedin.com/in/ pattern
    const linkedinPattern = fullText.match(/(linkedin\.com\/in\/[^\s]+)/);
    if (linkedinPattern) {
      resume.personalInfo.linkedin = 'https://www.' + linkedinPattern[1];
    }
  }

  // Extract name and title from first few lines (before any section headers)
  const headerLines = lines.slice(0, 15);
  let nameFound = false;
  
  for (let i = 0; i < headerLines.length; i++) {
    const line = headerLines[i].trim();
    
    // Skip common header words and URLs
    if (line.toLowerCase().includes('resume') || 
        line.toLowerCase().includes('cv') ||
        line.toLowerCase().includes('linkedin.com') ||
        line.toLowerCase().includes('http') ||
        line.includes('@') ||
        line.length < 2) {
      continue;
    }
    
    // Stop if we hit a section header
    if (line.toLowerCase().includes('summary') ||
        line.toLowerCase().includes('experience') ||
        line.toLowerCase().includes('education') ||
        line.toLowerCase().includes('skills')) {
      break;
    }
    
    // Name is usually the first substantial line that looks like a name
    if (!nameFound && line.length > 2 && line.length < 50 && 
        !line.includes('|') && !line.includes('•') &&
        !/\d{4}/.test(line) && !line.includes('Follow')) {
      
      // Check if it looks like a name (contains letters and possibly spaces)
      if (/^[A-Za-z\s]+$/.test(line) && line.split(' ').length <= 4) {
        resume.personalInfo.name = line;
        nameFound = true;
        continue;
      }
    }
    
    // Title comes after name, should be descriptive but not too long
    if (nameFound && !resume.personalInfo.title && 
        line.length > 5 && line.length < 100 &&
        !line.includes('@') && !line.includes('http') &&
        !line.includes('linkedin.com') &&
        !/\d{4}/.test(line)) {
      
      // Clean up the title - remove LinkedIn URL parts and extra text
      let title = line;
      title = title.replace(/www\.linkedin\.com\/in\/[^\s]+/g, '').trim();
      title = title.replace(/Development Expert.*$/g, '').trim();
      title = title.replace(/Follow for.*$/g, '').trim();
      title = title.replace(/\|.*$/g, '').trim();
      
      if (title.length > 5 && title.length < 80) {
        resume.personalInfo.title = title;
        break;
      }
    }
  }

  // Extract location (look for city, country patterns)
  const locationMatch = fullText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  if (locationMatch) {
    resume.personalInfo.location = locationMatch[1];
  }
};

const extractSummarySection = (lines: string[], section: { start: number; end: number }, resume: ResumeData) => {
  if (section.start === -1 || section.end === -1) return;
  
  const summaryLines = lines.slice(section.start, section.end);
  let summary = '';
  
  for (const line of summaryLines) {
    // Skip lines that look like job titles or dates
    if (line.match(/\d{4}\s*-\s*\d{4}/) || 
        line.match(/\d{4}\s*-\s*Present/i) ||
        line.match(/Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember/i) ||
        line.toLowerCase().includes('experience') ||
        line.toLowerCase().includes('education')) {
      break;
    }
    
    summary += line + ' ';
  }
  
  resume.summary = summary.trim();
};

const extractExperienceSection = (lines: string[], section: { start: number; end: number }, resume: ResumeData) => {
  if (section.start === -1 || section.end === -1) return;
  
  const experienceLines = lines.slice(section.start, section.end);
  let currentExp: any = null;
  
  for (let i = 0; i < experienceLines.length; i++) {
    const line = experienceLines[i].trim();
    
    // Look for date patterns (German and English formats)
    const dateMatch = line.match(/(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|Present|Heute)/i) ||
                     line.match(/(\d{4})\s*[-–]\s*(\d{4}|Present|Heute)/i);
    
    if (dateMatch) {
      // Save previous experience
      if (currentExp && (currentExp.position || currentExp.company)) {
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
        current: dateMatch[2].toLowerCase() === 'present' || dateMatch[2].toLowerCase() === 'heute',
        description: []
      };
      
      // Look for position and company in nearby lines
      for (let j = Math.max(0, i - 3); j < Math.min(experienceLines.length, i + 3); j++) {
        if (j === i) continue;
        
        const nearbyLine = experienceLines[j].trim();
        if (nearbyLine && nearbyLine.length > 2 && nearbyLine.length < 100 &&
            !nearbyLine.match(/\d{4}/) && !nearbyLine.includes('@')) {
          
          if (!currentExp.position && !nearbyLine.toLowerCase().includes('experience')) {
            currentExp.position = nearbyLine;
          } else if (!currentExp.company && currentExp.position && nearbyLine !== currentExp.position) {
            currentExp.company = nearbyLine;
          }
        }
      }
    } else if (currentExp && line.length > 10 && 
               !line.match(/\d{4}/) && 
               !line.toLowerCase().includes('education') &&
               !line.toLowerCase().includes('skills')) {
      // Add to description if it's substantial content
      currentExp.description.push(line);
    }
  }
  
  // Add the last experience
  if (currentExp && (currentExp.position || currentExp.company)) {
    resume.experience.push(currentExp);
  }
};

const extractEducationSection = (lines: string[], section: { start: number; end: number }, resume: ResumeData) => {
  if (section.start === -1 || section.end === -1) return;
  
  const educationLines = lines.slice(section.start, section.end);
  let currentEdu: any = null;
  
  for (let i = 0; i < educationLines.length; i++) {
    const line = educationLines[i].trim();
    
    // Look for date patterns
    const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4})/);
    
    if (dateMatch) {
      // Save previous education
      if (currentEdu && (currentEdu.degree || currentEdu.school)) {
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
      for (let j = Math.max(0, i - 2); j < Math.min(educationLines.length, i + 2); j++) {
        if (j === i) continue;
        
        const nearbyLine = educationLines[j].trim();
        if (nearbyLine && nearbyLine.length > 2 && 
            !nearbyLine.match(/\d{4}/) && !nearbyLine.includes('@')) {
          
          if (!currentEdu.degree) {
            currentEdu.degree = nearbyLine;
          } else if (!currentEdu.school && nearbyLine !== currentEdu.degree) {
            currentEdu.school = nearbyLine;
          }
        }
      }
    }
  }
  
  // Add the last education
  if (currentEdu && (currentEdu.degree || currentEdu.school)) {
    resume.education.push(currentEdu);
  }
};

const extractSkillsSection = (lines: string[], section: { start: number; end: number }, resume: ResumeData) => {
  if (section.start === -1 || section.end === -1) return;
  
  const skillsLines = lines.slice(section.start, section.end);
  const skillsText = skillsLines.join(' ');
  
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