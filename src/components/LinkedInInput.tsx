import React, { useState, useEffect } from 'react';
import { Linkedin, Upload, AlertCircle, CheckCircle, FileText, ExternalLink, Brain, Settings, FolderOpen } from 'lucide-react';
import { parsePDFFile, checkAIAvailability } from '../utils/pdfParser';
import { DraftManager } from '../utils/draftManager';
import { ResumeData } from '../types/resume';

interface LinkedInInputProps {
  onDataExtracted: (data: ResumeData) => void;
  onNext: () => void;
  onOpenDraftManager: () => void;
}

export const LinkedInInput: React.FC<LinkedInInputProps> = ({
  onDataExtracted,
  onNext,
  onOpenDraftManager
}) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionMethod, setExtractionMethod] = useState<'url' | 'pdf' | null>(null);
  const [aiStatus, setAiStatus] = useState<{
    aiAvailable: boolean;
    openaiConfigured: boolean;
    message: string;
  }>({
    aiAvailable: false,
    openaiConfigured: false,
    message: 'Checking AI availability...'
  });
  const [recentDrafts, setRecentDrafts] = useState<any[]>([]);

  // Check AI availability on component mount
  useEffect(() => {
    const checkAI = async () => {
      const status = await checkAIAvailability();
      setAiStatus(status);
    };
    checkAI();
    
    // Load recent drafts
    loadRecentDrafts();
  }, []);

  const loadRecentDrafts = () => {
    try {
      const recent = DraftManager.getRecentDrafts(3);
      console.log('Recent drafts loaded:', recent); // Debug log
      setRecentDrafts(recent);
    } catch (error) {
      console.error('Error loading recent drafts:', error);
      setRecentDrafts([]);
    }
  };

  const handleExtractData = async () => {
    if (!linkedinUrl.includes('linkedin.com')) {
      setError('Please enter a valid LinkedIn profile URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setExtractionMethod('url');

    // Since we can't actually scrape LinkedIn due to their terms of service,
    // we'll provide instructions for manual PDF export
    setTimeout(() => {
      setIsLoading(false);
      setError('Due to LinkedIn\'s terms of service, automatic profile extraction is not available. Please export your LinkedIn profile as a PDF and upload it below for AI-powered parsing.');
      setExtractionMethod(null);
    }, 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    // Check if AI is available before processing
    if (!aiStatus.aiAvailable) {
      setError('AI-powered parsing is not available. Please ensure the AI service is running and your OpenAI API key is configured.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);
    setUploadProgress(0);
    setExtractionMethod('pdf');

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
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        onDataExtracted(extractedData);
        
        setTimeout(() => {
          onNext();
        }, 1500);
      }, 500);
      
    } catch (error) {
      setIsLoading(false);
      setUploadProgress(0);
      setError(error instanceof Error ? error.message : 'Failed to process PDF file with AI');
      setExtractionMethod(null);
    }
  };

  const handleSkipToSample = () => {
    setIsLoading(true);
    setError('');
    
    // Provide sample data for users who want to try the tool
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
      onDataExtracted(sampleData);
      
      setTimeout(() => {
        onNext();
      }, 1500);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleOpenDraftManager = () => {
    // Refresh recent drafts before opening
    loadRecentDrafts();
    onOpenDraftManager();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Linkedin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI-Powered LinkedIn Resume Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Transform your LinkedIn profile into a professional resume using advanced AI
          </p>
          
          {/* AI Status Indicator */}
          <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            aiStatus.aiAvailable 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {aiStatus.aiAvailable ? (
              <>
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Parsing Ready
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                AI Service Configuration Required
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                {/* LinkedIn URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => {
                        setLinkedinUrl(e.target.value);
                        setError('');
                        setSuccess(false);
                      }}
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      disabled={isLoading || success}
                    />
                    {success && extractionMethod === 'url' && (
                      <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                <button
                  onClick={handleExtractData}
                  disabled={!linkedinUrl || isLoading || success}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading && extractionMethod === 'url' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Checking Profile...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Try Profile URL
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {aiStatus.aiAvailable ? 'AI-Powered Method (Recommended)' : 'Upload Method'}
                    </span>
                  </div>
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload LinkedIn PDF Export
                    {aiStatus.aiAvailable && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Enhanced
                      </span>
                    )}
                  </label>
                  <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
                    aiStatus.aiAvailable 
                      ? 'border-blue-300 hover:border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                  }`}>
                    <div className="space-y-1 text-center">
                      <Upload className={`mx-auto h-12 w-12 ${aiStatus.aiAvailable ? 'text-blue-400' : 'text-gray-400'}`} />
                      <div className="flex text-sm text-gray-600">
                        <label className={`relative cursor-pointer bg-white rounded-md font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 ${
                          aiStatus.aiAvailable ? 'text-blue-600 hover:text-blue-500' : 'text-gray-600 hover:text-gray-500'
                        }`}>
                          <span>Upload a PDF file</span>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="sr-only"
                            disabled={isLoading || success || !aiStatus.aiAvailable}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF up to 10MB</p>
                      {aiStatus.aiAvailable && (
                        <p className="text-xs text-blue-600 font-medium">
                          ✨ AI will intelligently extract your information
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Upload Progress */}
                  {isLoading && extractionMethod === 'pdf' && uploadProgress > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>
                          🤖 AI Processing PDF...
                        </span>
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
                </div>

                {/* Error Display */}
                {error && (
                  <div className="flex items-center mt-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Success Display */}
                {success && (
                  <div className="flex items-center mt-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Data extracted successfully using AI! Proceeding to next step...
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Skip to Sample Data */}
                <button
                  onClick={handleSkipToSample}
                  disabled={isLoading || success}
                  className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading && extractionMethod === null ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-transparent mr-2"></div>
                      Loading Sample...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Try with Sample Data
                    </>
                  )}
                </button>

                {/* Instructions */}
                <div className={`border-l-4 p-4 ${
                  aiStatus.aiAvailable 
                    ? 'bg-blue-50 border-blue-400' 
                    : 'bg-yellow-50 border-yellow-400'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {aiStatus.aiAvailable ? (
                        <Brain className="h-5 w-5 text-blue-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      {aiStatus.aiAvailable ? (
                        <>
                          <p className="text-sm text-blue-700">
                            <strong>How to get your LinkedIn PDF:</strong>
                          </p>
                          <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside space-y-1">
                            <li>Go to your LinkedIn profile</li>
                            <li>Click "More" → "Save to PDF"</li>
                            <li>Upload the downloaded PDF here for AI-powered extraction</li>
                            <li className="font-medium">✨ Our AI will intelligently extract all your information!</li>
                          </ol>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-yellow-700">
                            <strong>AI Service Configuration Required:</strong>
                          </p>
                          <p className="text-sm text-yellow-700 mt-2">
                            {aiStatus.message}
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Please configure your OpenAI API key to enable AI-powered parsing.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Recent Drafts and Draft Manager */}
          <div className="space-y-6">
            {/* Draft Manager */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FolderOpen className="w-5 h-5 mr-2" />
                Continue Previous Work
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Access your saved drafts and continue where you left off
              </p>
              <button
                onClick={handleOpenDraftManager}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Manage Drafts
              </button>
            </div>

            {/* Recent Drafts */}
            {recentDrafts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Drafts</h3>
                <div className="space-y-3">
                  {recentDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                      onClick={handleOpenDraftManager}
                    >
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {draft.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(draft.updatedAt)}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        Step: {draft.step + 1} of 4
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleOpenDraftManager}
                  className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all drafts →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};