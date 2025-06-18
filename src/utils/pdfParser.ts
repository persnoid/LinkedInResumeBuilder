import { ResumeData } from '../types/resume';

export const parsePDFFile = async (file: File): Promise<ResumeData> => {
  try {
    // Create FormData to send the PDF file
    const formData = new FormData();
    formData.append('pdf', file);

    // Send PDF to AI-powered backend for parsing
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // If it's a connection error, fall back to client-side parsing
      if (response.status === 0 || response.status >= 500) {
        console.warn('AI backend unavailable, falling back to client-side parsing');
        return await fallbackClientSideParsing(file);
      }
      throw new Error(`PDF parsing failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success || result.error) {
      throw new Error(result.error || 'PDF parsing failed');
    }

    // Log which parsing method was used
    console.log(`PDF parsed using: ${result.parsing_method || 'Unknown method'}`);

    return transformAIResponse(result.data);
  } catch (error) {
    console.warn('AI PDF parsing error, falling back to client-side parsing:', error);
    // Always fallback to client-side parsing if AI service fails
    return await fallbackClientSideParsing(file);
  }
};

const transformAIResponse = (data: any): ResumeData => {
  // Transform the AI response to match our frontend data structure
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
    experience: (data.experience || []).map((exp: any, index: number) => ({
      id: exp.id || (index + 1).toString(),
      position: exp.position || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.start_date || '',
      endDate: exp.end_date || '',
      current: exp.current || false,
      description: Array.isArray(exp.description) ? exp.description : [exp.description || '']
    })),
    education: (data.education || []).map((edu: any, index: number) => ({
      id: edu.id || (index + 1).toString(),
      degree: edu.degree || '',
      school: edu.school || '',
      location: edu.location || '',
      startDate: edu.start_date || '',
      endDate: edu.end_date || '',
      gpa: edu.gpa || '',
      description: edu.description || ''
    })),
    skills: (data.skills || []).map((skill: any, index: number) => ({
      id: skill.id || (index + 1).toString(),
      name: typeof skill === 'string' ? skill : skill.name || '',
      level: typeof skill === 'object' ? skill.level || 'Intermediate' : 'Intermediate'
    })),
    certifications: (data.certifications || []).map((cert: any, index: number) => ({
      id: cert.id || (index + 1).toString(),
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      url: cert.url || ''
    })),
    languages: (data.languages || []).map((lang: any, index: number) => ({
      id: lang.id || (index + 1).toString(),
      name: typeof lang === 'string' ? lang : lang.name || '',
      level: typeof lang === 'object' ? lang.level || '' : ''
    }))
  };
};

// Enhanced fallback to original client-side parsing if AI service is unavailable
const fallbackClientSideParsing = async (file: File): Promise<ResumeData> => {
  try {
    // Import the original PDF.js parsing logic as fallback
    const { parsePDFWithPDFJS } = await import('./fallbackParser');
    return parsePDFWithPDFJS(file);
  } catch (error) {
    console.error('Fallback parsing also failed:', error);
    // Return a basic structure with helpful message if all else fails
    return {
      personalInfo: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: ''
      },
      summary: 'AI-powered PDF parsing is currently unavailable, and fallback parsing failed. Please manually enter your information or try uploading a different PDF file. For best results, ensure your LinkedIn PDF export is recent and properly formatted.',
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      languages: []
    };
  }
};

// Check if AI parsing is available
export const checkAIAvailability = async (): Promise<{
  aiAvailable: boolean;
  openaiConfigured: boolean;
  message: string;
}> => {
  try {
    const response = await fetch('/api/config');
    if (response.ok) {
      const config = await response.json();
      return {
        aiAvailable: config.ai_parsing_available,
        openaiConfigured: config.openai_api_key_configured,
        message: config.ai_parsing_available 
          ? 'AI-powered parsing is available for enhanced accuracy'
          : 'Using fallback parsing method'
      };
    }
  } catch (error) {
    console.warn('Could not check AI availability:', error);
  }
  
  return {
    aiAvailable: false,
    openaiConfigured: false,
    message: 'AI service unavailable, using fallback parsing'
  };
};