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
  
  return parseBlockBasedResume(lines);
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

// Your exact implementation integrated
function parseBlockBasedResume(lines: string[]): ResumeData {
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
    skills: [],
    education: [],
    certifications: [],
    languages: []
  };

  console.log('Processing lines:', lines.slice(0, 20));

  // Step 1: Find section headers and ranges
  const sectionOrder = [
    "Personal Information",
    "Professional Summary", 
    "Work Experience",
    "Skills",
    "Education",
    "Certifications",
    "Languages"
  ];

  // Map section to lines
  const sectionIndices: { [key: string]: number } = {};
  lines.forEach((line, i) => {
    sectionOrder.forEach(section => {
      if (line.trim().toLowerCase() === section.toLowerCase()) {
        sectionIndices[section] = i;
        console.log(`Found section "${section}" at line ${i}: "${line}"`);
      }
    });
  });

  console.log('Section indices:', sectionIndices);

  // Helper: get lines for a section
  function getSectionLines(section: string): string[] {
    const start = sectionIndices[section];
    if (start === undefined) return [];
    // Find the next section's start, or end of document
    const sectionList = sectionOrder.filter(s => s !== section);
    let end = lines.length;
    for (let s of sectionList) {
      if (sectionIndices[s] !== undefined && sectionIndices[s] > start) {
        end = Math.min(end, sectionIndices[s]);
      }
    }
    const sectionLines = lines.slice(start + 1, end);
    console.log(`Section "${section}" lines:`, sectionLines);
    return sectionLines;
  }

  // Step 2: Parse "Personal Information"
  getSectionLines("Personal Information").forEach(line => {
    // Looks for lines like "Name: John Doe"
    const match = line.match(/^([A-Za-z\s]+):\s*(.*)$/);
    if (match) {
      const label = match[1].trim().toLowerCase();
      const value = match[2].trim();
      console.log(`Found label "${label}" with value "${value}"`);
      
      if (label === "name") resume.personalInfo.name = value;
      if (label === "title") resume.personalInfo.title = value;
      if (label === "email") resume.personalInfo.email = value;
      if (label === "phone") resume.personalInfo.phone = value;
      if (label === "location") resume.personalInfo.location = value;
      if (label === "linkedin") resume.personalInfo.linkedin = value;
    }
  });

  // If no explicit Personal Information section found, extract from header
  if (!sectionIndices["Personal Information"]) {
    console.log('No Personal Information section found, extracting from header');
    extractPersonalInfoFromHeader(lines, resume);
  }

  // Step 3: Parse "Professional Summary"
  const summaryLines = getSectionLines("Professional Summary");
  if (summaryLines.length > 0) {
    resume.summary = summaryLines.join(' ').trim();
  } else {
    // Try alternative section names
    const alternativeSummaryNames = ["Summary", "About", "About Me", "Profile", "Overview"];
    for (const altName of alternativeSummaryNames) {
      const altIndex = lines.findIndex(line => line.trim().toLowerCase() === altName.toLowerCase());
      if (altIndex !== -1) {
        const nextSectionIndex = lines.findIndex((line, i) => 
          i > altIndex && sectionOrder.some(section => 
            line.trim().toLowerCase() === section.toLowerCase()
          )
        );
        const endIndex = nextSectionIndex !== -1 ? nextSectionIndex : lines.length;
        resume.summary = lines.slice(altIndex + 1, endIndex).join(' ').trim();
        break;
      }
    }
  }

  // Step 4: Parse "Skills"
  const skillsLines = getSectionLines("Skills");
  if (skillsLines.length > 0) {
    skillsLines.forEach(line => {
      const cleanLine = line.trim();
      if (cleanLine.length > 0 && !cleanLine.match(/^\d{4}/)) {
        // Split by common separators and add each skill
        const skills = cleanLine.split(/[,•·\|\n\t]/)
          .map(skill => skill.trim())
          .filter(skill => skill.length > 1 && skill.length < 60);
        
        skills.forEach(skill => {
          resume.skills.push({
            id: Date.now().toString() + Math.random(),
            name: skill,
            level: 'Intermediate'
          });
        });
      }
    });
  } else {
    // Try alternative section names
    const alternativeSkillNames = ["Top Skills", "Technical Skills", "Competencies"];
    for (const altName of alternativeSkillNames) {
      const altIndex = lines.findIndex(line => line.trim().toLowerCase() === altName.toLowerCase());
      if (altIndex !== -1) {
        const nextSectionIndex = lines.findIndex((line, i) => 
          i > altIndex && sectionOrder.some(section => 
            line.trim().toLowerCase() === section.toLowerCase()
          )
        );
        const endIndex = nextSectionIndex !== -1 ? nextSectionIndex : lines.length;
        const altSkillsLines = lines.slice(altIndex + 1, endIndex);
        
        altSkillsLines.forEach(line => {
          const cleanLine = line.trim();
          if (cleanLine.length > 0 && !cleanLine.match(/^\d{4}/)) {
            const skills = cleanLine.split(/[,•·\|\n\t]/)
              .map(skill => skill.trim())
              .filter(skill => skill.length > 1 && skill.length < 60);
            
            skills.forEach(skill => {
              resume.skills.push({
                id: Date.now().toString() + Math.random(),
                name: skill,
                level: 'Intermediate'
              });
            });
          }
        });
        break;
      }
    }
  }

  // Step 5: Parse "Work Experience"
  const experienceLines = getSectionLines("Work Experience");
  if (experienceLines.length > 0) {
    parseExperienceSection(experienceLines, resume);
  } else {
    // Try alternative section names
    const alternativeExpNames = ["Experience", "Employment", "Work History", "Career"];
    for (const altName of alternativeExpNames) {
      const altIndex = lines.findIndex(line => line.trim().toLowerCase() === altName.toLowerCase());
      if (altIndex !== -1) {
        const nextSectionIndex = lines.findIndex((line, i) => 
          i > altIndex && sectionOrder.some(section => 
            line.trim().toLowerCase() === section.toLowerCase()
          )
        );
        const endIndex = nextSectionIndex !== -1 ? nextSectionIndex : lines.length;
        const altExpLines = lines.slice(altIndex + 1, endIndex);
        parseExperienceSection(altExpLines, resume);
        break;
      }
    }
  }

  // Step 6: Parse "Education"
  const educationLines = getSectionLines("Education");
  if (educationLines.length > 0) {
    parseEducationSection(educationLines, resume);
  }

  // Step 7: Parse "Languages"
  const languageLines = getSectionLines("Languages");
  if (languageLines.length > 0) {
    parseLanguagesSection(languageLines, resume);
  }

  // Step 8: Parse "Certifications"
  const certificationLines = getSectionLines("Certifications");
  if (certificationLines.length > 0) {
    parseCertificationsSection(certificationLines, resume);
  }

  console.log('Final parsed resume:', resume);
  return resume;
}

// Helper function to extract personal info from header when no explicit section exists
function extractPersonalInfoFromHeader(lines: string[], resume: ResumeData) {
  const headerLines = lines.slice(0, 20); // First 20 lines
  
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
}

// Helper function to parse experience section
function parseExperienceSection(lines: string[], resume: ResumeData) {
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
}

// Helper function to parse education section
function parseEducationSection(lines: string[], resume: ResumeData) {
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
}

// Helper function to parse languages section
function parseLanguagesSection(lines: string[], resume: ResumeData) {
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
}

// Helper function to parse certifications section
function parseCertificationsSection(lines: string[], resume: ResumeData) {
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
}