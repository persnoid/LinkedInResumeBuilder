import { ResumeData } from '../types/resume';

export const parsePDFFile = async (file: File): Promise<ResumeData> => {
  try {
    console.log('📄 PDFParser: Starting PDF parsing for file:', file.name);
    console.log('📄 PDFParser: File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    // Create FormData to send the PDF file
    const formData = new FormData();
    formData.append('pdf', file);
    console.log('📄 PDFParser: FormData created, sending to /api/parse-pdf');

    // Send PDF to AI-powered backend for parsing
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData,
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(60000) // 60 second timeout
    });

    console.log('📄 PDFParser: Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('📄 PDFParser: Response not ok:', errorData);
      throw new Error(errorData.error || `PDF parsing failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('📄 PDFParser: Result received:', {
      success: result.success,
      hasData: !!result.data,
      parsingMethod: result.parsing_method,
      error: result.error
    });
    
    if (!result.success || result.error) {
      console.error('📄 PDFParser: Parsing unsuccessful:', result.error);
      throw new Error(result.error || 'PDF parsing failed');
    }

    // Log which parsing method was used
    console.log(`PDF parsed using: ${result.parsing_method || 'AI-powered parsing'}`);

    const transformedData = transformAIResponse(result.data);
    console.log('📄 PDFParser: Data transformed successfully');
    
    return transformedData;
  } catch (error) {
    console.error('AI PDF parsing error:', error);
    console.error('📄 PDFParser: Full error details:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('PDF parsing timed out. Please try again with a smaller file.');
      }
      if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
    }
    
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to parse PDF. Please ensure the AI service is running and your OpenAI API key is configured.'
    );
  }
};

const transformAIResponse = (data: any): ResumeData => {
  console.log('📄 PDFParser: Transforming AI response data');
  // Transform the AI response to match our frontend data structure
  const transformedData = {
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
  
  console.log('📄 PDFParser: Data transformation complete:', {
    hasPersonalInfo: !!transformedData.personalInfo.name,
    experienceCount: transformedData.experience.length,
    skillsCount: transformedData.skills.length,
    educationCount: transformedData.education.length
  });
  
  return transformedData;
};

// Check if AI parsing is available
export const checkAIAvailability = async (): Promise<{
  aiAvailable: boolean;
  openaiConfigured: boolean;
  message: string;
}> => {
  try {
    console.log('🔍 PDFParser: Checking AI availability...');
    const response = await fetch('/api/config', {
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    console.log('🔍 PDFParser: Config response:', {
      status: response.status,
      ok: response.ok
    });
    
    if (response.ok) {
      const config = await response.json();
      console.log('🔍 PDFParser: Config data:', config);
      return {
        aiAvailable: config.ai_parsing_available,
        openaiConfigured: config.openai_api_key_configured,
        message: config.ai_parsing_available 
          ? 'AI-powered parsing is ready for enhanced accuracy'
          : config.openai_api_key_configured 
            ? 'AI service is starting up...'
            : 'OpenAI API key required for AI-powered parsing'
      };
    }
  } catch (error) {
    console.warn('🔍 PDFParser: Could not check AI availability:', error);
  }
  
  return {
    aiAvailable: false,
    openaiConfigured: false,
    message: 'AI service unavailable - please check your configuration'
  };
};