import * as pdfjsLib from 'pdfjs-dist';
import { ResumeData } from '../types/resume';

// Use local worker script from pdfjs-dist
// eslint-disable-next-line @typescript-eslint/no-require-imports
pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.min.js');

export const parsePDFFile = async (file: File): Promise<ResumeData> => {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = '';

  interface TextItem { str: string }

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items = content.items as TextItem[];
    const pageText = items.map(it => it.str.trim()).join('\n');
    text += pageText + '\n';
  }

  return parseLinkedInText(text);
};

const parseLinkedInText = (rawText: string): ResumeData => {
  const lines = rawText.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const sections = splitSections(lines);

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

  extractPersonalInfo(lines, resume);
  if (sections.about) extractSummary(sections.about, resume);
  if (sections.experience) extractExperience(sections.experience, resume);
  if (sections.education) extractEducation(sections.education, resume);
  if (sections.skills) extractSkills(sections.skills, resume);
  if (sections['licenses & certifications']) {
    extractCertifications(sections['licenses & certifications'], resume);
  } else if (sections.certifications) {
    extractCertifications(sections.certifications, resume);
  }

  return resume;
};

const headings = [
  'about',
  'summary',
  'experience',
  'education',
  'skills',
  'certifications',
  'licenses & certifications',
  'projects',
  'languages',
  'volunteering'
];

const splitSections = (lines: string[]): Record<string, string[]> => {
  const result: Record<string, string[]> = {};
  let current = 'header';
  result[current] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (headings.includes(lower)) {
      current = lower;
      result[current] = [];
      continue;
    }
    result[current].push(line);
  }

  return result;
};

const extractPersonalInfo = (lines: string[], resume: ResumeData) => {
  const text = lines.join(' ');

  const email = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  if (email) resume.personalInfo.email = email[0];

  const phone = text.match(/(\+?\d[\d\s.-]{8,}\d)/);
  if (phone) resume.personalInfo.phone = phone[0];

  // eslint-disable-next-line no-useless-escape
  const linkedin = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[A-Za-z0-9\/-_?=&#]+/);
  if (linkedin) resume.personalInfo.linkedin = linkedin[0];

  const website = text.match(/https?:\/\/(?!.*linkedin\.com)[^\s]+/);
  if (website) resume.personalInfo.website = website[0];

  // Simple name/title heuristics
  resume.personalInfo.name = lines[0] || '';
  resume.personalInfo.title = lines[1] || '';

  const locationLine = lines.find(l => /,/.test(l));
  if (locationLine) resume.personalInfo.location = locationLine;
};

const extractSummary = (lines: string[], resume: ResumeData) => {
  resume.summary = lines.join(' ');
};

const dateRegex = /([A-Za-z]+ \d{4})\s*[-\u2013]\s*(Present|\d{4}|[A-Za-z]+ \d{4})/i;

const extractExperience = (lines: string[], resume: ResumeData) => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = dateRegex.exec(line);
    if (match) {
      const position = lines[i - 1] || '';
      const company = lines[i - 2] || '';
      const startDate = match[1];
      const endDate = match[2];
      const current = /present/i.test(endDate);
      const description: string[] = [];
      i++;
      while (i < lines.length && !dateRegex.test(lines[i])) {
        description.push(lines[i]);
        i++;
      }
      i--;
      resume.experience.push({
        id: `${resume.experience.length + 1}`,
        position,
        company,
        location: '',
        startDate,
        endDate,
        current,
        description
      });
    }
  }
};

const extractEducation = (lines: string[], resume: ResumeData) => {
  const eduRegex = /(\d{4})\s*[-\u2013]\s*(\d{4}|Present)/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = eduRegex.exec(line);
    if (match) {
      const school = lines[i - 1] || '';
      const degree = lines[i - 2] || 'Degree';
      resume.education.push({
        id: `${resume.education.length + 1}`,
        degree,
        school,
        location: '',
        startDate: match[1],
        endDate: match[2]
      });
    }
  }
};

const extractSkills = (lines: string[], resume: ResumeData) => {
  const skills = lines.join(' ').split(/[,\u2022-]/).map(s => s.trim()).filter(Boolean);
  skills.forEach(skill => {
    resume.skills.push({
      id: `${resume.skills.length + 1}`,
      name: skill,
      level: 'Intermediate'
    });
  });
};

const extractCertifications = (lines: string[], resume: ResumeData) => {
  lines.forEach(line => {
    if (line.length > 3) {
      resume.certifications.push({
        id: `${resume.certifications.length + 1}`,
        name: line,
        issuer: '',
        date: ''
      });
    }
  });
};

