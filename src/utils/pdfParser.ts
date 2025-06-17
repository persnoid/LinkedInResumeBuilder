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

export const parseLinkedInContent = (lines: string[], fullText: string): ResumeData => {
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

  console.log('Parsing lines:', lines.slice(0, 20)); // Debug log

  // Extract personal information from header
  extractPersonalInfoFromHeader(lines, resume);
  
  // Extract contact information from full text
  extractContactInfo(fullText, resume);
  
  // Parse content sections
  parseContentSections(lines, resume);

  return resume;
};

const extractPersonalInfoFromHeader = (lines: string[], resume: ResumeData) => {
  // Look for name in first few lines - typically the largest/first text
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip empty lines, URLs, and common headers
    if (!line || 
        line.includes('linkedin.com') || 
        line.includes('http') ||
        line.includes('@') ||
        line.toLowerCase().includes('resume') ||
        line.toLowerCase().includes('cv')) {
      continue;
    }
    
    // Name should be relatively short and contain only letters and spaces
    if (line.length >= 3 && line.length <= 50 && 
        /^[A-Za-z\s\-'\.]+$/.test(line) && 
        !resume.personalInfo.name) {
      resume.personalInfo.name = line;
      continue;
    }
    
    // Title comes after name - look for professional titles
    if (resume.personalInfo.name && !resume.personalInfo.title && 
        line.length > 5 && line.length <= 100) {
      
      // Clean up title - remove LinkedIn URL and extra text
      let title = line;
      title = title.replace(/www\.linkedin\.com\/in\/[^\s]+/gi, '');
      title = title.replace(/Development Expert.*$/gi, '');
      title = title.replace(/Follow for.*$/gi, '');
      title = title.replace(/\|.*$/g, '');
      title = title.trim();
      
      // Check if it looks like a professional title
      if (title.length > 3 && title.length <= 80 && 
          !title.includes('@') && 
          !title.includes('http')) {
        resume.personalInfo.title = title;
        break;
      }
    }
  }
};

const extractContactInfo = (fullText: string, resume: ResumeData) => {
  // Extract email
  const emailMatch = fullText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    resume.personalInfo.email = emailMatch[1];
  }

  // Extract phone number
  const phonePatterns = [
    /(\+\d{1,3}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,9})/,
    /(\(\d{3}\)[\s\-]?\d{3}[\s\-]?\d{4})/,
    /(\d{3}[\s\-]?\d{3}[\s\-]?\d{4})/
  ];
  
  for (const pattern of phonePatterns) {
    const phoneMatch = fullText.match(pattern);
    if (phoneMatch) {
      resume.personalInfo.phone = phoneMatch[1].trim();
      break;
    }
  }

  // Extract LinkedIn URL
  const linkedinMatch = fullText.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s]+)/);
  if (linkedinMatch) {
    resume.personalInfo.linkedin = linkedinMatch[1];
  } else {
    const linkedinPattern = fullText.match(/(linkedin\.com\/in\/[^\s]+)/);
    if (linkedinPattern) {
      resume.personalInfo.linkedin = 'https://www.' + linkedinPattern[1];
    }
  }

  // Extract location
  const locationPatterns = [
    /([A-Z][a-z]+,\s*[A-Z][a-z]+)/,
    /([A-Z][a-z]+\s+[A-Z][a-z]+,\s*[A-Z][a-z]+)/
  ];
  
  for (const pattern of locationPatterns) {
    const locationMatch = fullText.match(pattern);
    if (locationMatch) {
      resume.personalInfo.location = locationMatch[1];
      break;
    }
  }
};

const parseContentSections = (lines: string[], resume: ResumeData) => {
  let currentSection = '';
  let sectionContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Detect section headers
    if (isHeaderLine(line)) {
      // Process previous section
      if (currentSection && sectionContent.length > 0) {
        processSection(currentSection, sectionContent, resume);
      }
      
      // Start new section
      currentSection = detectSectionType(lowerLine);
      sectionContent = [];
      continue;
    }
    
    // Add content to current section
    if (currentSection && line.length > 0) {
      sectionContent.push(line);
    }
  }
  
  // Process the last section
  if (currentSection && sectionContent.length > 0) {
    processSection(currentSection, sectionContent, resume);
  }
};

const isHeaderLine = (line: string): boolean => {
  const lowerLine = line.toLowerCase();
  const headerKeywords = [
    'summary', 'about', 'profile', 'overview',
    'experience', 'employment', 'work history', 'career',
    'education', 'academic', 'qualification',
    'skills', 'competencies', 'technical skills',
    'certifications', 'licenses', 'credentials',
    'languages'
  ];
  
  return headerKeywords.some(keyword => 
    lowerLine.includes(keyword) && 
    line.length < 50 && 
    !line.includes('@') && 
    !line.includes('http')
  );
};

const detectSectionType = (lowerLine: string): string => {
  if (lowerLine.includes('summary') || lowerLine.includes('about') || lowerLine.includes('profile')) {
    return 'summary';
  }
  if (lowerLine.includes('experience') || lowerLine.includes('employment') || lowerLine.includes('career')) {
    return 'experience';
  }
  if (lowerLine.includes('education') || lowerLine.includes('academic')) {
    return 'education';
  }
  if (lowerLine.includes('skill') || lowerLine.includes('competenc')) {
    return 'skills';
  }
  if (lowerLine.includes('certification') || lowerLine.includes('license')) {
    return 'certifications';
  }
  if (lowerLine.includes('language')) {
    return 'languages';
  }
  return '';
};

