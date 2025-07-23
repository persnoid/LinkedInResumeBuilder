import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, FileText, Settings, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { parsePDFFile, checkAIAvailability } from '../utils/pdfParser';
import { ResumeData } from '../types/resume';
import { useAuth } from '../contexts/AuthContext';

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
  const { user } = useAuth();
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

  const calculateProgress = () => {
    if (hasData) return 33;
    return 10;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ResumeAI</h1>
              <p className="text-xs text-gray-500">LinkedIn Resume Generator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 mb-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">NAVIGATION</h3>
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center transition-colors"
            >
              <div className="w-4 h-4 bg-blue-100 rounded mr-3 flex items-center justify-center">
                <span className="text-xs text-blue-600">📊</span>
              </div>
              <div>
                <div className="font-medium text-sm">Dashboard</div>
                <div className="text-xs text-gray-500">Your resume drafts</div>
              </div>
            </button>
            
            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-3 flex items-center justify-center">
                <span className="text-xs text-white">✨</span>
              </div>
              <div>
                <div className="font-medium text-sm">Create Resume</div>
                <div className="text-xs text-blue-600">Generate new resume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 flex-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">FEATURES</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <Brain className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-gray-700">AI-Powered Parsing</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-gray-700">6 Professional Templates</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <Settings className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-gray-700">Live Customization</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <Upload className="w-4 h-4 mr-2 text-orange-600" />
              <span className="text-gray-700">PDF Export Ready</span>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Resume</h1>
              <p className="text-gray-600">Upload your LinkedIn profile</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Step 1 of 3</span>
            <span className="text-sm text-gray-500">{calculateProgress()}% Complete</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium text-gray-900">Upload & Parse</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm text-gray-500">Choose Template</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm text-gray-500">Customize & Export</span>
            </div>
          </div>
        </div>

        {/* Main Upload Section */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
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
                  <FileText className="w-8 h-8 text-blue-600" />
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
        </div>
      </div>
    </div>
  );
};