import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Diamond } from 'lucide-react';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
  customColors?: any;
  font?: string;
  sectionOrder?: string[];
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  template,
  customColors,
  font = 'Inter',
  sectionOrder = ['summary', 'experience', 'education', 'skills', 'certifications']
}) => {
  const colors = customColors || {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#10B981',
    text: '#1F2937',
    background: '#FFFFFF'
  };

  const fontFamily = font === 'Inter' ? 'Inter, sans-serif' : 
                    font === 'Roboto' ? 'Roboto, sans-serif' :
                    font === 'Open Sans' ? 'Open Sans, sans-serif' :
                    font === 'Lato' ? 'Lato, sans-serif' :
                    font === 'Playfair Display' ? 'Playfair Display, serif' :
                    font === 'Merriweather' ? 'Merriweather, serif' :
                    'Inter, sans-serif';

  // Modern Two-Column Layout (Based on first image)
  if (template === 'modern-two-column') {
    return (
      <div 
        id="resume-preview" 
        className="w-full max-w-4xl mx-auto bg-white shadow-lg"
        style={{ fontFamily, minHeight: '11in', aspectRatio: '8.5/11' }}
      >
        <div className="flex h-full">
          {/* Left Column - Main Content */}
          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 
                className="text-4xl font-bold mb-2 uppercase tracking-wide"
                style={{ color: colors.primary }}
              >
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <h2 
                className="text-xl mb-4"
                style={{ color: colors.accent }}
              >
                {resumeData.personalInfo.title || 'The role you are applying for?'}
              </h2>
              
              {/* Contact Info Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    <span>{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="w-4 h-4 mr-1" />
                    <span>{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h3 
                className="text-lg font-bold mb-3 pb-2 border-b-2 uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                SUMMARY
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h3 
                className="text-lg font-bold mb-4 pb-2 border-b-2 uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                EXPERIENCE
              </h3>
              <div className="space-y-6">
                {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <h4 className="font-bold text-gray-900 text-lg">{exp.position}</h4>
                    <p style={{ color: colors.accent }} className="font-semibold text-lg">{exp.company}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      {exp.location && (
                        <>
                          <MapPin className="w-4 h-4 ml-4 mr-1" />
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    <div className="text-gray-700">
                      <p className="mb-2">Company Description</p>
                      <ul className="space-y-1">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-gray-400 mr-2 mt-1">•</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )) : (
                  <div>
                    <h4 className="font-bold text-gray-900">Title</h4>
                    <p style={{ color: colors.accent }} className="font-semibold">Company Name</p>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Date period</span>
                      <MapPin className="w-4 h-4 ml-4 mr-1" />
                      <span>Location</span>
                    </div>
                    <div className="text-gray-700">
                      <p className="mb-2">Company Description</p>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-2 mt-1">•</span>
                          <span>Highlight your accomplishments, using numbers if possible.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h3 
                className="text-lg font-bold mb-4 pb-2 border-b-2 uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                EDUCATION
              </h3>
              <div className="space-y-4">
                {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                    <p style={{ color: colors.accent }} className="font-semibold">{edu.school}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                )) : (
                  <div>
                    <h4 className="font-bold text-gray-900">Degree and Field of Study</h4>
                    <p style={{ color: colors.accent }} className="font-semibold">School or University</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Date period</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 
                className="text-lg font-bold mb-4 pb-2 border-b-2 uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                LANGUAGES
              </h3>
              <div className="space-y-3">
                {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
                  <div key={language.id} className="flex items-center justify-between">
                    <span className="font-medium">{language.name}</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-full ${
                            level <= (language.level === 'Beginner' ? 1 : 
                                     language.level === 'Intermediate' ? 3 : 
                                     language.level === 'Advanced' ? 4 : 5)
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Language</span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                    </div>
                    <span className="text-sm text-gray-500 ml-2">Beginner</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-80 bg-gray-50 p-8">
            {/* Profile Photo */}
            <div className="mb-8 text-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto flex items-center justify-center overflow-hidden">
                {resumeData.personalInfo.photo ? (
                  <img 
                    src={resumeData.personalInfo.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-500 rounded-full mb-2"></div>
                    <div className="w-12 h-6 bg-gray-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-8">
              <h3 
                className="text-lg font-bold mb-4 pb-2 border-b-2 uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                KEY ACHIEVEMENTS
              </h3>
              <div className="space-y-4">
                {resumeData.certifications.length > 0 ? resumeData.certifications.slice(0, 2).map((cert) => (
                  <div key={cert.id} className="flex items-start">
                    <Diamond className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{ color: colors.accent }} />
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-start">
                    <Diamond className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{ color: colors.accent }} />
                    <div>
                      <h4 className="font-semibold text-gray-900">Your Achievement</h4>
                      <p className="text-sm text-gray-600">Describe what you did and the impact it had.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3 
                className="text-lg font-bold mb-4 pb-2 border-b-2 uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                SKILLS
              </h3>
              <div className="space-y-2">
                {resumeData.skills.length > 0 ? resumeData.skills.map((skill) => (
                  <div key={skill.id} className="text-gray-700">
                    {skill.name}
                  </div>
                )) : (
                  <div className="text-gray-700">Your Skill</div>
                )}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-8">
              <h3 
                className="text-lg font-bold mb-4 pb-2 border-b-2 uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                COURSES
              </h3>
              <div className="space-y-2">
                <p style={{ color: colors.accent }} className="text-gray-600">Course Title</p>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 
                className="text-lg font-bold mb-4 pb-2 border-b-2 uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{ color: colors.accent }} />
                <span className="text-gray-700">Career Interest / Passion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic Centered Layout (Based on second image)
  if (template === 'classic-centered') {
    return (
      <div 
        id="resume-preview" 
        className="w-full max-w-4xl mx-auto bg-white shadow-lg p-12"
        style={{ fontFamily, minHeight: '11in', aspectRatio: '8.5/11' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          {/* Profile Photo */}
          <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-6 flex items-center justify-center overflow-hidden">
            {resumeData.personalInfo.photo ? (
              <img 
                src={resumeData.personalInfo.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-500 rounded-full mb-1"></div>
                <div className="w-8 h-4 bg-gray-500 rounded-full"></div>
              </div>
            )}
          </div>

          <h1 
            className="text-4xl font-bold mb-2 uppercase tracking-wide"
            style={{ color: colors.primary }}
          >
            {resumeData.personalInfo.name || 'YOUR NAME'}
          </h1>
          <h2 
            className="text-xl mb-4"
            style={{ color: colors.secondary }}
          >
            {resumeData.personalInfo.title || 'The role you are applying for?'}
          </h2>
          
          {/* Contact Info */}
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 mb-8">
            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.email && (
              <>
                <span>•</span>
                <span>{resumeData.personalInfo.email}</span>
              </>
            )}
            {resumeData.personalInfo.linkedin && (
              <>
                <span>•</span>
                <span>{resumeData.personalInfo.linkedin}</span>
              </>
            )}
            {resumeData.personalInfo.location && (
              <>
                <span>•</span>
                <span>{resumeData.personalInfo.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-4 text-center pb-2 border-b"
            style={{ color: colors.primary, borderColor: colors.primary }}
          >
            Summary
          </h3>
          <p className="text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">
            {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
          </p>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-6 text-center pb-2 border-b"
            style={{ color: colors.primary, borderColor: colors.primary }}
          >
            Experience
          </h3>
          <div className="space-y-8">
            {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
              <div key={exp.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 text-lg">{exp.company}</h4>
                    <p className="text-lg">{exp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">{exp.location}</p>
                    <p className="text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                </div>
                <div className="text-gray-700">
                  <p className="mb-3">Company Description</p>
                  <ul className="space-y-2">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-gray-400 mr-2 mt-1">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )) : (
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 text-lg">Company Name</h4>
                    <p className="text-lg">Title</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">Location</p>
                    <p className="text-gray-500">Date period</p>
                  </div>
                </div>
                <div className="text-gray-700">
                  <p className="mb-3">Company Description</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <span>Highlight your accomplishments, using numbers if possible.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-6 text-center pb-2 border-b"
            style={{ color: colors.primary, borderColor: colors.primary }}
          >
            Education
          </h3>
          <div className="text-center space-y-4">
            {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
              <div key={edu.id}>
                <h4 className="font-bold text-gray-900">{edu.school}</h4>
                <p className="text-lg">{edu.degree}</p>
                <p className="text-gray-500">{edu.startDate} - {edu.endDate}</p>
              </div>
            )) : (
              <div>
                <h4 className="font-bold text-gray-900">School or University</h4>
                <p className="text-lg">Degree and Field of Study</p>
                <p className="text-gray-500">Date period</p>
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-6 text-center pb-2 border-b"
            style={{ color: colors.primary, borderColor: colors.primary }}
          >
            Languages
          </h3>
          <div className="space-y-3">
            {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
              <div key={language.id} className="flex items-center justify-between max-w-md mx-auto">
                <span className="font-medium">{language.name}</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-full ${
                        level <= (language.level === 'Beginner' ? 1 : 
                                 language.level === 'Intermediate' ? 3 : 
                                 language.level === 'Advanced' ? 4 : 5)
                          ? 'bg-black' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{language.level}</span>
              </div>
            )) : (
              <div className="flex items-center justify-between max-w-md mx-auto">
                <span className="font-medium">Language</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-black" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                </div>
                <span className="text-sm text-gray-500">Beginner</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Achievements */}
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-6 text-center pb-2 border-b"
            style={{ color: colors.primary, borderColor: colors.primary }}
          >
            Key Achievements
          </h3>
          <div className="space-y-4">
            {resumeData.certifications.length > 0 ? resumeData.certifications.slice(0, 2).map((cert) => (
              <div key={cert.id} className="flex items-start max-w-2xl mx-auto">
                <Diamond className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{ color: colors.accent }} />
                <div>
                  <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                </div>
              </div>
            )) : (
              <div className="flex items-start max-w-2xl mx-auto">
                <Diamond className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{ color: colors.accent }} />
                <div>
                  <h4 className="font-semibold text-gray-900">Your Achievement</h4>
                  <p className="text-sm text-gray-600">Describe what you did and the impact it had.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-6 text-center pb-2 border-b"
            style={{ color: colors.primary, borderColor: colors.primary }}
          >
            Skills
          </h3>
          <div className="text-center">
            {resumeData.skills.length > 0 ? (
              <p className="text-gray-700">
                {resumeData.skills.map(skill => skill.name).join(' • ')}
              </p>
            ) : (
              <p className="text-gray-700">Your Skill</p>
            )}
          </div>
        </div>

        {/* Courses */}
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-6 text-center pb-2 border-b"
            style={{ color: colors.primary, borderColor: colors.primary }}
          >
            Courses
          </h3>
          <div className="text-center">
            <p style={{ color: colors.accent }} className="text-gray-600">Course Title</p>
          </div>
        </div>

        {/* Interests */}
        <div>
          <h3 
            className="text-xl font-bold mb-6 text-center pb-2 border-b"
            style={{ color: colors.primary, borderColor: colors.primary }}
          >
            Interests
          </h3>
          <div className="flex items-center justify-center">
            <Diamond className="w-5 h-5 mr-3" style={{ color: colors.accent }} />
            <span className="text-gray-700">Career Interest / Passion</span>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div 
      id="resume-preview" 
      className="w-full max-w-4xl mx-auto bg-white shadow-lg p-8"
      style={{ fontFamily, minHeight: '11in', aspectRatio: '8.5/11' }}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">{resumeData.personalInfo.name}</h1>
        <h2 className="text-xl mb-4">{resumeData.personalInfo.title}</h2>
        <p>Template not found. Please select a valid template.</p>
      </div>
    </div>
  );
};