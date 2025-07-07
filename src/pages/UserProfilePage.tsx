import React, { useState, useEffect } from 'react';
import { X, Save, User, Settings, Camera, Mail, Phone, MapPin, Globe, Linkedin, LogOut, AlertTriangle } from 'lucide-react';
import { PersonalInfoSection } from '../components/template-engine/sections/PersonalInfoSection';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PersonalInfo } from '../types/resume';

interface UserProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  showConfirmation: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => Promise<boolean>;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  isOpen,
  onClose,
  showConfirmation
}) => {
  const { signOut, user, updateProfile } = useAuth();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    photo: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Load profile data from Supabase on component mount
  useEffect(() => {
    const loadProfileFromSupabase = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('No profile found in Supabase - user needs to create one');
          } else {
            console.error('Error loading profile from Supabase:', error);
          }
          return;
        }

        if (profile) {
          console.log('Loaded profile from Supabase:', profile);
          setPersonalInfo({
            name: profile.full_name || '',
            title: user.user_metadata?.title || '',
            email: profile.email || '',
            phone: user.user_metadata?.phone || '',
            location: user.user_metadata?.location || '',
            website: user.user_metadata?.website || '',
            linkedin: user.user_metadata?.linkedin || '',
            photo: profile.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile from Supabase:', error);
      }
    };

    loadProfileFromSupabase();
  }, [user]);

  const handlePersonalInfoUpdate = (field: string, value: any) => {
    console.log('👤 UserProfilePage - handlePersonalInfoUpdate called:', {
      field,
      valueType: typeof value,
      valueLength: typeof value === 'string' ? value.length : 'N/A',
      isPhotoUpdate: field.includes('photo'),
      valuePrefix: typeof value === 'string' ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : value,
      timestamp: new Date().toISOString()
    });
    
    setPersonalInfo(prev => {
      console.log('👤 UserProfilePage - Current personalInfo before update:', {
        hasPhoto: !!prev.photo,
        photoLength: prev.photo?.length || 0,
        name: prev.name,
        email: prev.email
      });
      
      const updated = { ...prev };
      
      // Handle nested field updates (e.g., "personalInfo.name")
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        console.log('👤 UserProfilePage - Processing nested field update:', { parent, child });
        if (parent === 'personalInfo') {
          updated[child as keyof PersonalInfo] = value;
          console.log('👤 UserProfilePage - Updated nested field:', child, 'with value type:', typeof value);
        }
      } else {
        updated[field as keyof PersonalInfo] = value;
        console.log('👤 UserProfilePage - Updated direct field:', field, 'with value type:', typeof value);
      }
      
      console.log('👤 UserProfilePage - Updated personalInfo:', {
        hasPhoto: !!updated.photo,
        photoLength: updated.photo?.length || 0,
        photoChanged: prev.photo !== updated.photo,
        name: updated.name,
        email: updated.email
      });
      
      return updated;
    });
    
    console.log('👤 UserProfilePage - setPersonalInfo called, state should update');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Save to Supabase using the auth context
      const { error } = await updateProfile({
        full_name: personalInfo.name,
        avatar_url: personalInfo.photo,
        title: personalInfo.title,
        phone: personalInfo.phone,
        location: personalInfo.location,
        website: personalInfo.website,
        linkedin: personalInfo.linkedin
      });
      
      if (error) {
        throw error;
      }
      
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving profile to Supabase:', error);
      setSaveMessage('Failed to save profile. Please try again.');
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    const confirmed = await showConfirmation({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out? Any unsaved changes will be lost.',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      type: 'warning'
    });

    if (confirmed) {
      setIsSigningOut(true);
      try {
        const { error } = await signOut();
        if (error) {
          setSaveMessage('Failed to sign out. Please try again.');
          setTimeout(() => setSaveMessage(''), 3000);
        } else {
          // Close modal and reset form
          onClose();
          resetForm();
        }
      } catch (error) {
        setSaveMessage('Failed to sign out. Please try again.');
        setTimeout(() => setSaveMessage(''), 3000);
      } finally {
        setIsSigningOut(false);
      }
    }
  };

  const resetForm = () => {
    setPersonalInfo({
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      photo: ''
    });
    setSaveMessage('');
  };

  const clearProfile = async () => {
    const confirmed = await showConfirmation({
      title: 'Clear Profile Data',
      message: 'Are you sure you want to clear all profile data? This action cannot be undone.',
      confirmText: 'Clear Data',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      try {
        // Clear profile in Supabase
        const { error } = await updateProfile({
          full_name: '',
          avatar_url: '',
          title: '',
          phone: '',
          location: '',
          website: '',
          linkedin: ''
        });
        
        if (error) {
          throw error;
        }
        
        setPersonalInfo({
          name: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          photo: ''
        });
        
        setSaveMessage('Profile cleared successfully!');
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error clearing profile in Supabase:', error);
        setSaveMessage('Failed to clear profile. Please try again.');
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      }
    }
  };

  // Minimal styles for the PersonalInfoSection
  const styles = {
    typography: {
      fontSize: {
        base: '14px',
        heading1: '28px',
        heading2: '18px',
        heading3: '16px',
        small: '12px'
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.4',
        relaxed: '1.6'
      }
    },
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      accent: '#3B82F6',
      text: '#1F2937',
      background: '#FFFFFF',
      muted: '#F8FAFC',
      border: '#E5E7EB'
    },
    spacing: {
      section: '24px',
      item: '12px',
      compact: '8px'
    }
  };

  const config = {
    id: 'userProfile',
    name: 'User Profile',
    columns: 1
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                <p className="text-gray-600">Manage your personal information and display preferences</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Action Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-3">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Signed in as {user?.email}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </>
                )}
              </button>
              
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm"
              >
                {isSigningOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Signing Out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 140px)' }}>
          {/* Save Message */}
          {saveMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              saveMessage.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {saveMessage}
            </div>
          )}

          {/* Profile Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-6">
              <Settings className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <PersonalInfoSection
                data={{ personalInfo }}
                styles={styles}
                sectionStyles={{}}
                config={config}
                editMode={true}
                onDataUpdate={handlePersonalInfoUpdate}
              />
            </div>
          </div>

          {/* Display Options Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-6">
              <Camera className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Display Options</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Picture Guidelines */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Profile Picture Guidelines</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Supported formats: JPG, PNG
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Maximum file size: 5MB
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Recommended: Square aspect ratio (1:1)
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Professional headshot works best
                  </li>
                </ul>
              </div>

              {/* Contact Information Tips */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Contact Information Tips</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <Mail className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                    Use a professional email address
                  </li>
                  <li className="flex items-start">
                    <Phone className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                    Include country code for international applications
                  </li>
                  <li className="flex items-start">
                    <MapPin className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                    City and state/country are usually sufficient
                  </li>
                  <li className="flex items-start">
                    <Linkedin className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                    Use your custom LinkedIn URL if available
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Current Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{personalInfo.name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{personalInfo.title || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{personalInfo.email || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{personalInfo.phone || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Photo:</span>
                    <span className="font-medium">{personalInfo.photo ? 'Uploaded' : 'Default avatar'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={clearProfile}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Clear All Profile Data
                  </button>
                  <p className="text-xs text-gray-500">
                    This will remove all your profile information and reset to defaults.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Your profile information is stored locally in your browser and used across all resume templates.
          </p>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};