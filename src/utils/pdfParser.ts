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
  return parseLinkedInPdfResume(lines);
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

function parseLinkedInPdfResume(lines: string[]): ResumeData {
  const resume: ResumeData = {
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    skills: [],
    education: [],
    certifications: [],
    languages: []
  };

  // 1. Parse CONTACT (email, linkedin, etc.)
  let email = '';
  let linkedin = '';
  let website = '';
  lines.forEach(line => {
    if (!email && line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
      email = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)![0];
    }
    if (!linkedin && line.toLowerCase().includes('linkedin.com')) {
      linkedin = line.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s)]+/)?.[0] || '';
    }
    if (!website && line.toLowerCase().startsWith('www.')) {
      website = line.trim();
    }
  });
  resume.personalInfo.email = email;
  resume.personalInfo.linkedin = linkedin;
  resume.personalInfo.website = website;

  // 2. Parse NAME and TITLE
  // Find the first line that looks like a person's name (not an email, not a section, not a URL)
  let nameLineIdx = lines.findIndex(line =>
    /^[A-Z][a-zA-ZäöüßÄÖÜéèàçÉÈÀÇ\s.'\-]+$/.test(line.trim()) &&
    !line.toLowerCase().includes('summary') &&
    !line.toLowerCase().includes('experience')
  );
  if (nameLineIdx !== -1) {
    resume.personalInfo.name = lines[nameLineIdx].trim();
    // Next non-empty line after the name is often the title/headline
    for (let i = nameLineIdx + 1; i < Math.min(lines.length, nameLineIdx + 4); i++) {
      const l = lines[i].trim();
      if (l && !l.match(/@|linkedin|www\./i) && l.length > 4) {
        resume.personalInfo.title = l;
        break;
      }
    }
  }

  // 3. Parse LOCATION
  // Look for a line that is a country/city (Germany, Berlin, etc.)
  let locIdx = lines.findIndex(line => 
    /\b(Germany|Deutschland|Berlin|Munich|Frankfurt|Stuttgart|Europe|USA|United States|France|Paris)\b/i.test(line)
  );
  if (locIdx !== -1) {
    resume.personalInfo.location = lines[locIdx].trim();
  }

  // 4. Parse each block by section header
  function getSectionLines(startToken: string, endTokens: string[]) {
    const startIdx = lines.findIndex(line => line.trim().toLowerCase() === startToken.toLowerCase());
    if (startIdx === -1) return [];
    let endIdx = lines.length;
    for (let t of endTokens) {
      let idx = lines.findIndex((line, i) => i > startIdx && line.trim().toLowerCase() === t.toLowerCase());
      if (idx !== -1 && idx < endIdx) endIdx = idx;
    }
    return lines.slice(startIdx + 1, endIdx).map(l => l.trim()).filter(l => l);
  }

  // 5. Parse Top Skills
  const skillsLines = getSectionLines("Top Skills", ["Languages", "Summary", "ABOUT ME", "Experience", "Education"]);
  if (skillsLines.length) {
    skillsLines.forEach(skill => {
      resume.skills.push({ name: skill });
    });
  }

  // 6. Parse Languages
  const langLines = getSectionLines("Languages", ["Top Skills", "Summary", "ABOUT ME", "Experience", "Education"]);
  if (langLines.length) {
    langLines.forEach(lang => {
      // Format: English (Full Professional)
      const match = lang.match(/^(.+)\s+\((.+)\)$/);
      if (match) {
        resume.languages.push({ name: match[1], level: match[2] });
      } else {
        resume.languages.push({ name: lang, level: "" });
      }
    });
  }

  // 7. Parse Summary / ABOUT ME
  let summary = getSectionLines("Summary", ["ABOUT ME", "Top Skills", "Languages", "Experience", "Education"]).join(" ");
  if (!summary) summary = getSectionLines("ABOUT ME", ["Summary", "Top Skills", "Languages", "Experience", "Education"]).join(" ");
  resume.summary = summary;

  // 8. Parse Experience
  const expLines = getSectionLines("Experience", ["Education"]);
  // Use a simple logic: new job starts when line matches a company name or role, date, or place
  let expCurrent: any = null;
  expLines.forEach(line => {
    // Job start (look for patterns like CTO, Company, Dates)
    if (/^(.*)\s+(\d{4}|\(Present\))$/.test(line) || /(CTO|Founder|Software|Engineer|Expert|Product|Manager|Lead)/i.test(line)) {
      if (expCurrent) resume.experience.push(expCurrent);
      expCurrent = { title: '', company: '', start: '', end: '', location: '', description: '' };
      // Try to split by role and company
      const m = line.match(/^(.*)\s{2,}(.*)$/);
      if (m) {
        expCurrent.title = m[1];
        expCurrent.company = m[2];
      } else {
        expCurrent.title = line;
      }
    } else if (/(\w+)\s(\d{4})\s*-\s*(Present|\d{4})/.test(line)) {
      // Date line
      const dateMatch = line.match(/(\w+)\s(\d{4})\s*-\s*(Present|\d{4})/);
      if (dateMatch) {
        expCurrent.start = dateMatch[1] + " " + dateMatch[2];
        expCurrent.end = dateMatch[3];
      }
    } else {
      // Otherwise, treat as description
      if (expCurrent) {
        expCurrent.description += " " + line;
      }
    }
  });
  if (expCurrent) resume.experience.push(expCurrent);

  // 9. Parse Education
  const eduLines = getSectionLines("Education", ["Experience"]);
  eduLines.forEach(line => {
    if (/(Master|Bachelor|PhD|Diplom)/i.test(line)) {
      // Degree
      const m = line.match(/(.+),\s*(.+)\s*\((\d{4}.*\d{4})\)/);
      if (m) {
        resume.education.push({
          degree: m[1],
          school: m[2],
          years: m[3]
        });
      } else {
        resume.education.push({
          degree: line,
          school: "",
          years: ""
        });
      }
    } else if (/(\d{4})\s*-\s*(\d{4})/.test(line)) {
      // Date line
      const dateMatch = line.match(/(\d{4})\s*-\s*(\d{4})/);
      if (dateMatch) {
        if (resume.education.length > 0) {
          resume.education[resume.education.length - 1].years = dateMatch[1] + "-" + dateMatch[2];
        }
      }
    } else {
      // School name
      if (resume.education.length && !resume.education[resume.education.length - 1].school) {
        resume.education[resume.education.length - 1].school = line;
      }
    }
  });

  return resume;
}
