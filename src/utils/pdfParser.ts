import { ResumeData } from '../types/resume';

export const parsePDFFile = async (file: File): Promise<ResumeData> => {
  try {
    // Create FormData to send the PDF file
    const formData = new FormData();
    formData.append('pdf', file);

    // Send PDF to Python backend for parsing
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`PDF parsing failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return transformPythonResponse(result.data);
  } catch (error) {
    console.error('PDF parsing error:', error);
    // Fallback to client-side parsing if Python service fails
    return await fallbackClientSideParsing(file);
  }
};

const transformPythonResponse = (data: any): ResumeData => {
  return {
    personalInfo: {
      name: data.personal_info?.name || '',
      title: data.personal_info?.title || '',
      email: data.personal_info?.email || '',
      phone: data.personal_info?.phone || '',
      location: data.personal_info?.location || '',
      linkedin: data.personal_info?.linkedin || '',
      website: data.personal_info?.website || ''
    },
    summary: data.summary || '',
    experience: (data.experience || []).map((exp: any) => ({
      id: exp.id || Date.now().toString() + Math.random(),
      position: exp.position || exp.job_title || '',
      company: exp.company || exp.company_name || '',
      location: exp.location || '',
      startDate: exp.start_date || exp.startDate || '',
      endDate: exp.end_date || exp.endDate || '',
      current: exp.current || false,
      description: Array.isArray(exp.description) ? exp.description : [exp.description || '']
    })),
    education: (data.education || []).map((edu: any) => ({
      id: edu.id || Date.now().toString() + Math.random(),
      degree: edu.degree || '',
      school: edu.school || edu.institution || '',
      location: edu.location || '',
      startDate: edu.start_date || edu.startDate || '',
      endDate: edu.end_date || edu.endDate || '',
      gpa: edu.gpa || '',
      description: edu.description || ''
    })),
    skills: (data.skills || []).map((skill: any) => ({
      id: skill.id || Date.now().toString() + Math.random(),
      name: typeof skill === 'string' ? skill : skill.name || '',
      level: typeof skill === 'object' ? skill.level || 'Intermediate' : 'Intermediate'
    })),
    certifications: (data.certifications || []).map((cert: any) => ({
      id: cert.id || Date.now().toString() + Math.random(),
      name: cert.name || '',
      issuer: cert.issuer || cert.organization || '',
      date: cert.date || cert.issue_date || '',
      url: cert.url || ''
    })),
    languages: (data.languages || []).map((lang: any) => ({
      id: lang.id || Date.now().toString() + Math.random(),
      name: typeof lang === 'string' ? lang : lang.name || lang.language || '',
      level: typeof lang === 'object' ? lang.level || lang.proficiency || '' : ''
    }))
  };
};

// Fallback to original client-side parsing if Python service is unavailable
const fallbackClientSideParsing = async (file: File): Promise<ResumeData> => {
  // Import the original PDF.js parsing logic as fallback
  const { parsePDFWithPDFJS } = await import('./fallbackParser');
  return parsePDFWithPDFJS(file);
};