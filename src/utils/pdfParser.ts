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

  // Step 1: Extract Contact/Personal Information
  extractContactInfo(lines, fullText, resume);
  
  // Step 2: Identify and separate main sections
  const sections = identifyMainSections(lines);
  console.log('Identified sections:', Object.keys(sections));
  
  // Step 3: Extract data from each section
  extractSectionData(sections, resume);

  console.log('Final parsed resume:', resume);
  return resume;
};

const extractContactInfo = (lines: string[], fullText: string, resume: ResumeData) => {
  // Extract name - usually the first substantial line (large font at top)
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip LinkedIn URLs, emails, and other non-name content
    if (line.includes('linkedin.com') || 
        line.includes('@') || 
        line.includes('http') ||
        line.toLowerCase().includes('resume') ||
        line.toLowerCase().includes('cv') ||
        line.length < 3 ||
        line.length > 60) {
      continue;
    }
    
    // Name should contain only letters, spaces, and common name characters
    if (/^[A-Za-zÀ-ÿ\s\-'\.]+$/.test(line) && !line.match(/\d/)) {
      resume.personalInfo.name = line;
      break;
    }
  }

  // Extract headline/title - directly below name
  const nameIndex = lines.findIndex(line => line.trim() === resume.personalInfo.name);
  if (nameIndex >= 0) {
    for (let i = nameIndex + 1; i < Math.min(nameIndex + 5, lines.length); i++) {
      const line = lines[i].trim();
      
      // Skip URLs and emails
      if (line.includes('linkedin.com') || line.includes('@') || line.includes('http')) {
        continue;
      }
      
      // Clean up the title line - remove LinkedIn URLs and follow text
      let title = line;
      title = title.replace(/www\.linkedin\.com\/in\/[^\s]+/gi, '');
      title = title.replace(/Follow for.*$/gi, '');
      title = title.replace(/\|.*$/g, '');
      title = title.trim();
      
      if (title.length > 5 && title.length <= 200 && !title.match(/^\d{4}/)) {
        resume.personalInfo.title = title;
        break;
      }
    }
  }

  // Extract email address
  const emailMatch = fullText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    resume.personalInfo.email = emailMatch[1];
  }

  // Extract LinkedIn URL
  const linkedinMatch = fullText.match(/((?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s]+)/);
  if (linkedinMatch) {
    let linkedinUrl = linkedinMatch[1];
    if (!linkedinUrl.startsWith('http')) {
      linkedinUrl = 'https://' + linkedinUrl;
    }
    resume.personalInfo.linkedin = linkedinUrl;
  }

  // Extract location - look for patterns like "City, Country" or "City, State, Country"
  const locationPatterns = [
    /([A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+)/,
    /([A-Za-zÀ-ÿ\s]+,\s*[A-Za-zÀ-ÿ\s]+)/,
    /\b([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)*)\s*,\s*([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)*)\b/
  ];
  
  for (const pattern of locationPatterns) {
    const locationMatch = fullText.match(pattern);
    if (locationMatch && locationMatch[1].length < 100 && 
        !locationMatch[1].includes('@') && 
        !locationMatch[1].includes('http')) {
      resume.personalInfo.location = locationMatch[1].trim();
      break;
    }
  }

  // Extract phone number
  const phonePatterns = [
    /(\+?[\d\s\-\(\)\.]{10,})/g,
    /(\(\d{3}\)\s*\d{3}-\d{4})/g,
    /(\d{3}-\d{3}-\d{4})/g
  ];
  
  for (const pattern of phonePatterns) {
    const phoneMatch = fullText.match(pattern);
    if (phoneMatch) {
      const phone = phoneMatch[1].replace(/[^\d\+\(\)\-\s]/g, '');
      const digitCount = phone.replace(/[^\d]/g, '').length;
      if (digitCount >= 10 && digitCount <= 15) {
        resume.personalInfo.phone = phone.trim();
        break;
      }
    }
  }
};

