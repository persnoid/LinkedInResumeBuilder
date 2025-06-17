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
    const yDiff = b.y - a.y;
    if (Math.abs(yDiff) > 5) return yDiff;
    return a.x - b.x;
  });

  const lines = groupTextIntoLines(textItems);
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

  const sectionOrder = [
    "Personal Information",
    "Professional Summary",
    "Work Experience",
    "Skills",
    "Education",
    "Certifications",
    "Languages"
  ];

  // Find indices of section headers
  const sectionIndices: { [key: string]: number } = {};
  lines.forEach((line, i) => {
    sectionOrder.forEach(section => {
      if (line.trim().replace(/:$/, '').toLowerCase() === section.toLowerCase()) {
        sectionIndices[section] = i;
      }
    });
  });

  // Helper: get all lines between a section header and the next
  function getSectionLines(section: string): string[] {
    const start = sectionIndices[section];
    if (start === undefined) return [];
    const nextSections = sectionOrder
      .filter(s => s !== section)
      .map(s => sectionIndices[s])
      .filter(idx => idx !== undefined && idx > start);
    const end = nextSections.length > 0 ? Math.min(...nextSections) : lines.length;
    return lines.slice(start + 1, end);
  }

  // --- PERSONAL INFORMATION ---
  getSectionLines("Personal Information").forEach(line => {
    const match = line.match(/^([A-Za-z\s]+):?\s*(.+)$/);
    if (match) {
      const label = match[1].trim().toLowerCase();
      const value = match[2].trim();

      if (label === "location") {
        const isLikelyLocation =
          value.length < 40 &&
          !/\b(is|was|led|work|build|develop|specialize|help|can|enjoy|teams?|strategy|manager|expert|i|my|we|in|on|for)\b/i.test(value) &&
          !/[.!?]/.test(value) &&
          value.split(' ').length <= 4 &&
          /^[A-Za-zÀ-ÿ\s,\-]+$/.test(value);
        if (isLikelyLocation) {
          resume.personalInfo.location = value;
        }
      } else if (label === "email") {
        if (value.includes('@')) resume.personalInfo.email = value;
      } else if (label === "linkedin") {
        if (value.toLowerCase().includes("linkedin.com")) resume.personalInfo.linkedin = value;
      } else if (label === "website") {
        resume.personalInfo.website = value;
      } else if (label in resume.personalInfo) {
        resume.personalInfo[label] = value;
      }
    }
  });

  // --- PROFESSIONAL SUMMARY ---
  const summaryLines = getSectionLines("Professional Summary");
  if (summaryLines.length > 0) {
    resume.summary = summaryLines.join(' ').trim();
  }

  // --- SKILLS ---
  const skillsLines = getSectionLines("Skills");
  if (skillsLines.length > 0) {
    skillsLines.forEach(line => {
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
  }

  // --- WORK EXPERIENCE ---
  const experienceLines = getSectionLines("Work Experience");
  if (experienceLines.length > 0) {
    let currentExp: any = null;
    let i = 0;
    while (i < experienceLines.length) {
      const line = experienceLines[i].trim();
      // Look for date patterns
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
          const prevLine = experienceLines[j].trim();
          if (prevLine && prevLine.length > 2 && prevLine.length < 150 && !prevLine.match(/\d{4}/) && !prevLine.includes('@')) {
            if (!currentExp.position) {
              currentExp.position = prevLine;
            } else if (!currentExp.company && prevLine !== currentExp.position) {
              currentExp.company = prevLine;
            }
          }
        }
        // Look forward for location and description
        for (let j = i + 1; j < Math.min(experienceLines.length, i + 15); j++) {
          const nextLine = experienceLines[j].trim();
          if (nextLine.match(/^([A-Za-z]+\s+\d{4}|^\d{4})\s*[-–]/)) break;
          if (nextLine.includes(',') && nextLine.length < 100 && !currentExp.location) {
            currentExp.location = nextLine;
          } else if (nextLine.length > 20 && currentExp.description.length < 10) {
            currentExp.description.push(nextLine);
          }
        }
      }
      i++;
    }
    if (currentExp && (currentExp.position || currentExp.company)) {
      resume.experience.push(currentExp);
    }
  }

  // --- EDUCATION ---
  const educationLines = getSectionLines("Education");
  if (educationLines.length > 0) {
    let currentEdu: any = null;
    for (let i = 0; i < educationLines.length; i++) {
      const line = educationLines[i].trim();
      const dateMatch = line.match(/^(\d{4})\s*[-–]\s*(\d{4})$/);
      if (dateMatch) {
        if (currentEdu && (currentEdu.degree || currentEdu.school)) {
          resume.education.push(currentEdu);
        }
        currentEdu = {
          id: Date.now().toString() + Math.random(),
          degree: '',
          school: '',
          location: '',
          startDate: dateMatch[1],
          endDate: dateMatch[2]
        };
        for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
          const prevLine = educationLines[j].trim();
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
    if (currentEdu && (currentEdu.degree || currentEdu.school)) {
      resume.education.push(currentEdu);
    }
  }

  // --- CERTIFICATIONS ---
  const certLines = getSectionLines("Certifications");
  if (certLines.length > 0) {
    certLines.forEach(line => {
      const cleanLine = line.trim();
      if (cleanLine.length > 5 && cleanLine.length < 200 && !cleanLine.match(/^\d{4}\s*[-–]/) && !cleanLine.includes('@')) {
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

  // --- LANGUAGES ---
  const langLines = getSectionLines("Languages");
  if (langLines.length > 0) {
    langLines.forEach(line => {
      const cleanLine = line.trim();
      const languageMatch = cleanLine.match(/^([A-Za-zÀ-ÿ\s]+)\s*\(([^)]+)\)$/);
      if (languageMatch) {
        resume.languages!.push({
          id: Date.now().toString() + Math.random(),
          name: languageMatch[1].trim(),
          level: languageMatch[2].trim()
        });
      } else if (cleanLine.length > 2 && cleanLine.length < 50 && !cleanLine.match(/\d{4}/) && !cleanLine.includes('@')) {
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
          resume.languages!.push({
            id: Date.now().toString() + Math.random(),
            name: cleanLine,
            level: 'Unknown'
          });
        }
      }
    });
  }

  return resume;
}
