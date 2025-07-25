import React, { useState, useEffect } from 'react';
import { Plus, FileText, CheckCircle, Clock, Edit3, Trash2, Calendar, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useResumeData } from '../contexts/ResumeDataContext';
import { ResumeData } from '../types/resume';

interface DashboardProps {
  onCreateNew: () => void;
  onEditResume: (resumeData: ResumeData, template: string, customizations: any, draftId: string) => void;
  onStartLinkedInInput: () => void;
  onOpenProfile: () => void;
  onGoToHome: () => void;
  showConfirmation: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => Promise<boolean>;
}

interface ResumeItem {
  id: string;
  name: string;
  status: 'completed' | 'in-progress';
  template: string;
  updatedAt: string;
  resumeData: ResumeData;
  customizations: any;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onCreateNew,
  onEditResume,
  onStartLinkedInInput,
  onOpenProfile,
  onGoToHome,
  showConfirmation
}) => {
  const { user } = useAuth();
  const { drafts, isLoading, error, deleteDraft } = useResumeData();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0
  });

  // Convert drafts to resume items and calculate stats
  useEffect(() => {
    const resumeItems: ResumeItem[] = drafts.map(draft => ({
        id: draft.id,
        name: draft.name,
        status: draft.step >= 2 ? 'completed' : 'in-progress',
        template: draft.selectedTemplate,
        updatedAt: draft.updatedAt,
        resumeData: draft.resumeData,
        customizations: draft.customizations
      }));

      // Calculate stats
      const completed = resumeItems.filter(r => r.status === 'completed').length;
      const inProgress = resumeItems.filter(r => r.status === 'in-progress').length;
      
      setStats({
        total: resumeItems.length,
        completed,
        inProgress
      });
      
  }, [drafts]);

  const resumes = drafts.map(draft => ({
    id: draft.id,
    name: draft.name,
    status: draft.step >= 2 ? 'completed' : 'in-progress',
    template: draft.selectedTemplate,
    updatedAt: draft.updatedAt,
    resumeData: draft.resumeData,
    customizations: draft.customizations
  }));
  const handleEditResume = (resume: ResumeItem) => {
    onEditResume(resume.resumeData, resume.template, resume.customizations, resume.id);
  };

  const handleDeleteResume = async (resumeId: string) => {
    const confirmed = await showConfirmation({
      title: 'Delete Resume',
      message: 'Are you sure you want to delete this resume? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (confirmed) {
      try {
        await deleteDraft(resumeId);
      } catch (error) {
        console.error('Error deleting resume:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTemplateDisplayName = (template: string) => {
    switch (template) {
      case 'azurill': return 'Modern';
      case 'bronzor': return 'Professional';
      case 'chikorita': return 'Minimal';
      default: return 'Modern';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      {/* Connection Error Banner */}
      {error && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              You have {stats.total} resume{stats.total !== 1 ? 's' : ''} ready to customize
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Resume
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Resumes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Resume Collection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Resume Collection</h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-gray-500">Loading your resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-500 mb-6">Create your first professional resume to get started</p>
                <button
                  onClick={onCreateNew}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto font-medium transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Resume
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                  <div key={resume.id} className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                    resume.id === 'demo' ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{resume.name}</h3>
                          {resume.id === 'demo' && (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              Demo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            resume.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {resume.status === 'completed' ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                completed
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                in progress
                              </>
                            )}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {getTemplateDisplayName(resume.template)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      Updated {formatDate(resume.updatedAt)}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleEditResume(resume)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        disabled={resume.id === 'demo'}
                        title={resume.id === 'demo' ? 'Cannot delete demo data' : 'Delete resume'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};