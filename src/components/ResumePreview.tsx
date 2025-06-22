import React from 'react';
import { ResumeData } from '../types/resume';
import { resumeTemplates } from '../data/templates';
import { Mail, Phone, MapPin, Globe, Linkedin, User, Diamond, GraduationCap, Calendar, MapPin as Location } from 'lucide-react';

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
  const templateConfig = resumeTemplates.find(t => t.id === template);
  if (!templateConfig) return null;

  const colors = { ...templateConfig.colors, ...customColors };
  const fontFamily = font === 'Inter' ? 'Inter, sans-serif' : 
                    font === 'Roboto' ? 'Roboto, sans-serif' :
                    font === 'Open Sans' ? 'Open Sans, sans-serif' :
                    font === 'Lato' ? 'Lato, sans-serif' :
                    font === 'Playfair Display' ? 'Playfair Display, serif' :
                    font === 'Merriweather' ? 'Merriweather, serif' : 'Inter, sans-serif';

  // Green Organic Sidebar Template - EXACT MATCH
  if (template === 'green-organic-sidebar') {
    return (
      <div id="resume-preview" className="a4-page bg-white" style={{ fontFamily }}>
        <div className="flex h-full">
          {/* Left Sidebar - Exact match to image */}
          <div className="w-1/3 p-8 relative" style={{ backgroundColor: '#F0FDF4' }}>
            {/* Organic shape decorations - exact positioning */}
            <div className="absolute top-8 left-6 w-24 h-24 rounded-full opacity-40" 
                 style={{ backgroundColor: '#86EFAC' }}></div>
            <div className="absolute top-12 left-10 w-16 h-16 rounded-full opacity-30" 
                 style={{ backgroundColor: '#4ADE80' }}></div>
            <div className="absolute top-16 left-14 w-12 h-12 rounded-full opacity-20" 
                 style={{ backgroundColor: '#22C55E' }}></div>
            
            {/* Profile Photo */}
            <div className="relative z-10 mb-8">
              <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {resumeData.personalInfo.photo ? (
                  <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-500" />
                )}
              </div>
            </div>

            {/* Contacts Section */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center mb-4" style={{ color: '#059669' }}>
                <Mail className="w-5 h-5 mr-3" />
                <h3 className="font-bold text-base uppercase tracking-wide">CONTACTS</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex items-center mb-1" style={{ color: '#059669' }}>
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-medium">Phone</span>
                  </div>
                  <div className="text-gray-700 ml-6">{resumeData.personalInfo.phone}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1" style={{ color: '#059669' }}>
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="font-medium">Email</span>
                  </div>
                  <div className="text-gray-700 ml-6 break-all">{resumeData.personalInfo.email}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1" style={{ color: '#059669' }}>
                    <Linkedin className="w-4 h-4 mr-2" />
                    <span className="font-medium">LinkedIn/Portfolio</span>
                  </div>
                  <div className="text-gray-700 ml-6 break-all">{resumeData.personalInfo.linkedin}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1" style={{ color: '#059669' }}>
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-medium">Location</span>
                  </div>
                  <div className="text-gray-700 ml-6">{resumeData.personalInfo.location}</div>
                </div>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center mb-4" style={{ color: '#059669' }}>
                <Diamond className="w-5 h-5 mr-3" />
                <h3 className="font-bold text-base uppercase tracking-wide">KEY ACHIEVEMENTS</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0" style={{ backgroundColor: '#34D399' }}></div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Your Achievement</div>
                    <div className="text-xs text-gray-600 leading-relaxed">Describe what you did and the impact it had.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center mb-4" style={{ color: '#059669' }}>
                <div className="w-5 h-5 mr-3 rounded flex items-center justify-center" style={{ backgroundColor: '#059669' }}>
                  <div className="w-2 h-2 bg-white rounded"></div>
                </div>
                <h3 className="font-bold text-base uppercase tracking-wide">SKILLS</h3>
              </div>
              <div className="space-y-2">
                {resumeData.skills.slice(0, 8).map((skill) => (
                  <div key={skill.id} className="text-sm text-gray-700">{skill.name}</div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center mb-4" style={{ color: '#059669' }}>
                <GraduationCap className="w-5 h-5 mr-3" />
                <h3 className="font-bold text-base uppercase tracking-wide">COURSES</h3>
              </div>
              <div className="text-sm text-gray-700">Course Title</div>
            </div>

            {/* Interests */}
            <div className="relative z-10">
              <div className="flex items-center mb-4" style={{ color: '#059669' }}>
                <div className="w-5 h-5 mr-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#34D399' }}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <h3 className="font-bold text-base uppercase tracking-wide">INTERESTS</h3>
              </div>
              <div className="flex items-start">
                <div className="w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0" style={{ backgroundColor: '#34D399' }}></div>
                <div className="text-sm text-gray-700">Career Interest / Passion</div>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-3 text-gray-800 uppercase tracking-wide">
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <div className="inline-block px-6 py-2 rounded-full text-lg font-medium" 
                   style={{ backgroundColor: '#DCFCE7', color: '#059669' }}>
                {resumeData.personalInfo.title || 'THE ROLE YOU ARE APPLYING FOR?'}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <div className="flex items-center mb-4" style={{ color: '#059669' }}>
                <User className="w-5 h-5 mr-3" />
                <h2 className="font-bold text-lg uppercase tracking-wide">SUMMARY</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <div className="flex items-center mb-4" style={{ color: '#059669' }}>
                <div className="w-5 h-5 mr-3 rounded flex items-center justify-center" style={{ backgroundColor: '#059669' }}>
                  <div className="w-2 h-2 bg-white rounded"></div>
                </div>
                <h2 className="font-bold text-lg uppercase tracking-wide">EXPERIENCE</h2>
              </div>
              <div className="space-y-6">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-base text-gray-800">{exp.company}</div>
                        <div className="text-sm text-gray-700">{exp.position}</div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>{exp.location}</div>
                        <div>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Company Description</div>
                    <ul className="text-sm space-y-1 text-gray-700">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-3 mt-1 text-green-500">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <div className="flex items-center mb-4" style={{ color: '#059669' }}>
                <GraduationCap className="w-5 h-5 mr-3" />
                <h2 className="font-bold text-lg uppercase tracking-wide">EDUCATION</h2>
              </div>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="border rounded-lg p-4" style={{ borderColor: '#D1FAE5', backgroundColor: '#F0FDF4' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-base text-gray-800">{edu.school}</div>
                        <div className="text-sm text-gray-700">{edu.degree}</div>
                      </div>
                      <div className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <div className="flex items-center mb-4" style={{ color: '#059669' }}>
                  <Globe className="w-5 h-5 mr-3" />
                  <h2 className="font-bold text-lg uppercase tracking-wide">LANGUAGES</h2>
                </div>
                <div className="space-y-3">
                  {resumeData.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{lang.name}</span>
                      <div className="flex items-center">
                        <span className="text-sm mr-3 text-gray-600">{lang.level}</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div key={dot} className="w-3 h-3 rounded-full" 
                                 style={{ backgroundColor: dot <= 3 ? '#059669' : '#E5E7EB' }}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Navy Header Professional Template - EXACT MATCH
  if (template === 'navy-header-professional') {
    return (
      <div id="resume-preview" className="a4-page bg-white" style={{ fontFamily }}>
        {/* Navy Header */}
        <div className="p-8" style={{ backgroundColor: '#1E293B' }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <div className="text-xl mb-6" style={{ color: '#60A5FA' }}>
                {resumeData.personalInfo.title || 'The role you are applying for?'}
              </div>
              <div className="flex items-center space-x-6 text-sm" style={{ color: '#E2E8F0' }}>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Phone</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>Email</span>
                </div>
                <div className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-2" />
                  <span>LinkedIn/Portfolio</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Location</span>
                </div>
              </div>
            </div>
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {resumeData.personalInfo.photo ? (
                <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex p-8">
          {/* Left Column */}
          <div className="w-2/3 pr-8">
            {/* Summary */}
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" style={{ color: '#1E293B', borderColor: '#1E293B' }}>
                SUMMARY
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" style={{ color: '#1E293B', borderColor: '#1E293B' }}>
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="font-bold text-base text-gray-800">{exp.position}</div>
                    <div className="text-sm mb-2" style={{ color: '#60A5FA' }}>{exp.company}</div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      <Location className="w-4 h-4 ml-4 mr-2" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Company Description</div>
                    <ul className="text-sm space-y-1 text-gray-700">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-3 mt-1 text-blue-500">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" style={{ color: '#1E293B', borderColor: '#1E293B' }}>
                EDUCATION
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-base text-gray-800">{edu.degree}</div>
                    <div className="text-sm" style={{ color: '#60A5FA' }}>{edu.school}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" style={{ color: '#1E293B', borderColor: '#1E293B' }}>
                  LANGUAGES
                </h2>
                <div className="space-y-3">
                  {resumeData.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{lang.name}</span>
                      <div className="flex items-center">
                        <span className="text-sm mr-3 text-gray-600">{lang.level}</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div key={dot} className="w-3 h-3 rounded-full" 
                                 style={{ backgroundColor: dot <= 3 ? '#1E293B' : '#E5E7EB' }}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-1/3">
            {/* Key Achievements */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" style={{ color: '#1E293B', borderColor: '#1E293B' }}>
                KEY ACHIEVEMENTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-4 h-4 mt-1 mr-3 flex-shrink-0" style={{ color: '#60A5FA' }} />
                <div>
                  <div className="font-semibold text-sm text-gray-800">Your Achievement</div>
                  <div className="text-xs text-gray-600 leading-relaxed">Describe what you did and the impact it had.</div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" style={{ color: '#1E293B', borderColor: '#1E293B' }}>
                SKILLS
              </h3>
              <div className="space-y-2">
                {resumeData.skills.slice(0, 10).map((skill) => (
                  <div key={skill.id} className="text-sm text-gray-700">{skill.name}</div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" style={{ color: '#1E293B', borderColor: '#1E293B' }}>
                COURSES
              </h3>
              <div className="text-sm text-gray-700">Course Title</div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" style={{ color: '#1E293B', borderColor: '#1E293B' }}>
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-4 h-4 mt-1 mr-3 flex-shrink-0" style={{ color: '#60A5FA' }} />
                <div className="text-sm text-gray-700">Career Interest / Passion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback for other templates
  return (
    <div id="resume-preview" className="a4-page bg-white p-8" style={{ fontFamily }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3" style={{ color: colors.primary }}>
          {resumeData.personalInfo.name}
        </h1>
        <p className="text-xl mb-4" style={{ color: colors.secondary }}>
          {resumeData.personalInfo.title}
        </p>
        <div className="text-sm mb-6 text-gray-600">
          {resumeData.personalInfo.email} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.location}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>Summary</h2>
        <p className="text-sm leading-relaxed">{resumeData.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>Experience</h2>
        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <h3 className="font-semibold">{exp.position}</h3>
            <p className="text-sm" style={{ color: colors.secondary }}>{exp.company} • {exp.location}</p>
            <p className="text-sm text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
            <ul className="text-sm mt-2">
              {exp.description.map((desc, index) => (
                <li key={index}>• {desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>Education</h2>
        {resumeData.education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <h3 className="font-semibold">{edu.degree}</h3>
            <p className="text-sm" style={{ color: colors.secondary }}>{edu.school} • {edu.location}</p>
            <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill) => (
            <span key={skill.id} className="px-3 py-1 rounded-full text-sm" 
                  style={{ backgroundColor: colors.accent + '20', color: colors.text }}>
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};