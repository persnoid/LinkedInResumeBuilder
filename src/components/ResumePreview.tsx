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

  // A4 dimensions with proper margins
  const pageStyle = {
    width: '210mm',
    minHeight: '297mm',
    maxWidth: '794px',
    margin: '0 auto',
    backgroundColor: 'white',
    fontFamily,
    fontSize: '10px',
    lineHeight: '1.3',
    color: '#1f2937'
  };

  // Green Modern Sidebar Layout
  if (template === 'green-modern-sidebar') {
    return (
      <div id="resume-preview" style={pageStyle} className="print:shadow-none shadow-lg">
        <div className="flex" style={{ minHeight: '297mm' }}>
          {/* Left Column - Sidebar */}
          <div className="w-56 p-5" style={{ backgroundColor: colors.sidebar || '#F0FDF4', paddingTop: '15mm', paddingLeft: '15mm', paddingBottom: '15mm' }}>
            {/* Profile Photo with decorative background */}
            <div className="mb-5 relative" style={{ marginBottom: '16px' }}>
              <div className="absolute inset-0 rounded-full opacity-20" style={{ backgroundColor: colors.primary, transform: 'scale(1.2) translate(-10px, -10px)' }}></div>
              <div className="w-20 h-20 rounded-full bg-gray-300 relative z-10 mx-auto flex items-center justify-center overflow-hidden">
                {resumeData.personalInfo.photo ? (
                  <img 
                    src={resumeData.personalInfo.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center">
                    <div className="w-5 h-5 bg-gray-500 rounded-full mb-1"></div>
                    <div className="w-7 h-3 bg-gray-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Contacts */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide flex items-center"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                <Mail className="w-3 h-3 mr-1" />
                CONTACTS
              </h3>
              <div className="space-y-2" style={{ fontSize: '9px' }}>
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-3 h-3 mr-2 flex-shrink-0" style={{ color: colors.primary }} />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.email && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-3 h-3 mr-2 flex-shrink-0" style={{ color: colors.primary }} />
                    <span className="break-all">{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center text-gray-700">
                    <Linkedin className="w-3 h-3 mr-2 flex-shrink-0" style={{ color: colors.primary }} />
                    <span className="break-all">{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-3 h-3 mr-2 flex-shrink-0" style={{ color: colors.primary }} />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide flex items-center"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                <Diamond className="w-3 h-3 mr-1" />
                KEY ACHIEVEMENTS
              </h3>
              <div className="space-y-2">
                {resumeData.certifications.length > 0 ? resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start">
                    <div className="w-2 h-2 rounded-full mt-1 mr-2 flex-shrink-0" style={{ backgroundColor: colors.primary }}></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 leading-tight" style={{ fontSize: '9px' }}>{cert.name}</h4>
                      <p className="text-gray-600" style={{ fontSize: '8px' }}>{cert.issuer}</p>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full mt-1 mr-2 flex-shrink-0" style={{ backgroundColor: colors.primary }}></div>
                    <div>
                      <h4 className="font-semibold text-gray-900" style={{ fontSize: '9px' }}>Your Achievement</h4>
                      <p className="text-gray-600" style={{ fontSize: '8px' }}>Describe what you did and the impact it had.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide flex items-center"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                <Diamond className="w-3 h-3 mr-1" />
                SKILLS
              </h3>
              <div className="space-y-0.5">
                {resumeData.skills.length > 0 ? resumeData.skills.map((skill) => (
                  <div key={skill.id} className="text-gray-700" style={{ fontSize: '9px' }}>
                    {skill.name}
                  </div>
                )) : (
                  <div className="text-gray-700" style={{ fontSize: '9px' }}>Your Skill</div>
                )}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide flex items-center"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                <Diamond className="w-3 h-3 mr-1" />
                COURSES
              </h3>
              <div>
                <p style={{ fontSize: '9px' }} className="text-gray-600">Course Title</p>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide flex items-center"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                <Diamond className="w-3 h-3 mr-1" />
                INTERESTS
              </h3>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full mt-1 mr-2 flex-shrink-0" style={{ backgroundColor: colors.primary }}></div>
                <span className="text-gray-700" style={{ fontSize: '9px' }}>Career Interest / Passion</span>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="flex-1 p-5 pl-3" style={{ paddingTop: '15mm', paddingRight: '15mm', paddingBottom: '15mm' }}>
            {/* Header */}
            <div className="mb-5">
              <h1 
                className="text-xl font-bold mb-1 uppercase tracking-wide leading-tight"
                style={{ color: colors.primary, fontSize: '18px', marginBottom: '4px' }}
              >
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <div 
                className="inline-block px-3 py-1 rounded-full text-sm mb-3 leading-tight"
                style={{ backgroundColor: colors.accent, color: 'white', fontSize: '12px', marginBottom: '8px' }}
              >
                {resumeData.personalInfo.title || 'THE ROLE YOU ARE APPLYING FOR?'}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-2 pb-1 border-b uppercase tracking-wide flex items-center"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '6px' }}
              >
                <Diamond className="w-3 h-3 mr-1" />
                SUMMARY
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide flex items-center"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                <Diamond className="w-3 h-3 mr-1" />
                EXPERIENCE
              </h3>
              <div className="space-y-3">
                {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
                  <div key={exp.id} className="page-break-inside-avoid" style={{ marginBottom: '12px' }}>
                    <h4 className="font-bold text-gray-900 leading-tight" style={{ fontSize: '10px' }}>{exp.position}</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold leading-tight">{exp.company}</p>
                    <div className="flex items-center text-gray-500 mb-1" style={{ fontSize: '8px', marginBottom: '4px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      {exp.location && (
                        <>
                          <MapPin className="w-2.5 h-2.5 ml-2 mr-1" />
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    <div className="text-gray-700" style={{ fontSize: '8px' }}>
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul className="space-y-0.5">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-gray-400 mr-1 mt-0.5">•</span>
                            <span className="leading-relaxed">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )) : (
                  <div className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Title</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">Company Name</p>
                    <div className="flex items-center text-gray-500 mb-1" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>Date period</span>
                      <MapPin className="w-2.5 h-2.5 ml-2 mr-1" />
                      <span>Location</span>
                    </div>
                    <div className="text-gray-700" style={{ fontSize: '8px' }}>
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-1 mt-0.5">•</span>
                          <span>Highlight your accomplishments, using numbers if possible.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide flex items-center"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                <Diamond className="w-3 h-3 mr-1" />
                EDUCATION
              </h3>
              <div className="space-y-2">
                {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                  <div key={edu.id} className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>{edu.degree}</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">{edu.school}</p>
                    <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                )) : (
                  <div className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Degree and Field of Study</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">School or University</p>
                    <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>Date period</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide flex items-center"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                <Diamond className="w-3 h-3 mr-1" />
                LANGUAGES
              </h3>
              <div className="space-y-1">
                {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
                  <div key={language.id} className="flex items-center justify-between">
                    <span className="font-medium" style={{ fontSize: '9px' }}>{language.name}</span>
                    <div className="flex items-center">
                      <div className="flex space-x-0.5 mr-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-1.5 h-1.5 rounded-full`}
                            style={{ 
                              backgroundColor: level <= (language.level === 'Beginner' ? 1 : 
                                                       language.level === 'Intermediate' ? 3 : 
                                                       language.level === 'Advanced' ? 4 : 5)
                                ? colors.primary 
                                : '#D1D5DB'
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500" style={{ fontSize: '8px' }}>{language.level}</span>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium" style={{ fontSize: '9px' }}>Language</span>
                    <div className="flex items-center">
                      <div className="flex space-x-0.5 mr-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      </div>
                      <span className="text-gray-500" style={{ fontSize: '8px' }}>Beginner</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teal Professional Layout
  if (template === 'teal-professional') {
    return (
      <div id="resume-preview" style={pageStyle} className="print:shadow-none shadow-lg">
        <div className="flex" style={{ minHeight: '297mm' }}>
          {/* Left Column - Teal Sidebar */}
          <div className="w-56 p-5 text-white" style={{ backgroundColor: colors.sidebar || '#0F766E', paddingTop: '15mm', paddingLeft: '15mm', paddingBottom: '15mm' }}>
            {/* Profile Photo */}
            <div className="mb-5 text-center" style={{ marginBottom: '16px' }}>
              <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 mx-auto flex items-center justify-center overflow-hidden">
                {resumeData.personalInfo.photo ? (
                  <img 
                    src={resumeData.personalInfo.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white bg-opacity-50 rounded-full mb-1"></div>
                    <div className="w-7 h-3 bg-white bg-opacity-50 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '8px' }}
              >
                KEY ACHIEVEMENTS
              </h3>
              <div className="space-y-2">
                {resumeData.certifications.length > 0 ? resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start">
                    <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-white" />
                    <div>
                      <h4 className="font-semibold text-white leading-tight" style={{ fontSize: '9px' }}>{cert.name}</h4>
                      <p className="text-white text-opacity-80" style={{ fontSize: '8px' }}>{cert.issuer}</p>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-start">
                    <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-white" />
                    <div>
                      <h4 className="font-semibold text-white" style={{ fontSize: '9px' }}>Your Achievement</h4>
                      <p className="text-white text-opacity-80" style={{ fontSize: '8px' }}>Describe what you did and the impact it had.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '8px' }}
              >
                SKILLS
              </h3>
              <div className="space-y-0.5">
                {resumeData.skills.length > 0 ? resumeData.skills.map((skill) => (
                  <div key={skill.id} className="text-white" style={{ fontSize: '9px' }}>
                    {skill.name}
                  </div>
                )) : (
                  <div className="text-white" style={{ fontSize: '9px' }}>Your Skill</div>
                )}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '8px' }}
              >
                COURSES
              </h3>
              <div>
                <p style={{ fontSize: '9px' }} className="text-white">Course Title</p>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '8px' }}
              >
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-white" />
                <span className="text-white" style={{ fontSize: '9px' }}>Career Interest / Passion</span>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="flex-1 p-5 pl-3" style={{ paddingTop: '15mm', paddingRight: '15mm', paddingBottom: '15mm' }}>
            {/* Header */}
            <div className="mb-5">
              <h1 
                className="text-xl font-bold mb-1 uppercase tracking-wide leading-tight"
                style={{ color: colors.primary, fontSize: '18px', marginBottom: '4px' }}
              >
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <h2 
                className="text-sm mb-3 leading-tight"
                style={{ color: colors.secondary, fontSize: '12px', marginBottom: '8px' }}
              >
                {resumeData.personalInfo.title || 'The role you are applying for?'}
              </h2>
              
              {/* Contact Info Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-4" style={{ fontSize: '9px', marginBottom: '12px' }}>
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-2 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '6px' }}
              >
                SUMMARY
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                EXPERIENCE
              </h3>
              <div className="space-y-3">
                {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
                  <div key={exp.id} className="page-break-inside-avoid" style={{ marginBottom: '12px' }}>
                    <h4 className="font-bold text-gray-900 leading-tight" style={{ fontSize: '10px' }}>{exp.position}</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold leading-tight">{exp.company}</p>
                    <div className="flex items-center text-gray-500 mb-1" style={{ fontSize: '8px', marginBottom: '4px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      {exp.location && (
                        <>
                          <MapPin className="w-2.5 h-2.5 ml-2 mr-1" />
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    <div className="text-gray-700" style={{ fontSize: '8px' }}>
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul className="space-y-0.5">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-gray-400 mr-1 mt-0.5">•</span>
                            <span className="leading-relaxed">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )) : (
                  <div className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Title</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">Company Name</p>
                    <div className="flex items-center text-gray-500 mb-1" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>Date period</span>
                      <MapPin className="w-2.5 h-2.5 ml-2 mr-1" />
                      <span>Location</span>
                    </div>
                    <div className="text-gray-700" style={{ fontSize: '8px' }}>
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-1 mt-0.5">•</span>
                          <span>Highlight your accomplishments, using numbers if possible.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                EDUCATION
              </h3>
              <div className="space-y-2">
                {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                  <div key={edu.id} className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>{edu.degree}</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">{edu.school}</p>
                    <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                )) : (
                  <div className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Degree and Field of Study</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">School or University</p>
                    <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>Date period</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                LANGUAGES
              </h3>
              <div className="space-y-1">
                {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
                  <div key={language.id} className="flex items-center justify-between">
                    <span className="font-medium" style={{ fontSize: '9px' }}>{language.name}</span>
                    <div className="flex items-center">
                      <div className="flex space-x-0.5 mr-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-1.5 h-1.5 rounded-full`}
                            style={{ 
                              backgroundColor: level <= (language.level === 'Beginner' ? 1 : 
                                                       language.level === 'Intermediate' ? 3 : 
                                                       language.level === 'Advanced' ? 4 : 5)
                                ? colors.primary 
                                : '#D1D5DB'
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500" style={{ fontSize: '8px' }}>{language.level}</span>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium" style={{ fontSize: '9px' }}>Language</span>
                    <div className="flex items-center">
                      <div className="flex space-x-0.5 mr-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      </div>
                      <span className="text-gray-500" style={{ fontSize: '8px' }}>Beginner</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Navy Executive Layout
  if (template === 'navy-executive') {
    return (
      <div id="resume-preview" style={pageStyle} className="print:shadow-none shadow-lg">
        <div className="flex" style={{ minHeight: '297mm' }}>
          {/* Left Column - Main Content */}
          <div className="flex-1 p-5 pr-3" style={{ paddingTop: '15mm', paddingLeft: '15mm', paddingBottom: '15mm' }}>
            {/* Header */}
            <div className="mb-5">
              <h1 
                className="text-xl font-bold mb-1 uppercase tracking-wide leading-tight"
                style={{ color: colors.primary, fontSize: '18px', marginBottom: '4px' }}
              >
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <h2 
                className="text-sm mb-3 leading-tight"
                style={{ color: colors.secondary, fontSize: '12px', marginBottom: '8px' }}
              >
                {resumeData.personalInfo.title || 'The role you are applying for?'}
              </h2>
              
              {/* Contact Info Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-4" style={{ fontSize: '9px', marginBottom: '12px' }}>
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-2 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '6px' }}
              >
                SUMMARY
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                EXPERIENCE
              </h3>
              <div className="space-y-3">
                {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
                  <div key={exp.id} className="page-break-inside-avoid" style={{ marginBottom: '12px' }}>
                    <h4 className="font-bold text-gray-900 leading-tight" style={{ fontSize: '10px' }}>{exp.position}</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold leading-tight">{exp.company}</p>
                    <div className="flex items-center text-gray-500 mb-1" style={{ fontSize: '8px', marginBottom: '4px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      {exp.location && (
                        <>
                          <MapPin className="w-2.5 h-2.5 ml-2 mr-1" />
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    <div className="text-gray-700" style={{ fontSize: '8px' }}>
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul className="space-y-0.5">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-gray-400 mr-1 mt-0.5">•</span>
                            <span className="leading-relaxed">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )) : (
                  <div className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Title</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">Company Name</p>
                    <div className="flex items-center text-gray-500 mb-1" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>Date period</span>
                      <MapPin className="w-2.5 h-2.5 ml-2 mr-1" />
                      <span>Location</span>
                    </div>
                    <div className="text-gray-700" style={{ fontSize: '8px' }}>
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-1 mt-0.5">•</span>
                          <span>Highlight your accomplishments, using numbers if possible.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                EDUCATION
              </h3>
              <div className="space-y-2">
                {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                  <div key={edu.id} className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>{edu.degree}</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">{edu.school}</p>
                    <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                )) : (
                  <div className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Degree and Field of Study</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">School or University</p>
                    <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>Date period</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                LANGUAGES
              </h3>
              <div className="space-y-1">
                {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
                  <div key={language.id} className="flex items-center justify-between">
                    <span className="font-medium" style={{ fontSize: '9px' }}>{language.name}</span>
                    <div className="flex items-center">
                      <div className="flex space-x-0.5 mr-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-1.5 h-1.5 rounded-full`}
                            style={{ 
                              backgroundColor: level <= (language.level === 'Beginner' ? 1 : 
                                                       language.level === 'Intermediate' ? 3 : 
                                                       language.level === 'Advanced' ? 4 : 5)
                                ? colors.accent 
                                : '#D1D5DB'
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500" style={{ fontSize: '8px' }}>{language.level}</span>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium" style={{ fontSize: '9px' }}>Language</span>
                    <div className="flex items-center">
                      <div className="flex space-x-0.5 mr-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      </div>
                      <span className="text-gray-500" style={{ fontSize: '8px' }}>Beginner</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Navy Sidebar */}
          <div className="w-56 p-5 pl-3 text-white" style={{ backgroundColor: colors.sidebar || '#1E293B', paddingTop: '15mm', paddingRight: '15mm', paddingBottom: '15mm' }}>
            {/* Profile Photo */}
            <div className="mb-5 text-center" style={{ marginBottom: '16px' }}>
              <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 mx-auto flex items-center justify-center overflow-hidden">
                {resumeData.personalInfo.photo ? (
                  <img 
                    src={resumeData.personalInfo.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white bg-opacity-50 rounded-full mb-1"></div>
                    <div className="w-7 h-3 bg-white bg-opacity-50 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '8px' }}
              >
                KEY ACHIEVEMENTS
              </h3>
              <div className="space-y-2">
                {resumeData.certifications.length > 0 ? resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start">
                    <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-white" />
                    <div>
                      <h4 className="font-semibold text-white leading-tight" style={{ fontSize: '9px' }}>{cert.name}</h4>
                      <p className="text-white text-opacity-80" style={{ fontSize: '8px' }}>{cert.issuer}</p>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-start">
                    <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-white" />
                    <div>
                      <h4 className="font-semibold text-white" style={{ fontSize: '9px' }}>Your Achievement</h4>
                      <p className="text-white text-opacity-80" style={{ fontSize: '8px' }}>Describe what you did and the impact it had.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '8px' }}
              >
                SKILLS
              </h3>
              <div className="space-y-0.5">
                {resumeData.skills.length > 0 ? resumeData.skills.map((skill) => (
                  <div key={skill.id} className="text-white" style={{ fontSize: '9px' }}>
                    {skill.name}
                  </div>
                )) : (
                  <div className="text-white" style={{ fontSize: '9px' }}>Your Skill</div>
                )}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '8px' }}
              >
                COURSES
              </h3>
              <div>
                <p style={{ fontSize: '9px' }} className="text-white">Course Title</p>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '8px' }}
              >
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-white" />
                <span className="text-white" style={{ fontSize: '9px' }}>Career Interest / Passion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal Clean Layout
  if (template === 'minimal-clean') {
    return (
      <div id="resume-preview" style={pageStyle} className="print:shadow-none shadow-lg">
        <div style={{ minHeight: '297mm', padding: '15mm' }}>
          {/* Header */}
          <div className="text-center mb-6" style={{ marginBottom: '20px' }}>
            {/* Profile Photo */}
            <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-3 flex items-center justify-center overflow-hidden border-2" style={{ borderColor: colors.accent }}>
              {resumeData.personalInfo.photo ? (
                <img 
                  src={resumeData.personalInfo.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-500 rounded-full mb-1"></div>
                  <div className="w-6 h-2.5 bg-gray-500 rounded-full"></div>
                </div>
              )}
            </div>

            <h1 
              className="text-xl font-bold mb-1 uppercase tracking-wide"
              style={{ color: colors.primary, fontSize: '16px', marginBottom: '4px' }}
            >
              {resumeData.personalInfo.name || 'YOUR NAME'}
            </h1>
            <h2 
              className="text-sm mb-3"
              style={{ color: colors.secondary, fontSize: '11px', marginBottom: '8px' }}
            >
              {resumeData.personalInfo.title || 'The role you are applying for?'}
            </h2>
            
            {/* Contact Info */}
            <div className="flex justify-center items-center flex-wrap gap-1 text-gray-600 mb-5" style={{ fontSize: '8px', marginBottom: '16px' }}>
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

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              {/* Summary */}
              <div className="mb-5" style={{ marginBottom: '16px' }}>
                <h3 
                  className="text-lg font-bold mb-3 pb-1 border-b"
                  style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '8px' }}
                >
                  SUMMARY
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                  {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
                </p>
              </div>

              {/* Experience */}
              <div className="mb-5" style={{ marginBottom: '16px' }}>
                <h3 
                  className="text-lg font-bold mb-4 pb-1 border-b"
                  style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
                >
                  EXPERIENCE
                </h3>
                <div className="space-y-3">
                  {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
                    <div key={exp.id} className="page-break-inside-avoid" style={{ marginBottom: '12px' }}>
                      <div className="flex justify-between items-start mb-1" style={{ marginBottom: '4px' }}>
                        <div className="text-left">
                          <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>{exp.position}</h4>
                          <p style={{ color: colors.accent, fontSize: '9px' }}>{exp.company}</p>
                        </div>
                        <div className="text-right" style={{ fontSize: '8px' }}>
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-2 h-2 mr-1" />
                            <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                          </div>
                          {exp.location && (
                            <div className="flex items-center text-gray-500">
                              <MapPin className="w-2 h-2 mr-1" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-700" style={{ fontSize: '8px' }}>
                        <p className="mb-1 font-medium">Company Description</p>
                        <ul className="space-y-0.5">
                          {exp.description.map((desc, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-gray-400 mr-1 mt-0.5">•</span>
                              <span className="leading-relaxed">{desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )) : (
                    <div className="page-break-inside-avoid">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-left">
                          <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Title</h4>
                          <p style={{ color: colors.accent, fontSize: '9px' }}>Company Name</p>
                        </div>
                        <div className="text-right" style={{ fontSize: '8px' }}>
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-2 h-2 mr-1" />
                            <span>Date period</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <MapPin className="w-2 h-2 mr-1" />
                            <span>Location</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-700" style={{ fontSize: '8px' }}>
                        <p className="mb-1 font-medium">Company Description</p>
                        <ul>
                          <li className="flex items-start">
                            <span className="text-gray-400 mr-1 mt-0.5">•</span>
                            <span>Highlight your accomplishments, using numbers if possible.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 
                  className="text-lg font-bold mb-4 pb-1 border-b"
                  style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
                >
                  EDUCATION
                </h3>
                <div className="border rounded-lg p-3" style={{ borderColor: colors.accent, padding: '8px' }}>
                  {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                    <div key={edu.id} className="page-break-inside-avoid">
                      <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>{edu.degree}</h4>
                      <p style={{ color: colors.accent, fontSize: '9px' }}>{edu.school}</p>
                      <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                        <Calendar className="w-2 h-2 mr-1" />
                        <span>{edu.startDate} - {edu.endDate}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="page-break-inside-avoid">
                      <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Degree and Field of Study</h4>
                      <p style={{ color: colors.accent, fontSize: '9px' }}>School or University</p>
                      <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                        <Calendar className="w-2 h-2 mr-1" />
                        <span>Date period</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Key Achievements */}
              <div className="mb-5" style={{ marginBottom: '16px' }}>
                <h3 
                  className="text-lg font-bold mb-4 pb-1 border-b"
                  style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
                >
                  KEY ACHIEVEMENTS
                </h3>
                <div className="space-y-2">
                  {resumeData.certifications.length > 0 ? resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start">
                      <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                      <div>
                        <h4 className="font-semibold text-gray-900" style={{ fontSize: '9px' }}>{cert.name}</h4>
                        <p className="text-gray-600" style={{ fontSize: '8px' }}>{cert.issuer}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="flex items-start">
                      <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                      <div>
                        <h4 className="font-semibold text-gray-900" style={{ fontSize: '9px' }}>Your Achievement</h4>
                        <p className="text-gray-600" style={{ fontSize: '8px' }}>Describe what you did and the impact it had.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-5" style={{ marginBottom: '16px' }}>
                <h3 
                  className="text-lg font-bold mb-4 pb-1 border-b"
                  style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
                >
                  SKILLS
                </h3>
                <div>
                  {resumeData.skills.length > 0 ? (
                    <p className="text-gray-700" style={{ fontSize: '9px' }}>
                      {resumeData.skills.map(skill => skill.name).join(' • ')}
                    </p>
                  ) : (
                    <p className="text-gray-700" style={{ fontSize: '9px' }}>Your Skill</p>
                  )}
                </div>
              </div>

              {/* Courses */}
              <div className="mb-5" style={{ marginBottom: '16px' }}>
                <h3 
                  className="text-lg font-bold mb-4 pb-1 border-b"
                  style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
                >
                  COURSES
                </h3>
                <div>
                  <p style={{ color: colors.accent, fontSize: '9px' }} className="text-gray-600">Course Title</p>
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 
                  className="text-lg font-bold mb-4 pb-1 border-b"
                  style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
                >
                  INTERESTS
                </h3>
                <div className="flex items-center">
                  <Diamond className="w-3 h-3 mr-1.5" style={{ color: colors.accent }} />
                  <span className="text-gray-700" style={{ fontSize: '9px' }}>Career Interest / Passion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Languages at bottom */}
          <div className="mt-6 pt-4 border-t" style={{ marginTop: '20px', paddingTop: '12px', borderColor: colors.primary }}>
            <h3 
              className="text-lg font-bold mb-4 text-center"
              style={{ color: colors.primary, fontSize: '12px', marginBottom: '10px' }}
            >
              LANGUAGES
            </h3>
            <div className="space-y-1">
              {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
                <div key={language.id} className="flex items-center justify-between max-w-md mx-auto">
                  <span className="font-medium" style={{ fontSize: '9px' }}>{language.name}</span>
                  <div className="flex space-x-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-1.5 h-1.5 rounded-full`}
                        style={{ 
                          backgroundColor: level <= (language.level === 'Beginner' ? 1 : 
                                                   language.level === 'Intermediate' ? 3 : 
                                                   language.level === 'Advanced' ? 4 : 5)
                            ? colors.primary 
                            : '#D1D5DB'
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500" style={{ fontSize: '8px' }}>{language.level}</span>
                </div>
              )) : (
                <div className="flex items-center justify-between max-w-md mx-auto">
                  <span className="font-medium" style={{ fontSize: '9px' }}>Language</span>
                  <div className="flex space-x-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  </div>
                  <span className="text-gray-500" style={{ fontSize: '8px' }}>Beginner</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Existing templates - Modern Two-Column Layout
  if (template === 'modern-two-column') {
    return (
      <div id="resume-preview" style={pageStyle} className="print:shadow-none shadow-lg">
        <div className="flex" style={{ minHeight: '297mm' }}>
          {/* Left Column - Main Content */}
          <div className="flex-1 p-5 pr-3" style={{ paddingTop: '15mm', paddingLeft: '15mm', paddingBottom: '15mm' }}>
            {/* Header */}
            <div className="mb-5">
              <h1 
                className="text-xl font-bold mb-1 uppercase tracking-wide leading-tight"
                style={{ color: colors.primary, fontSize: '18px', marginBottom: '4px' }}
              >
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <h2 
                className="text-sm mb-3 leading-tight"
                style={{ color: colors.accent, fontSize: '12px', marginBottom: '8px' }}
              >
                {resumeData.personalInfo.title || 'The role you are applying for?'}
              </h2>
              
              {/* Contact Info Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-4" style={{ fontSize: '9px', marginBottom: '12px' }}>
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="w-2.5 h-2.5 mr-1" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-2 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '6px' }}
              >
                SUMMARY
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience - Show ALL experiences */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                EXPERIENCE
              </h3>
              <div className="space-y-3">
                {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
                  <div key={exp.id} className="page-break-inside-avoid" style={{ marginBottom: '12px' }}>
                    <h4 className="font-bold text-gray-900 leading-tight" style={{ fontSize: '10px' }}>{exp.position}</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold leading-tight">{exp.company}</p>
                    <div className="flex items-center text-gray-500 mb-1" style={{ fontSize: '8px', marginBottom: '4px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      {exp.location && (
                        <>
                          <MapPin className="w-2.5 h-2.5 ml-2 mr-1" />
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    <div className="text-gray-700" style={{ fontSize: '8px' }}>
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul className="space-y-0.5">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-gray-400 mr-1 mt-0.5">•</span>
                            <span className="leading-relaxed">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )) : (
                  <div className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Title</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">Company Name</p>
                    <div className="flex items-center text-gray-500 mb-1" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>Date period</span>
                      <MapPin className="w-2.5 h-2.5 ml-2 mr-1" />
                      <span>Location</span>
                    </div>
                    <div className="text-gray-700" style={{ fontSize: '8px' }}>
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-1 mt-0.5">•</span>
                          <span>Highlight your accomplishments, using numbers if possible.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                EDUCATION
              </h3>
              <div className="space-y-2">
                {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                  <div key={edu.id} className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>{edu.degree}</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">{edu.school}</p>
                    <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                )) : (
                  <div className="page-break-inside-avoid">
                    <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Degree and Field of Study</h4>
                    <p style={{ color: colors.accent, fontSize: '10px' }} className="font-semibold">School or University</p>
                    <div className="flex items-center text-gray-500" style={{ fontSize: '8px' }}>
                      <Calendar className="w-2.5 h-2.5 mr-1" />
                      <span>Date period</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                LANGUAGES
              </h3>
              <div className="space-y-1">
                {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
                  <div key={language.id} className="flex items-center justify-between">
                    <span className="font-medium" style={{ fontSize: '9px' }}>{language.name}</span>
                    <div className="flex items-center">
                      <div className="flex space-x-0.5 mr-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-1.5 h-1.5 rounded-full ${
                              level <= (language.level === 'Beginner' ? 1 : 
                                       language.level === 'Intermediate' ? 3 : 
                                       language.level === 'Advanced' ? 4 : 5)
                                ? 'bg-blue-500' 
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500" style={{ fontSize: '8px' }}>{language.level}</span>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium" style={{ fontSize: '9px' }}>Language</span>
                    <div className="flex items-center">
                      <div className="flex space-x-0.5 mr-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      </div>
                      <span className="text-gray-500" style={{ fontSize: '8px' }}>Beginner</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-56 p-5 pl-3" style={{ backgroundColor: colors.sidebar || '#F8FAFC', paddingTop: '15mm', paddingRight: '15mm', paddingBottom: '15mm' }}>
            {/* Profile Photo */}
            <div className="mb-5 text-center" style={{ marginBottom: '16px' }}>
              <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto flex items-center justify-center overflow-hidden">
                {resumeData.personalInfo.photo ? (
                  <img 
                    src={resumeData.personalInfo.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center">
                    <div className="w-5 h-5 bg-gray-500 rounded-full mb-1"></div>
                    <div className="w-7 h-3 bg-gray-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                KEY ACHIEVEMENTS
              </h3>
              <div className="space-y-2">
                {resumeData.certifications.length > 0 ? resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start">
                    <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                    <div>
                      <h4 className="font-semibold text-gray-900 leading-tight" style={{ fontSize: '9px' }}>{cert.name}</h4>
                      <p className="text-gray-600" style={{ fontSize: '8px' }}>{cert.issuer}</p>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-start">
                    <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                    <div>
                      <h4 className="font-semibold text-gray-900" style={{ fontSize: '9px' }}>Your Achievement</h4>
                      <p className="text-gray-600" style={{ fontSize: '8px' }}>Describe what you did and the impact it had.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                SKILLS
              </h3>
              <div className="space-y-0.5">
                {resumeData.skills.length > 0 ? resumeData.skills.map((skill) => (
                  <div key={skill.id} className="text-gray-700" style={{ fontSize: '9px' }}>
                    {skill.name}
                  </div>
                )) : (
                  <div className="text-gray-700" style={{ fontSize: '9px' }}>Your Skill</div>
                )}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-5" style={{ marginBottom: '16px' }}>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                COURSES
              </h3>
              <div>
                <p style={{ color: colors.accent, fontSize: '9px' }} className="text-gray-600">Course Title</p>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text, fontSize: '11px', marginBottom: '8px' }}
              >
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                <span className="text-gray-700" style={{ fontSize: '9px' }}>Career Interest / Passion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic Centered Layout
  if (template === 'classic-centered') {
    return (
      <div id="resume-preview" style={pageStyle} className="print:shadow-none shadow-lg">
        <div style={{ minHeight: '297mm', padding: '15mm' }}>
          {/* Header */}
          <div className="text-center mb-6" style={{ marginBottom: '20px' }}>
            {/* Profile Photo */}
            <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-3 flex items-center justify-center overflow-hidden">
              {resumeData.personalInfo.photo ? (
                <img 
                  src={resumeData.personalInfo.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-500 rounded-full mb-1"></div>
                  <div className="w-6 h-2.5 bg-gray-500 rounded-full"></div>
                </div>
              )}
            </div>

            <h1 
              className="text-xl font-bold mb-1 uppercase tracking-wide"
              style={{ color: colors.primary, fontSize: '16px', marginBottom: '4px' }}
            >
              {resumeData.personalInfo.name || 'YOUR NAME'}
            </h1>
            <h2 
              className="text-sm mb-3"
              style={{ color: colors.secondary, fontSize: '11px', marginBottom: '8px' }}
            >
              {resumeData.personalInfo.title || 'The role you are applying for?'}
            </h2>
            
            {/* Contact Info */}
            <div className="flex justify-center items-center flex-wrap gap-1 text-gray-600 mb-5" style={{ fontSize: '8px', marginBottom: '16px' }}>
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
          <div className="mb-5" style={{ marginBottom: '16px' }}>
            <h3 
              className="text-lg font-bold mb-3 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '8px' }}
            >
              Summary
            </h3>
            <p className="text-gray-600 leading-relaxed text-center max-w-4xl mx-auto" style={{ fontSize: '9px', lineHeight: '1.4' }}>
              {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
            </p>
          </div>

          {/* Experience - Show ALL experiences */}
          <div className="mb-5" style={{ marginBottom: '16px' }}>
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
            >
              Experience
            </h3>
            <div className="space-y-3">
              {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-3 page-break-inside-avoid" style={{ padding: '8px' }}>
                  <div className="flex justify-between items-start mb-2" style={{ marginBottom: '6px' }}>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>{exp.company}</h4>
                      <p style={{ fontSize: '9px' }}>{exp.position}</p>
                    </div>
                    <div className="text-right" style={{ fontSize: '8px' }}>
                      <p className="text-gray-500">{exp.location}</p>
                      <p className="text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    </div>
                  </div>
                  <div className="text-gray-700" style={{ fontSize: '8px' }}>
                    <p className="mb-1 font-medium">Company Description</p>
                    <ul className="space-y-0.5">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-gray-400 mr-1 mt-0.5">•</span>
                          <span className="leading-relaxed">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )) : (
                <div className="border rounded-lg p-3 page-break-inside-avoid">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>Company Name</h4>
                      <p style={{ fontSize: '9px' }}>Title</p>
                    </div>
                    <div className="text-right" style={{ fontSize: '8px' }}>
                      <p className="text-gray-500">Location</p>
                      <p className="text-gray-500">Date period</p>
                    </div>
                  </div>
                  <div className="text-gray-700" style={{ fontSize: '8px' }}>
                    <p className="mb-1 font-medium">Company Description</p>
                    <ul>
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-1 mt-0.5">•</span>
                        <span>Highlight your accomplishments, using numbers if possible.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="mb-5" style={{ marginBottom: '16px' }}>
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
            >
              Education
            </h3>
            <div className="text-center space-y-2">
              {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                <div key={edu.id} className="page-break-inside-avoid">
                  <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>{edu.school}</h4>
                  <p style={{ fontSize: '9px' }}>{edu.degree}</p>
                  <p className="text-gray-500" style={{ fontSize: '8px' }}>{edu.startDate} - {edu.endDate}</p>
                </div>
              )) : (
                <div className="page-break-inside-avoid">
                  <h4 className="font-bold text-gray-900" style={{ fontSize: '10px' }}>School or University</h4>
                  <p style={{ fontSize: '9px' }}>Degree and Field of Study</p>
                  <p className="text-gray-500" style={{ fontSize: '8px' }}>Date period</p>
                </div>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-5" style={{ marginBottom: '16px' }}>
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
            >
              Languages
            </h3>
            <div className="space-y-1">
              {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
                <div key={language.id} className="flex items-center justify-between max-w-md mx-auto">
                  <span className="font-medium" style={{ fontSize: '9px' }}>{language.name}</span>
                  <div className="flex space-x-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-1.5 h-1.5 rounded-full ${
                          level <= (language.level === 'Beginner' ? 1 : 
                                   language.level === 'Intermediate' ? 3 : 
                                   language.level === 'Advanced' ? 4 : 5)
                            ? 'bg-black' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500" style={{ fontSize: '8px' }}>{language.level}</span>
                </div>
              )) : (
                <div className="flex items-center justify-between max-w-md mx-auto">
                  <span className="font-medium" style={{ fontSize: '9px' }}>Language</span>
                  <div className="flex space-x-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  </div>
                  <span className="text-gray-500" style={{ fontSize: '8px' }}>Beginner</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Achievements */}
          <div className="mb-5" style={{ marginBottom: '16px' }}>
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
            >
              Key Achievements
            </h3>
            <div className="space-y-2">
              {resumeData.certifications.length > 0 ? resumeData.certifications.map((cert) => (
                <div key={cert.id} className="flex items-start max-w-2xl mx-auto">
                  <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                  <div>
                    <h4 className="font-semibold text-gray-900" style={{ fontSize: '9px' }}>{cert.name}</h4>
                    <p className="text-gray-600" style={{ fontSize: '8px' }}>{cert.issuer}</p>
                  </div>
                </div>
              )) : (
                <div className="flex items-start max-w-2xl mx-auto">
                  <Diamond className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                  <div>
                    <h4 className="font-semibold text-gray-900" style={{ fontSize: '9px' }}>Your Achievement</h4>
                    <p className="text-gray-600" style={{ fontSize: '8px' }}>Describe what you did and the impact it had.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-5" style={{ marginBottom: '16px' }}>
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
            >
              Skills
            </h3>
            <div className="text-center">
              {resumeData.skills.length > 0 ? (
                <p className="text-gray-700" style={{ fontSize: '9px' }}>
                  {resumeData.skills.map(skill => skill.name).join(' • ')}
                </p>
              ) : (
                <p className="text-gray-700" style={{ fontSize: '9px' }}>Your Skill</p>
              )}
            </div>
          </div>

          {/* Courses */}
          <div className="mb-5" style={{ marginBottom: '16px' }}>
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
            >
              Courses
            </h3>
            <div className="text-center">
              <p style={{ color: colors.accent, fontSize: '9px' }} className="text-gray-600">Course Title</p>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary, fontSize: '12px', marginBottom: '10px' }}
            >
              Interests
            </h3>
            <div className="flex items-center justify-center">
              <Diamond className="w-3 h-3 mr-1.5" style={{ color: colors.accent }} />
              <span className="text-gray-700" style={{ fontSize: '9px' }}>Career Interest / Passion</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div 
      id="resume-preview" 
      style={pageStyle}
      className="print:shadow-none shadow-lg"
    >
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">{resumeData.personalInfo.name}</h1>
        <h2 className="text-lg mb-4">{resumeData.personalInfo.title}</h2>
        <p>Template not found. Please select a valid template.</p>
      </div>
    </div>
  );
};