const identifyMainSections = (lines: string[]) => {
  const sections: { [key: string]: string[] } = {};
  let currentSection = '';
  let sectionStart = -1;

  // Section header patterns based on actual LinkedIn PDF structure
  const sectionPatterns = {
    'skills': /^(top skills|skills|competencies|technical skills|fähigkeiten)$/i,
    'languages': /^(languages|sprachen)$/i,
    'summary': /^(summary|about|about me|profile|overview)$/i,
    'experience': /^(experience|employment|work history|career|berufserfahrung)$/i,
    'education': /^(education|academic|qualification|ausbildung|bildung)$/i,
    'certifications': /^(licenses & certifications|certifications|licenses|zertifizierungen)$/i,
    'projects': /^(projects|projekte)$/i,
    'volunteer': /^(volunteer experience|volunteering|ehrenamt)$/i,
    'honors': /^(honors & awards|awards|auszeichnungen)$/i,
    'publications': /^(publications|publikationen)$/i,
    'patents': /^(patents|patente)$/i,
    'courses': /^(courses|kurse)$/i,
    'organizations': /^(organizations|organisationen)$/i,
    'interests': /^(interests|interessen)$/i
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    let foundSection = '';

    // Check if this line is a section header (usually bold or standalone)
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
  // Extract Top Skills
  if (sections.skills) {
    extractSkills(sections.skills, resume);
  }

  // Extract Languages
  if (sections.languages) {
    extractLanguages(sections.languages, resume);
  }

  // Extract Summary/About Me
  if (sections.summary) {
    extractSummary(sections.summary, resume);
  }

  // Extract Experience
  if (sections.experience) {
    extractExperience(sections.experience, resume);
  }

  // Extract Education
  if (sections.education) {
    extractEducation(sections.education, resume);
  }

  // Extract Certifications
  if (sections.certifications) {
    extractCertifications(sections.certifications, resume);
  }
};

const extractSkills = (lines: string[], resume: ResumeData) => {
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    // Skip lines that look like dates, emails, or other non-skill content
    if (cleanLine.match(/\d{4}/) || 
        cleanLine.includes('@') || 
        cleanLine.includes('http') ||
        cleanLine.length < 2 ||
        cleanLine.length > 100) {
      return;
    }
    
    // Split by common separators and clean up
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

const extractLanguages = (lines: string[], resume: ResumeData) => {
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
    // Handle simple format without parentheses
    else if (cleanLine.length > 2 && cleanLine.length < 50 && 
             !cleanLine.match(/\d{4}/) && 
             !cleanLine.includes('@') &&
             !cleanLine.includes('http')) {
      
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

const extractSummary = (lines: string[], resume: ResumeData) => {
  // Join all lines and clean up
  const summaryText = lines
    .filter(line => {
      const cleanLine = line.trim();
      return cleanLine.length > 10 && 
             !cleanLine.includes('linkedin.com') &&
             !cleanLine.includes('@') &&
             !cleanLine.match(/^\d{4}\s*[-–]\s*/) &&
             !cleanLine.toLowerCase().includes('summary') &&
             !cleanLine.toLowerCase().includes('about me');
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
      /^([A-Za-z]+\s+\d{4})\s*[-–]\s*([A-Za-z]+\s+\d{4}|Present|Heute|Current)$/i,
      /^(\d{4})\s*[-–]\s*(\d{4}|Present|Heute|Current)$/i,
      /^([A-Za-z]+\s+\d{4})\s*[-–]\s*(Present|Heute|Current)$/i
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
        current: /present|heute|current/i.test(dateMatch[2]),
        description: []
      };
      
      // Look backwards for position and company (usually 1-3 lines before dates)
      for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
        const prevLine = lines[j].trim();
        if (prevLine && prevLine.length > 2 && prevLine.length < 150 &&
            !prevLine.match(/\d{4}/) && 
            !prevLine.includes('@') &&
            !prevLine.includes('http')) {
          
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
        
        // Stop if we hit another date pattern (next job)
        if (nextLine.match(/^([A-Za-z]+\s+\d{4}|^\d{4})\s*[-–]/)) {
          break;
        }
        
        // Check for location pattern (contains comma, not too long)
        if (nextLine.includes(',') && nextLine.length < 100 && 
            !nextLine.match(/\d{4}/) && !currentExp.location &&
            !nextLine.includes('@')) {
          currentExp.location = nextLine;
        }
        
        // Check for description (longer lines that aren't dates or locations)
        else if (nextLine.length > 20 && 
                 !nextLine.match(/^[A-Za-z]+\s+\d{4}\s*[-–]/) &&
                 !nextLine.includes('linkedin.com') &&
                 !nextLine.includes('@') &&
                 currentExp.description.length < 10) {
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
      
      // Look backwards for school and degree (usually 1-3 lines before dates)
      for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
        const prevLine = lines[j].trim();
        if (prevLine && prevLine.length > 2 && 
            !prevLine.match(/\d{4}/) && 
            !prevLine.includes('@') &&
            !prevLine.includes('http')) {
          
          // First line back is usually the school
          if (!currentEdu.school) {
            currentEdu.school = prevLine;
          } 
          // Second line back might be degree
          else if (!currentEdu.degree && prevLine !== currentEdu.school) {
            currentEdu.degree = prevLine;
          }
        }
      }
      
      // Look forward for additional info
      for (let j = i + 1; j < Math.min(lines.length, i + 5); j++) {
        const nextLine = lines[j].trim();
        
        // Stop if we hit another date pattern
        if (nextLine.match(/^\d{4}\s*[-–]/)) {
          break;
        }
        
        // Look for location or additional degree info
        if (nextLine.includes(',') && nextLine.length < 100 && !currentEdu.location) {
          currentEdu.location = nextLine;
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
        !cleanLine.match(/^\d{4}\s*[-–]/) &&
        !cleanLine.includes('@') &&
        !cleanLine.toLowerCase().includes('certification')) {
      
      // Try to parse certification with issuer and date
      const parts = cleanLine.split(/[-–|]/);
      
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const issuer = parts[1].trim();
        const date = parts[2]?.trim() || 'N/A';
        
        resume.certifications.push({
          id: Date.now().toString() + Math.random(),
          name: name,
          issuer: issuer,
          date: date
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