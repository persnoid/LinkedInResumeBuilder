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

  // A4 dimensions: 210mm x 297mm (8.27" x 11.69")
  const A4_WIDTH = '210mm';
  const A4_HEIGHT = '297mm';

  // Modern Two-Column Layout (Based on first image)
  if (template === 'modern-two-column') {
    return (
      <div 
        id="resume-preview" 
        className="bg-white shadow-lg mx-auto"
        style={{ 
          fontFamily, 
          width: A4_WIDTH,
          minHeight: A4_HEIGHT,
          maxWidth: '794px', // A4 width in pixels at 96 DPI
          fontSize: '11px',
          lineHeight: '1.4'
        }}
      >
        {/* Page 1 */}
        <div 
          className="flex h-full page-break-after"
          style={{ 
            minHeight: A4_HEIGHT,
            pageBreakAfter: 'always'
          }}
        >
          {/* Left Column - Main Content */}
          <div className="flex-1 p-6 pr-4">
            {/* Header */}
            <div className="mb-6">
              <h1 
                className="text-2xl font-bold mb-1 uppercase tracking-wide leading-tight"
                style={{ color: colors.primary }}
              >
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <h2 
                className="text-sm mb-3 leading-tight"
                style={{ color: colors.accent }}
              >
                {resumeData.personalInfo.title || 'The role you are applying for?'}
              </h2>
              
              {/* Contact Info Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-4">
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    <span>{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="w-3 h-3 mr-1" />
                    <span>{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h3 
                className="text-sm font-bold mb-2 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                SUMMARY
              </h3>
              <p className="text-gray-600 leading-relaxed text-xs">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                EXPERIENCE
              </h3>
              <div className="space-y-4">
                {resumeData.experience.length > 0 ? resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className={index > 1 ? 'page-break-before' : ''}>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{exp.position}</h4>
                    <p style={{ color: colors.accent }} className="font-semibold text-sm leading-tight">{exp.company}</p>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      {exp.location && (
                        <>
                          <MapPin className="w-3 h-3 ml-3 mr-1" />
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    <div className="text-gray-700 text-xs">
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul className="space-y-1">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-gray-400 mr-2 mt-0.5">•</span>
                            <span className="leading-relaxed">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )) : (
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Title</h4>
                    <p style={{ color: colors.accent }} className="font-semibold text-sm">Company Name</p>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Date period</span>
                      <MapPin className="w-3 h-3 ml-3 mr-1" />
                      <span>Location</span>
                    </div>
                    <div className="text-gray-700 text-xs">
                      <p className="mb-1 font-medium">Company Description</p>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-2 mt-0.5">•</span>
                          <span>Highlight your accomplishments, using numbers if possible.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                EDUCATION
              </h3>
              <div className="space-y-3">
                {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-gray-900 text-sm">{edu.degree}</h4>
                    <p style={{ color: colors.accent }} className="font-semibold text-sm">{edu.school}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                )) : (
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Degree and Field of Study</h4>
                    <p style={{ color: colors.accent }} className="font-semibold text-sm">School or University</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
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
                style={{ color: colors.text, borderColor: colors.text }}
              >
                LANGUAGES
              </h3>
              <div className="space-y-2">
                {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
                  <div key={language.id} className="flex items-center justify-between">
                    <span className="font-medium text-xs">{language.name}</span>
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full ${
                              level <= (language.level === 'Beginner' ? 1 : 
                                       language.level === 'Intermediate' ? 3 : 
                                       language.level === 'Advanced' ? 4 : 5)
                                ? 'bg-blue-500' 
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{language.level}</span>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs">Language</span>
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                      <span className="text-xs text-gray-500">Beginner</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-64 bg-gray-50 p-6 pl-4">
            {/* Profile Photo */}
            <div className="mb-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto flex items-center justify-center overflow-hidden">
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
            </div>

            {/* Key Achievements */}
            <div className="mb-6">
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                KEY ACHIEVEMENTS
              </h3>
              <div className="space-y-3">
                {resumeData.certifications.length > 0 ? resumeData.certifications.slice(0, 3).map((cert) => (
                  <div key={cert.id} className="flex items-start">
                    <Diamond className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs leading-tight">{cert.name}</h4>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-start">
                    <Diamond className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs">Your Achievement</h4>
                      <p className="text-xs text-gray-600">Describe what you did and the impact it had.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                SKILLS
              </h3>
              <div className="space-y-1">
                {resumeData.skills.length > 0 ? resumeData.skills.map((skill) => (
                  <div key={skill.id} className="text-gray-700 text-xs">
                    {skill.name}
                  </div>
                )) : (
                  <div className="text-gray-700 text-xs">Your Skill</div>
                )}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-6">
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                COURSES
              </h3>
              <div className="space-y-1">
                <p style={{ color: colors.accent }} className="text-gray-600 text-xs">Course Title</p>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 
                className="text-sm font-bold mb-3 pb-1 border-b uppercase tracking-wide"
                style={{ color: colors.text, borderColor: colors.text }}
              >
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                <span className="text-gray-700 text-xs">Career Interest / Passion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional pages for overflow content */}
        {resumeData.experience.length > 3 && (
          <div 
            className="p-6"
            style={{ 
              minHeight: A4_HEIGHT,
              pageBreakBefore: 'always'
            }}
          >
            <h3 
              className="text-sm font-bold mb-4 pb-1 border-b uppercase tracking-wide"
              style={{ color: colors.text, borderColor: colors.text }}
            >
              EXPERIENCE (CONTINUED)
            </h3>
            <div className="space-y-4">
              {resumeData.experience.slice(3).map((exp) => (
                <div key={exp.id}>
                  <h4 className="font-bold text-gray-900 text-sm">{exp.position}</h4>
                  <p style={{ color: colors.accent }} className="font-semibold text-sm">{exp.company}</p>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    {exp.location && (
                      <>
                        <MapPin className="w-3 h-3 ml-3 mr-1" />
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>
                  <div className="text-gray-700 text-xs">
                    <ul className="space-y-1">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-gray-400 mr-2 mt-0.5">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Classic Centered Layout (Based on second image)
  if (template === 'classic-centered') {
    return (
      <div 
        id="resume-preview" 
        className="bg-white shadow-lg mx-auto"
        style={{ 
          fontFamily, 
          width: A4_WIDTH,
          minHeight: A4_HEIGHT,
          maxWidth: '794px',
          fontSize: '11px',
          lineHeight: '1.4'
        }}
      >
        {/* Page 1 */}
        <div 
          className="p-8 page-break-after"
          style={{ 
            minHeight: A4_HEIGHT,
            pageBreakAfter: 'always'
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            {/* Profile Photo */}
            <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center overflow-hidden">
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

            <h1 
              className="text-2xl font-bold mb-1 uppercase tracking-wide"
              style={{ color: colors.primary }}
            >
              {resumeData.personalInfo.name || 'YOUR NAME'}
            </h1>
            <h2 
              className="text-sm mb-3"
              style={{ color: colors.secondary }}
            >
              {resumeData.personalInfo.title || 'The role you are applying for?'}
            </h2>
            
            {/* Contact Info */}
            <div className="flex justify-center items-center flex-wrap gap-2 text-xs text-gray-600 mb-6">
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
          <div className="mb-6">
            <h3 
              className="text-lg font-bold mb-3 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary }}
            >
              Summary
            </h3>
            <p className="text-gray-600 leading-relaxed text-center max-w-4xl mx-auto text-xs">
              {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
            </p>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary }}
            >
              Experience
            </h3>
            <div className="space-y-4">
              {resumeData.experience.length > 0 ? resumeData.experience.slice(0, 2).map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 text-sm">{exp.company}</h4>
                      <p className="text-sm">{exp.position}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-gray-500">{exp.location}</p>
                      <p className="text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    </div>
                  </div>
                  <div className="text-gray-700 text-xs">
                    <p className="mb-2 font-medium">Company Description</p>
                    <ul className="space-y-1">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-gray-400 mr-2 mt-0.5">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )) : (
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 text-sm">Company Name</h4>
                      <p className="text-sm">Title</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-gray-500">Location</p>
                      <p className="text-gray-500">Date period</p>
                    </div>
                  </div>
                  <div className="text-gray-700 text-xs">
                    <p className="mb-2 font-medium">Company Description</p>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-2 mt-0.5">•</span>
                        <span>Highlight your accomplishments, using numbers if possible.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary }}
            >
              Education
            </h3>
            <div className="text-center space-y-3">
              {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-bold text-gray-900 text-sm">{edu.school}</h4>
                  <p className="text-sm">{edu.degree}</p>
                  <p className="text-gray-500 text-xs">{edu.startDate} - {edu.endDate}</p>
                </div>
              )) : (
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">School or University</h4>
                  <p className="text-sm">Degree and Field of Study</p>
                  <p className="text-gray-500 text-xs">Date period</p>
                </div>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary }}
            >
              Languages
            </h3>
            <div className="space-y-2">
              {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((language) => (
                <div key={language.id} className="flex items-center justify-between max-w-md mx-auto">
                  <span className="font-medium text-xs">{language.name}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= (language.level === 'Beginner' ? 1 : 
                                   language.level === 'Intermediate' ? 3 : 
                                   language.level === 'Advanced' ? 4 : 5)
                            ? 'bg-black' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{language.level}</span>
                </div>
              )) : (
                <div className="flex items-center justify-between max-w-md mx-auto">
                  <span className="font-medium text-xs">Language</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-black" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                  <span className="text-xs text-gray-500">Beginner</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Achievements */}
          <div className="mb-6">
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary }}
            >
              Key Achievements
            </h3>
            <div className="space-y-3">
              {resumeData.certifications.length > 0 ? resumeData.certifications.slice(0, 2).map((cert) => (
                <div key={cert.id} className="flex items-start max-w-2xl mx-auto">
                  <Diamond className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs">{cert.name}</h4>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                  </div>
                </div>
              )) : (
                <div className="flex items-start max-w-2xl mx-auto">
                  <Diamond className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs">Your Achievement</h4>
                    <p className="text-xs text-gray-600">Describe what you did and the impact it had.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary }}
            >
              Skills
            </h3>
            <div className="text-center">
              {resumeData.skills.length > 0 ? (
                <p className="text-gray-700 text-xs">
                  {resumeData.skills.map(skill => skill.name).join(' • ')}
                </p>
              ) : (
                <p className="text-gray-700 text-xs">Your Skill</p>
              )}
            </div>
          </div>

          {/* Courses */}
          <div className="mb-6">
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary }}
            >
              Courses
            </h3>
            <div className="text-center">
              <p style={{ color: colors.accent }} className="text-gray-600 text-xs">Course Title</p>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 
              className="text-lg font-bold mb-4 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary }}
            >
              Interests
            </h3>
            <div className="flex items-center justify-center">
              <Diamond className="w-4 h-4 mr-2" style={{ color: colors.accent }} />
              <span className="text-gray-700 text-xs">Career Interest / Passion</span>
            </div>
          </div>
        </div>

        {/* Additional pages for overflow content */}
        {resumeData.experience.length > 2 && (
          <div 
            className="p-8"
            style={{ 
              minHeight: A4_HEIGHT,
              pageBreakBefore: 'always'
            }}
          >
            <h3 
              className="text-lg font-bold mb-6 text-center pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.primary }}
            >
              Experience (Continued)
            </h3>
            <div className="space-y-4">
              {resumeData.experience.slice(2).map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 text-sm">{exp.company}</h4>
                      <p className="text-sm">{exp.position}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-gray-500">{exp.location}</p>
                      <p className="text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    </div>
                  </div>
                  <div className="text-gray-700 text-xs">
                    <ul className="space-y-1">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-gray-400 mr-2 mt-0.5">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default fallback
  return (
    <div 
      id="resume-preview" 
      className="bg-white shadow-lg mx-auto p-8"
      style={{ 
        fontFamily, 
        width: A4_WIDTH,
        minHeight: A4_HEIGHT,
        maxWidth: '794px'
      }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{resumeData.personalInfo.name}</h1>
        <h2 className="text-lg mb-4">{resumeData.personalInfo.title}</h2>
        <p>Template not found. Please select a valid template.</p>
      </div>
    </div>
  );
};