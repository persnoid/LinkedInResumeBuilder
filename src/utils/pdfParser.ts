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
  console.log('Extracted lines:', lines.slice(0, 30)); // Debug log
  
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
    certifications: [],
    languages: []
  };

  // Extract personal information from header (first few lines)
  extractPersonalInfo(lines, fullText, resume);
  
  // Parse sections based on LinkedIn PDF structure
  parseSections(lines, resume);

  console.log('Parsed resume:', resume); // Debug log
  return resume;
};

const extractPersonalInfo = (lines: string[], fullText: string, resume: ResumeData) => {
  // Extract name - usually the first substantial line
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip LinkedIn URLs, emails, and other non-name content
    if (line.includes('linkedin.com') || 
        line.includes('@') || 
        line.includes('http') ||
        line.length < 3 ||
        line.length > 50) {
      continue;
    }
    
    // Name should contain only letters, spaces, and common name characters
    if (/^[A-Za-zÀ-ÿ\s\-'\.]+$/.test(line)) {
      resume.personalInfo.name = line;
      break;
    }
  }

  // Extract title/headline - look for professional title after name
  const nameIndex = lines.findIndex(line => line === resume.personalInfo.name);
  if (nameIndex >= 0) {
    for (let i = nameIndex + 1; i < Math.min(nameIndex + 5, lines.length); i++) {
      const line = lines[i].trim();
      
      // Skip URLs and emails
      if (line.includes('linkedin.com') || line.includes('@') || line.includes('http')) {
        continue;
      }
      
      // Clean up the title line
      let title = line;
      title = title.replace(/www\.linkedin\.com\/in\/[^\s]+/gi, '');
      title = title.replace(/Follow for.*$/gi, '');
      title = title.replace(/\|.*$/g, '');
      title = title.trim();
      
      if (title.length > 5 && title.length <= 150) {
        resume.personalInfo.title = title;
        break;
      }
    }
  }

  // Extract contact information
  const emailMatch = fullText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    resume.personalInfo.email = emailMatch[1];
  }

  const linkedinMatch = fullText.match(/((?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s]+)/);
  if (linkedinMatch) {
    resume.personalInfo.linkedin = linkedinMatch[1].startsWith('http') ? 
      linkedinMatch[1] : 'https://www.' + linkedinMatch[1];
  }

  // Extract location - look for patterns like "City, Country" or "City, State, Country"
  const locationPatterns = [
    /([A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+)/,
    /([A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+)/
  ];
  
  for (const pattern of locationPatterns) {
    const locationMatch = fullText.match(pattern);
    if (locationMatch && locationMatch[1].length < 100) {
      resume.personalInfo.location = locationMatch[1].trim();
      break;
    }
  }
};

const parseSections = (lines: string[], resume: ResumeData) => {
  const sections = identifySections(lines);
  
  console.log('Identified sections:', Object.keys(sections)); // Debug log
  
  // Process each section
  if (sections.summary?.length > 0) {
    processSummary(sections.summary, resume);
  }
  
  if (sections.experience?.length > 0) {
    processExperience(sections.experience, resume);
  }
  
  if (sections.education?.length > 0) {
    processEducation(sections.education, resume);
  }
  
  if (sections.skills?.length > 0) {
    processSkills(sections.skills, resume);
  }
  
  if (sections.languages?.length > 0) {
    processLanguages(sections.languages, resume);
  }
  
  if (sections.certifications?.length > 0) {
    processCertifications(sections.certifications, resume);
  }
};

const identifySections = (lines: string[]) => {
  const sections: { [key: string]: string[] } = {};
  let currentSection = '';
  let sectionStart = -1;

  // Section header patterns based on LinkedIn PDF structure
  const sectionPatterns = {
    summary: /^(summary|about|about me|profile|overview)$/i,
    experience: /^(experience|employment|work history|career|berufserfahrung)$/i,
    education: /^(education|academic|qualification|ausbildung|bildung)$/i,
    skills: /^(skills|competencies|technical skills|top skills|fähigkeiten)$/i,
    languages: /^(languages|sprachen)$/i,
    certifications: /^(licenses & certifications|certifications|licenses|zertifizierungen)$/i,
    projects: /^(projects|projekte)$/i,
    volunteer: /^(volunteer experience|volunteering|ehrenamt)$/i,
    honors: /^(honors & awards|awards|auszeichnungen)$/i
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    let foundSection = '';

    // Check if this line is a section header
    for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line)) {
        foundSection = sectionName;
        break;
      }
    }

    if (foundSection) {
      // Save previous section
      if (currentSection && sectionStart >= 0) {
        sections[currentSection] = lines.slice(sectionStart, i);
      }
      
      // Start new section
      currentSection = foundSection;
      sectionStart = i + 1;
    }
  }

  // Add the last section
  if (currentSection && sectionStart >= 0) {
    sections[currentSection] = lines.slice(sectionStart);
  }

  return sections;
};

