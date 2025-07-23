import React, { useState, useEffect } from 'react';
import { Upload, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { parsePDFFile, checkAIAvailability } from '../utils/pdfParser';
import { ResumeData } from '../types/resume';

interface LinkedInInputProps {
  onDataExtracted: (data: ResumeData) => void;
  onBack: () => void;
  existingResumeData?: ResumeData | null;
  onContinueWithExisting?: () => void;
}

export const LinkedInInput: React.FC<LinkedInInputProps> = ({
  onDataExtracted,
  onBack,
  existingResumeData,
  onContinueWithExisting
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasData, setHasData] = useState(false);
  const [aiStatus, setAiStatus] = useState<{
    aiAvailable: boolean;
    openaiConfigured: boolean;
    message: string;
  }>({
    aiAvailable: false,
    openaiConfigured: false,
    message: 'AI service unavailable'
  });

  // Check AI availability on component mount
  useEffect(() => {
    const checkAI = async () => {
      try {
        const status = await checkAIAvailability();
        console.log('🔗 LinkedInInput: AI status check result:', status);
        setAiStatus(status);
      } catch (error) {
        console.error('🔗 LinkedInInput: Error checking AI availability:', error);
        setAiStatus({
          aiAvailable: false,
          openaiConfigured: false,
          message: 'AI service unavailable - please check your configuration'
        });
      }
    };

    checkAI();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('🔗 LinkedInInput: File upload started:', file?.name);
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      console.log('🔗 LinkedInInput: Invalid file type:', file.type);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      console.log('🔗 LinkedInInput: File too large:', file.size);
      return;
    }

    // Check if AI is available before processing
    if (!aiStatus.aiAvailable) {
      console.log('🔗 LinkedInInput: AI not available, status:', aiStatus);
      setError('AI-powered parsing is not available. Please ensure the AI service is running and your OpenAI API key is configured.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Parse the PDF file using AI
      const extractedData = await parsePDFFile(file);
      
      console.log('🔗 LinkedInInput: PDF parsed successfully');
      clearInterval(progressInterval);
      setUploadProgress(100);
      setHasData(true);
      
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        onDataExtracted(extractedData);
        console.log('🔗 LinkedInInput: Data extracted and passed to parent');
      }, 500);
      
    } catch (error) {
      console.error('🔗 LinkedInInput: PDF parsing error:', error);
      setIsLoading(false);
      setUploadProgress(0);
      setError(error instanceof Error ? error.message : 'Failed to process PDF file');
    }

    // Reset file input
    event.target.value = '';
  };

  const handleSkipToSample = () => {
    setIsLoading(true);
    setError('');
    
    // Provide sample data for users who want to try the tool
    console.log('🔗 LinkedInInput: Loading sample data');
    const sampleData: ResumeData = {
      personalInfo: {
        name: 'John Doe',
        title: 'Senior Software Engineer',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'johndoe.dev',
        linkedin: 'linkedin.com/in/johndoe'
      },
      summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and mentoring junior developers.',
      experience: [{
        id: '1',
        position: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2020-03',
        endDate: '2024-12',
        current: true,
        description: [
          'Led development of microservices architecture serving 10M+ users',
          'Mentored team of 5 junior developers and improved team productivity by 40%',
          'Implemented CI/CD pipelines reducing deployment time by 60%'
        ]
      }],
      education: [{
        id: '1',
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2014-09',
        endDate: '2018-05',
        gpa: '3.8'
      }],
      skills: [
        { id: '1', name: 'JavaScript', level: 'Expert' },
        { id: '2', name: 'React', level: 'Expert' },
        { id: '3', name: 'Node.js', level: 'Advanced' },
        { id: '4', name: 'Python', level: 'Advanced' },
        { id: '5', name: 'AWS', level: 'Intermediate' },
        { id: '6', name: 'Docker', level: 'Intermediate' }
      ],
      languages: [
        { id: '1', name: 'English', level: 'Native' },
        { id: '2', name: 'Spanish', level: 'Fluent' }
      ],
      certifications: [{
        id: '1',
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-06',
        url: 'https://aws.amazon.com/certification/'
      }]
    };
    
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setHasData(true);
      onDataExtracted(sampleData);
      console.log('🔗 LinkedInInput: Sample data loaded successfully');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Your LinkedIn Profile</h2>
          <p className="text-gray-600">
            Upload your LinkedIn profile as a PDF and let our AI extract your professional information
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm">
            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            PDF processed successfully! Your professional information has been extracted.
          </div>
        )}

        {/* Upload Progress */}
        {isLoading && uploadProgress > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>🤖 AI Processing PDF...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">Drop your LinkedIn PDF here</h3>
          <p className="text-gray-500 mb-6">or click to browse your files</p>
          
          <label className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer inline-flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Choose File
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading || success}
            />
          </label>
          
          <p className="text-xs text-gray-500 mt-4">PDF files only, max 10MB</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSkipToSample}
          disabled={isLoading || success}
          className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center transition-colors disabled:opacity-50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Try with Sample Data
        </button>
        
        <button
          onClick={() => hasData && onDataExtracted && console.log('Continue clicked')}
          disabled={!hasData}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Continue to Templates
        </button>
      </div>
    </div>
  );
};