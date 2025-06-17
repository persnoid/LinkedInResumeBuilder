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
  console.log('Extracted lines:', lines.slice(0, 50)); // Debug log
  
  return parseLinkedInContent(lines);
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

const parseLinkedInContent = (lines: string[]): ResumeData => {
  // Initialize the resume data structure
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

  // Step 1: Identify sections
  const sections = identifySections(lines);
  console.log('Identified sections:', Object.keys(sections));

  // Step 2: Extract data from each section
  extractSectionData(sections, resume);

  console.log('Final parsed resume:', resume);
  return resume;
};

const identifySections = (lines: string[]) => {
  const sections: { [key: string]: string[] } = {};
  let currentSection = '';
  let sectionStart = -1;

  // Section header patterns (case-insensitive)
  const sectionPatterns = {
    'personalInfo': /^(personal information|contact|contact information)$/i,
    'summary': /^(professional summary|summary|about|about me|profile|overview)$/i,
    'experience': /^(work experience|experience|employment|work history|career)$/i,
    'skills': /^(skills|top skills|competencies|technical skills)$/i,
    'education': /^(education|academic|qualification)$/i,
    'certifications': /^(certifications|licenses & certifications|licenses)$/i,
    'languages': /^(languages)$/i
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
      // Save previous section content
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

const extractSectionData = (sections: { [key: string]: string[] }, resume: ResumeData) => {
  // Extract Personal Information using label-based parsing
  if (sections.personalInfo) {
    extractPersonalInfo(sections.personalInfo, resume);
  }

  // Extract Professional Summary
  if (sections.summary) {
    extractSummary(sections.summary, resume);
  }

  // Extract Work Experience
  if (sections.experience) {
    extractExperience(sections.experience, resume);
  }

  // Extract Skills
  if (sections.skills) {
    extractSkills(sections.skills, resume);
  }

  // Extract Education
  if (sections.education) {
    extractEducation(sections.education, resume);
  }

  // Extract Certifications
  if (sections.certifications) {
    extractCertifications(sections.certifications, resume);
  }

  // Extract Languages
  if (sections.languages) {
    extractLanguages(sections.languages, resume);
  }

  // If no explicit Personal Information section, extract from beginning
  if (!sections.personalInfo) {
    extractPersonalInfoFromHeader(sections, resume);
  }
};

const extractPersonalInfo = (lines: string[], resume: ResumeData) => {
  // Label-based extraction for Personal Information section
  const labelPatterns = {
    name: /^(name|full name):\s*(.+)$/i,
    title: /^(title|position|job title|headline):\s*(.+)$/i,
    email: /^(email|email address|e-mail):\s*(.+)$/i,
    phone: /^(phone|phone number|telephone|mobile):\s*(.+)$/i,
    location: /^(location|address|city|residence):\s*(.+)$/i,
    linkedin: /^(linkedin|linkedin profile|linkedin url):\s*(.+)$/i
  };

  lines.forEach(line => {
    const cleanLine = line.trim();
    
    // Check for label:value patterns
    for (const [field, pattern] of Object.entries(labelPatterns)) {
      const match = cleanLine.match(pattern);
      if (match && match[2]) {
        const value = match[2].trim();
        
        switch (field) {
          case 'name':
            resume.personalInfo.name = value;
            break;
          case 'title':
            resume.personalInfo.title = value;
            break;
          case 'email':
            resume.personalInfo.email = value;
            break;
          case 'phone':
            resume.personalInfo.phone = value;
            break;
          case 'location':
            resume.personalInfo.location = value;
            break;
          case 'linkedin':
            resume.personalInfo.linkedin = value;
            break;
        }
        return; // Found a match, move to next line
      }
    }

    // If no label found, check for standalone values
    if (cleanLine.includes('@') && !resume.personalInfo.email) {
      const emailMatch = cleanLine.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) {
        resume.personalInfo.email = emailMatch[1];
      }
    }
    
    if (cleanLine.includes('linkedin.com') && !resume.personalInfo.linkedin) {
      const linkedinMatch = cleanLine.match(/((?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+)/);
      if (linkedinMatch) {
        resume.personalInfo.linkedin = linkedinMatch[1];
      }
    }
  });
};

const extractPersonalInfoFromHeader = (sections: { [key: string]: string[] }, resume: ResumeData) => {
  // Extract from the beginning of the document if no explicit Personal Info section
  const allLines = Object.values(sections).flat();
  const headerLines = allLines.slice(0, 20); // First 20 lines

  // Extract name (usually first substantial line)
  for (const line of headerLines) {
    const cleanLine = line.trim();
    if (cleanLine.length > 2 && cleanLine.length < 60 && 
        !cleanLine.includes('@') && !cleanLine.includes('http') &&
        !cleanLine.toLowerCase().includes('resume') &&
        /^[A-Za-zÀ-ÿ\s\-'\.]+$/.test(cleanLine) && 
        !resume.personalInfo.name) {
      resume.personalInfo.name = cleanLine;
      break;
    }
  }

  // Extract other info from full text
  const fullText = headerLines.join(' ');
  
  if (!resume.personalInfo.email) {
    const emailMatch = fullText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      resume.personalInfo.email = emailMatch[1];
    }
  }

  if (!resume.personalInfo.linkedin) {
    const linkedinMatch = fullText.match(/((?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+)/);
    if (linkedinMatch) {
      resume.personalInfo.linkedin = linkedinMatch[1];
    }
  }

  if (!resume.personalInfo.phone) {
    const phoneMatch = fullText.match(/(\+?[\d\s\-\(\)\.]{10,})/);
    if (phoneMatch) {
      const phone = phoneMatch[1].replace(/[^\d\+\(\)\-\s]/g, '');
      const digitCount = phone.replace(/[^\d]/g, '').length;
      if (digitCount >= 10 && digitCount <= 15) {
        resume.personalInfo.phone = phone.trim();
      }
    }
  }

  if (!resume.personalInfo.location) {
    const locationMatch = fullText.match(/([A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+)/);
    if (locationMatch && locationMatch[1].length < 100) {
      resume.personalInfo.location = locationMatch[1].trim();
    }
  }
};

const extractSummary = (lines: string[], resume: ResumeData) => {
  // Join all lines and clean up
  const summaryText = lines
    .filter(line => {
      const cleanLine = line.trim();
      return cleanLine.length > 10 && 
             !cleanLine.toLowerCase().includes('summary') &&
             !cleanLine.toLowerCase().includes('about me') &&
             !cleanLine.includes('linkedin.com') &&
             !cleanLine.includes('@');
    })
    .join(' ')
    .trim();
  
  if (summaryText.length > 20) {
    resume.summary = summaryText;
  }
};

const extractExperience = (lines: string[], resume: ResumeData) => {
  let currentExp: any = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Look for date patterns that indicate a new job
    const datePatterns = [
      /^([A-Za-z]+\s+\d{4})\s*[-–]\s*([A-Za-z]+\s+\d{4}|Present|Current)$/i,
      /^(\d{4})\s*[-–]\s*(\d{4}|Present|Current)$/i,
      /^([A-Za-z]+\s+\d{4})\s*[-–]\s*(Present|Current)$/i
    ];
    
    let dateMatch = null;
    for (const pattern of datePatterns) {
      dateMatch = line.match(pattern);
      if (dateMatch) break;
    }
    
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
        current: /present|current/i.test(dateMatch[2]),
        description: []
      };
      
      // Look backwards for position and company
      for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
        const prevLine = lines[j].trim();
        if (prevLine && prevLine.length > 2 && prevLine.length < 150 &&
            !prevLine.match(/\d{4}/) && !prevLine.includes('@')) {
          
          if (!currentExp.position) {
            currentExp.position = prevLine;
          } else if (!currentExp.company && prevLine !== currentExp.position) {
            currentExp.company = prevLine;
          }
        }
      }
      
      // Look forward for location and description
      for (let j = i + 1; j < Math.min(lines.length, i + 15); j++) {
        const nextLine = lines[j].trim();
        
        // Stop if we hit another date pattern
        if (nextLine.match(/^([A-Za-z]+\s+\d{4}|^\d{4})\s*[-–]/)) {
          break;
        }
        
        if (nextLine.includes(',') && nextLine.length < 100 && !currentExp.location) {
          currentExp.location = nextLine;
        } else if (nextLine.length > 20 && currentExp.description.length < 10) {
          currentExp.description.push(nextLine);
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

const extractSkills = (lines: string[], resume: ResumeData) => {
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    // Skip lines that look like dates, emails, or other non-skill content
    if (cleanLine.match(/\d{4}/) || cleanLine.includes('@') || 
        cleanLine.length < 2 || cleanLine.length > 100) {
      return;
    }
    
    // Split by common separators
    const skills = cleanLine.split(/[,•·\|\n\t]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 1 && skill.length < 60);
    
    skills.forEach(skill => {
      if (skill.length > 1 && !skill.match(/\d{4}/) && !skill.includes('@')) {
        resume.skills.push({
          id: Date.now().toString() + Math.random(),
          name: skill,
          level: 'Intermediate'
        });
      }
    });
  });
};

const extractEducation = (lines: string[], resume: ResumeData) => {
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
      for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
        const prevLine = lines[j].trim();
        if (prevLine && prevLine.length > 2 && !prevLine.match(/\d{4}/)) {
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

const extractCertifications = (lines: string[], resume: ResumeData) => {
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    if (cleanLine.length > 5 && cleanLine.length < 200 && 
        !cleanLine.match(/^\d{4}\s*[-–]/) && !cleanLine.includes('@')) {
      
      // Try to parse certification with issuer and date
      const parts = cleanLine.split(/[-–|]/);
      
      if (parts.length >= 2) {
        resume.certifications.push({
          id: Date.now().toString() + Math.random(),
          name: parts[0].trim(),
          issuer: parts[1].trim(),
          date: parts[2]?.trim() || 'N/A'
        });
      } else {
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

const extractLanguages = (lines: string[], resume: ResumeData) => {
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    // Look for language patterns like "English (Full Professional)"
    const languageMatch = cleanLine.match(/^([A-Za-zÀ-ÿ\s]+)\s*\(([^)]+)\)$/);
    
    if (languageMatch) {
      resume.languages!.push({
        id: Date.now().toString() + Math.random(),
        name: languageMatch[1].trim(),
        level: languageMatch[2].trim()
      });
    }
    // Handle simple format without parentheses
    else if (cleanLine.length > 2 && cleanLine.length < 50 && 
             !cleanLine.match(/\d{4}/) && !cleanLine.includes('@')) {
      
      // Check if it contains proficiency keywords
      const proficiencyKeywords = ['native', 'fluent', 'professional', 'intermediate', 'basic', 'beginner', 'advanced'];
      const hasProficiency = proficiencyKeywords.some(keyword => 
        cleanLine.toLowerCase().includes(keyword)
      );
      
      if (hasProficiency) {
        const parts = cleanLine.split(/[-–]/);
        if (parts.length >= 2) {
          resume.languages!.push({
            id: Date.now().toString() + Math.random(),
            name: parts[0].trim(),
            level: parts[1].trim()
          });
        }
      } else {
        // Simple language name
        resume.languages!.push({
          id: Date.now().toString() + Math.random(),
          name: cleanLine,
          level: 'Unknown'
        });
      }
    }
  });
};