const processSummary = (lines: string[], resume: ResumeData) => {
  // Join all lines and clean up
  const summaryText = lines
    .filter(line => 
      line.length > 10 && 
      !line.includes('linkedin.com') &&
      !line.includes('@') &&
      !line.match(/^\d{4}\s*[-–]\s*/)
    )
    .join(' ')
    .trim();
  
  if (summaryText.length > 20) {
    resume.summary = summaryText;
  }
};

const processExperience = (lines: string[], resume: ResumeData) => {
  let currentExp: any = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Look for date patterns that indicate a new job
    const dateMatch = line.match(/^([A-Za-z]+\s+\d{4}|^\d{4})\s*[-–]\s*([A-Za-z]+\s+\d{4}|\d{4}|Present|Heute|Current)$/i);
    
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
      
      // Look backwards for position and company
      for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
        const prevLine = lines[j].trim();
        if (prevLine && prevLine.length > 2 && prevLine.length < 100 &&
            !prevLine.match(/\d{4}/) && !prevLine.includes('@')) {
          
          if (!currentExp.position) {
            currentExp.position = prevLine;
          } else if (!currentExp.company && prevLine !== currentExp.position) {
            currentExp.company = prevLine;
          }
        }
      }
      
      // Look forward for location and description
      for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
        const nextLine = lines[j].trim();
        
        // Check for location pattern
        if (nextLine.includes(',') && nextLine.length < 100 && 
            !nextLine.match(/\d{4}/) && !currentExp.location) {
          currentExp.location = nextLine;
        }
        
        // Check for description (longer lines that aren't dates or locations)
        else if (nextLine.length > 20 && 
                 !nextLine.match(/^[A-Za-z]+\s+\d{4}\s*[-–]/) &&
                 !nextLine.includes('linkedin.com') &&
                 currentExp.description.length < 5) {
          currentExp.description.push(nextLine);
        }
        
        // Stop if we hit another date pattern (next job)
        if (nextLine.match(/^([A-Za-z]+\s+\d{4}|^\d{4})\s*[-–]/)) {
          break;
        }
      }
    }
    
    i++;
  }
  
  // Add the last experience
  if (currentExp && (currentExp.position || currentExp.company)) {
    resume.experience.push(currentExp);
  }
};

const processEducation = (lines: string[], resume: ResumeData) => {
  let currentEdu: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for education date patterns
    const dateMatch = line.match(/^(\d{4})\s*[-–]\s*(\d{4})$/);
    
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
      
      // Look backwards for school and degree
      for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
        const prevLine = lines[j].trim();
        if (prevLine && prevLine.length > 2 && 
            !prevLine.match(/\d{4}/) && !prevLine.includes('@')) {
          
          if (!currentEdu.school) {
            currentEdu.school = prevLine;
          } else if (!currentEdu.degree && prevLine !== currentEdu.school) {
            currentEdu.degree = prevLine;
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

const processSkills = (lines: string[], resume: ResumeData) => {
  // Process each line as potential skills
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    // Skip lines that look like dates or other non-skill content
    if (cleanLine.match(/\d{4}/) || 
        cleanLine.includes('@') || 
        cleanLine.includes('http') ||
        cleanLine.length < 2 ||
        cleanLine.length > 100) {
      return;
    }
    
    // Split by common separators
    const skills = cleanLine.split(/[,•·\|\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 1 && skill.length < 50);
    
    skills.forEach(skill => {
      if (skill.length > 1) {
        resume.skills.push({
          id: Date.now().toString() + Math.random(),
          name: skill,
          level: 'Intermediate'
        });
      }
    });
  });
};

const processLanguages = (lines: string[], resume: ResumeData) => {
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    // Look for language patterns like "English (Full Professional)" or "Deutsch (Full Professional)"
    const languageMatch = cleanLine.match(/^([A-Za-zÀ-ÿ\s]+)\s*\(([^)]+)\)$/);
    
    if (languageMatch) {
      resume.languages!.push({
        id: Date.now().toString() + Math.random(),
        name: languageMatch[1].trim(),
        level: languageMatch[2].trim()
      });
    }
    // Also handle simple format without parentheses
    else if (cleanLine.length > 2 && cleanLine.length < 50 && 
             !cleanLine.match(/\d{4}/) && 
             !cleanLine.includes('@')) {
      resume.languages!.push({
        id: Date.now().toString() + Math.random(),
        name: cleanLine,
        level: 'Unknown'
      });
    }
  });
};

const processCertifications = (lines: string[], resume: ResumeData) => {
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    if (cleanLine.length > 5 && cleanLine.length < 200 && 
        !cleanLine.match(/^\d{4}\s*[-–]/) &&
        !cleanLine.includes('@')) {
      
      // Try to parse certification with issuer
      const parts = cleanLine.split(/[-–|]/);
      
      if (parts.length >= 2) {
        resume.certifications.push({
          id: Date.now().toString() + Math.random(),
          name: parts[0].trim(),
          issuer: parts[1].trim(),
          date: parts[2]?.trim() || 'N/A'
        });
      } else {
        // Single line certification
        resume.certifications.push({
          id: Date.now().toString() + Math.random(),
          name: cleanLine,
          issuer: 'N/A',
          date: 'N/A'
        });
      }
    }
  });
};