const processSection = (sectionType: string, content: string[], resume: ResumeData) => {
  switch (sectionType) {
    case 'summary':
      processSummarySection(content, resume);
      break;
    case 'experience':
      processExperienceSection(content, resume);
      break;
    case 'education':
      processEducationSection(content, resume);
      break;
    case 'skills':
      processSkillsSection(content, resume);
      break;
    case 'certifications':
      processCertificationsSection(content, resume);
      break;
    case 'languages':
      processLanguagesSection(content, resume);
      break;
  }
};

const processSummarySection = (content: string[], resume: ResumeData) => {
  // Join all content lines for summary, filtering out obvious non-summary content
  const summaryText = content
    .filter(line => 
      !line.match(/\d{4}\s*[-–]\s*\d{4}/) && 
      !line.match(/\d{4}\s*[-–]\s*(Present|Heute)/i) &&
      line.length > 10
    )
    .join(' ')
    .trim();
  
  if (summaryText.length > 20) {
    resume.summary = summaryText;
  }
};

const processExperienceSection = (content: string[], resume: ResumeData) => {
  let currentExp: any = null;
  
  for (let i = 0; i < content.length; i++) {
    const line = content[i].trim();
    
    // Look for date patterns
    const dateMatch = line.match(/(\w+\s+\d{4}|^\d{4})\s*[-–]\s*(\w+\s+\d{4}|\d{4}|Present|Heute|Current)/i);
    
    if (dateMatch) {
      // Save previous experience
      if (currentExp && (currentExp.position || currentExp.company)) {
        resume.experience.push(currentExp);
      }
      
      // Create new experience
      currentExp = {
        id: Date.now().toString() + Math.random(),
        position: '',
        company: '',
        location: '',
        startDate: dateMatch[1],
        endDate: dateMatch[2],
        current: /present|heute|current/i.test(dateMatch[2]),
        description: []
      };
      
      // Look for position and company in surrounding lines
      const searchRange = 3;
      for (let j = Math.max(0, i - searchRange); j < Math.min(content.length, i + searchRange + 1); j++) {
        if (j === i) continue;
        
        const nearbyLine = content[j].trim();
        if (nearbyLine && nearbyLine.length > 2 && nearbyLine.length < 100 &&
            !nearbyLine.match(/\d{4}/) && !nearbyLine.includes('@') &&
            !nearbyLine.toLowerCase().includes('experience')) {
          
          if (!currentExp.position) {
            currentExp.position = nearbyLine;
          } else if (!currentExp.company && nearbyLine !== currentExp.position) {
            currentExp.company = nearbyLine;
          }
        }
      }
    } else if (currentExp && line.length > 15 && 
               !line.match(/\d{4}/) && 
               !isHeaderLine(line)) {
      // Add substantial content as description
      currentExp.description.push(line);
    }
  }
  
  // Add the last experience
  if (currentExp && (currentExp.position || currentExp.company)) {
    resume.experience.push(currentExp);
  }
};

const processEducationSection = (content: string[], resume: ResumeData) => {
  let currentEdu: any = null;
  
  for (let i = 0; i < content.length; i++) {
    const line = content[i].trim();
    
    // Look for education date patterns
    const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4})/);
    
    if (dateMatch) {
      // Save previous education
      if (currentEdu && (currentEdu.degree || currentEdu.school)) {
        resume.education.push(currentEdu);
      }
      
      // Create new education entry
      currentEdu = {
        id: Date.now().toString() + Math.random(),
        degree: '',
        school: '',
        location: '',
        startDate: dateMatch[1],
        endDate: dateMatch[2]
      };
      
      // Look for degree and school in nearby lines
      for (let j = Math.max(0, i - 2); j < Math.min(content.length, i + 3); j++) {
        if (j === i) continue;
        
        const nearbyLine = content[j].trim();
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

const processSkillsSection = (content: string[], resume: ResumeData) => {
  const skillsText = content.join(' ');
  
  // Split by common separators and clean up
  const skills = skillsText
    .split(/[,•·\n\|]/)
    .map(skill => skill.trim())
    .filter(skill => 
      skill.length > 1 && 
      skill.length < 50 && 
      !skill.match(/\d{4}/) && // No years
      !skill.includes('@') && // No emails
      !skill.includes('http') // No URLs
    )
    .slice(0, 20); // Limit to 20 skills
  
  skills.forEach(skill => {
    if (skill.length > 1) {
      resume.skills.push({
        id: Date.now().toString() + Math.random(),
        name: skill,
        level: 'Intermediate'
      });
    }
  });
};

const processCertificationsSection = (content: string[], resume: ResumeData) => {
  // Look for certification patterns
  content.forEach(line => {
    if (line.length > 5 && line.length < 100 && !line.match(/\d{4}\s*[-–]\s*\d{4}/)) {
      const parts = line.split(/[-–|]/);
      if (parts.length >= 2) {
        resume.certifications.push({
          id: Date.now().toString() + Math.random(),
          name: parts[0].trim(),
          issuer: parts[1].trim(),
          date: parts[2]?.trim() || 'N/A'
        });
      }
    }
  });
};

const processLanguagesSection = (content: string[], resume: ResumeData) => {
  resume.languages = resume.languages || [];

  content.forEach(line => {
    const match = line.match(/([^()]+)\(([^)]+)\)/);
    if (match) {
      resume.languages!.push({
        id: Date.now().toString() + Math.random(),
        name: match[1].trim(),
        level: match[2].trim()
      });
    }
  });
};