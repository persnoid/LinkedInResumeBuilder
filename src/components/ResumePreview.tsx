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

  // Green Organic Sidebar Template
  if (template === 'green-organic-sidebar') {
    return (
      <div id="resume-preview" className="a4-page bg-white" style={{ fontFamily }}>
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-1/3 p-6 relative" style={{ backgroundColor: colors.sidebar }}>
            {/* Organic shape decoration */}
            <div className="absolute top-4 left-4 w-20 h-20 rounded-full opacity-30" 
                 style={{ backgroundColor: colors.accent }}></div>
            <div className="absolute top-8 left-8 w-16 h-16 rounded-full opacity-20" 
                 style={{ backgroundColor: colors.primary }}></div>
            
            {/* Profile Photo */}
            <div className="relative z-10 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto flex items-center justify-center overflow-hidden">
                {resumeData.personalInfo.photo ? (
                  <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-500" />
                )}
              </div>
            </div>

            {/* Contacts */}
            <div className="mb-6">
              <div className="flex items-center mb-3" style={{ color: colors.primary }}>
                <Mail className="w-4 h-4 mr-2" />
                <h3 className="font-bold text-sm">CONTACTS</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center" style={{ color: colors.primary }}>
                  <Phone className="w-3 h-3 mr-2" />
                  <span>Phone</span>
                </div>
                <div className="text-xs">{resumeData.personalInfo.phone}</div>
                
                <div className="flex items-center" style={{ color: colors.primary }}>
                  <Mail className="w-3 h-3 mr-2" />
                  <span>Email</span>
                </div>
                <div className="text-xs">{resumeData.personalInfo.email}</div>
                
                <div className="flex items-center" style={{ color: colors.primary }}>
                  <Linkedin className="w-3 h-3 mr-2" />
                  <span>LinkedIn/Portfolio</span>
                </div>
                <div className="text-xs">{resumeData.personalInfo.linkedin}</div>
                
                <div className="flex items-center" style={{ color: colors.primary }}>
                  <MapPin className="w-3 h-3 mr-2" />
                  <span>Location</span>
                </div>
                <div className="text-xs">{resumeData.personalInfo.location}</div>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-6">
              <div className="flex items-center mb-3" style={{ color: colors.primary }}>
                <Diamond className="w-4 h-4 mr-2" />
                <h3 className="font-bold text-sm">KEY ACHIEVEMENTS</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full mt-1 mr-2" style={{ backgroundColor: colors.accent }}></div>
                  <div>
                    <div className="font-medium text-xs">Your Achievement</div>
                    <div className="text-xs text-gray-600">Describe what you did and the impact it had.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <div className="flex items-center mb-3" style={{ color: colors.primary }}>
                <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: colors.primary }}></div>
                <h3 className="font-bold text-sm">SKILLS</h3>
              </div>
              <div className="space-y-1">
                {resumeData.skills.slice(0, 6).map((skill) => (
                  <div key={skill.id} className="text-xs">{skill.name}</div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-6">
              <div className="flex items-center mb-3" style={{ color: colors.primary }}>
                <GraduationCap className="w-4 h-4 mr-2" />
                <h3 className="font-bold text-sm">COURSES</h3>
              </div>
              <div className="text-xs">Course Title</div>
            </div>

            {/* Interests */}
            <div>
              <div className="flex items-center mb-3" style={{ color: colors.primary }}>
                <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: colors.accent }}></div>
                <h3 className="font-bold text-sm">INTERESTS</h3>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full mt-1 mr-2" style={{ backgroundColor: colors.accent }}></div>
                <div className="text-xs">Career Interest / Passion</div>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <div className="inline-block px-4 py-1 rounded-full text-sm" 
                   style={{ backgroundColor: colors.highlight, color: colors.primary }}>
                {resumeData.personalInfo.title || 'THE ROLE YOU ARE APPLYING FOR?'}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <div className="flex items-center mb-3" style={{ color: colors.primary }}>
                <User className="w-4 h-4 mr-2" />
                <h2 className="font-bold text-sm">SUMMARY</h2>
              </div>
              <p className="text-xs leading-relaxed">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <div className="flex items-center mb-3" style={{ color: colors.primary }}>
                <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: colors.primary }}></div>
                <h2 className="font-bold text-sm">EXPERIENCE</h2>
              </div>
              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="font-medium text-xs">{exp.company}</div>
                        <div className="text-xs">{exp.position}</div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>{exp.location}</div>
                        <div>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">Company Description</div>
                    <ul className="text-xs space-y-1">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <div className="flex items-center mb-3" style={{ color: colors.primary }}>
                <GraduationCap className="w-4 h-4 mr-2" />
                <h2 className="font-bold text-sm">EDUCATION</h2>
              </div>
              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <div className="font-medium text-xs">{edu.school}</div>
                      <div className="text-xs">{edu.degree}</div>
                    </div>
                    <div className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <div className="flex items-center mb-3" style={{ color: colors.primary }}>
                  <Globe className="w-4 h-4 mr-2" />
                  <h2 className="font-bold text-sm">LANGUAGES</h2>
                </div>
                <div className="space-y-2">
                  {resumeData.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center">
                      <span className="text-xs">{lang.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs mr-2">{lang.level}</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div key={dot} className="w-2 h-2 rounded-full" 
                                 style={{ backgroundColor: dot <= 3 ? colors.primary : '#E5E7EB' }}></div>
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

  // Navy Header Professional Template
  if (template === 'navy-header-professional') {
    return (
      <div id="resume-preview" className="a4-page bg-white" style={{ fontFamily }}>
        {/* Navy Header */}
        <div className="p-6" style={{ backgroundColor: colors.sidebar }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <div className="text-lg mb-4" style={{ color: colors.accent }}>
                {resumeData.personalInfo.title || 'The role you are applying for?'}
              </div>
              <div className="flex items-center space-x-4 text-sm" style={{ color: colors.text }}>
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  <span>Phone</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  <span>Email</span>
                </div>
                <div className="flex items-center">
                  <Linkedin className="w-3 h-3 mr-1" />
                  <span>LinkedIn/Portfolio</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>Location</span>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {resumeData.personalInfo.photo ? (
                <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex p-6">
          {/* Left Column */}
          <div className="w-2/3 pr-6">
            {/* Summary */}
            <div className="mb-6">
              <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                SUMMARY
              </h2>
              <p className="text-xs leading-relaxed">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="font-medium text-xs">{exp.position}</div>
                    <div className="text-xs mb-1" style={{ color: colors.accent }}>{exp.company}</div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      <Location className="w-3 h-3 ml-3 mr-1" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">Company Description</div>
                    <ul className="text-xs space-y-1">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                EDUCATION
              </h2>
              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-medium text-xs">{edu.degree}</div>
                    <div className="text-xs" style={{ color: colors.accent }}>{edu.school}</div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                  LANGUAGES
                </h2>
                <div className="space-y-2">
                  {resumeData.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center">
                      <span className="text-xs">{lang.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs mr-2">{lang.level}</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div key={dot} className="w-2 h-2 rounded-full" 
                                 style={{ backgroundColor: dot <= 3 ? colors.primary : '#E5E7EB' }}></div>
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
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                KEY ACHIEVEMENTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-3 h-3 mt-1 mr-2" style={{ color: colors.accent }} />
                <div>
                  <div className="font-medium text-xs">Your Achievement</div>
                  <div className="text-xs text-gray-600">Describe what you did and the impact it had.</div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                SKILLS
              </h3>
              <div className="space-y-1">
                {resumeData.skills.slice(0, 8).map((skill) => (
                  <div key={skill.id} className="text-xs">{skill.name}</div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                COURSES
              </h3>
              <div className="text-xs">Course Title</div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-3 h-3 mt-1 mr-2" style={{ color: colors.accent }} />
                <div className="text-xs">Career Interest / Passion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Orange Timeline Modern Template
  if (template === 'orange-timeline-modern') {
    return (
      <div id="resume-preview" className="a4-page bg-white p-6" style={{ fontFamily }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
              {resumeData.personalInfo.name || 'YOUR NAME'}
            </h1>
            <div className="text-lg mb-4" style={{ color: colors.accent }}>
              {resumeData.personalInfo.title || 'The role you are applying for?'}
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <Phone className="w-3 h-3 mr-1" style={{ color: colors.accent }} />
                <span>Phone</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-3 h-3 mr-1" style={{ color: colors.accent }} />
                <span>Email</span>
              </div>
              <div className="flex items-center">
                <Linkedin className="w-3 h-3 mr-1" style={{ color: colors.accent }} />
                <span>LinkedIn/Portfolio</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" style={{ color: colors.accent }} />
                <span>Location</span>
              </div>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {resumeData.personalInfo.photo ? (
              <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
            SUMMARY
          </h2>
          <p className="text-xs leading-relaxed">
            {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
          </p>
        </div>

        {/* Experience with Timeline */}
        <div className="mb-6">
          <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
            EXPERIENCE
          </h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.accent }}></div>
                  {index < resumeData.experience.length - 1 && (
                    <div className="w-0.5 h-16 mt-2" style={{ backgroundColor: colors.accent }}></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-xs">{exp.position}</div>
                    <div className="text-xs text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div className="text-xs mb-1" style={{ color: colors.accent }}>{exp.company}</div>
                  <div className="text-xs text-gray-500 mb-2">{exp.location}</div>
                  <div className="text-xs text-gray-600 mb-2">Company Description</div>
                  <ul className="text-xs space-y-1">
                    {exp.description.map((desc, descIndex) => (
                      <li key={descIndex} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
            EDUCATION
          </h2>
          <div className="space-y-3">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="border rounded p-3" style={{ borderColor: colors.accent, backgroundColor: colors.subtle }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-xs">{edu.degree}</div>
                    <div className="text-xs" style={{ color: colors.accent }}>{edu.school}</div>
                  </div>
                  <div className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
              LANGUAGES
            </h2>
            <div className="space-y-2">
              {resumeData.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="text-xs">{lang.name}</span>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">{lang.level}</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div key={dot} className="w-2 h-2 rounded-full" 
                             style={{ backgroundColor: dot <= 3 ? colors.accent : '#E5E7EB' }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Sections */}
        <div className="grid grid-cols-2 gap-6">
          {/* Key Achievements */}
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: colors.primary }}>
              KEY ACHIEVEMENTS
            </h3>
            <div className="flex items-start">
              <Diamond className="w-3 h-3 mt-1 mr-2" style={{ color: colors.accent }} />
              <div>
                <div className="font-medium text-xs">Your Achievement</div>
                <div className="text-xs text-gray-600">Describe what you did and the impact it had.</div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: colors.primary }}>
              SKILLS
            </h3>
            <div className="space-y-1">
              {resumeData.skills.slice(0, 6).map((skill) => (
                <div key={skill.id} className="text-xs">{skill.name}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Courses and Interests */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: colors.primary }}>
              COURSES
            </h3>
            <div className="text-xs" style={{ color: colors.accent }}>Course Title</div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: colors.primary }}>
              INTERESTS
            </h3>
            <div className="flex items-start">
              <Diamond className="w-3 h-3 mt-1 mr-2" style={{ color: colors.accent }} />
              <div className="text-xs">Career Interest / Passion</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Blue Sidebar Clean Template
  if (template === 'blue-sidebar-clean') {
    return (
      <div id="resume-preview" className="a4-page bg-white" style={{ fontFamily }}>
        <div className="flex h-full">
          {/* Left Main Content */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                  {resumeData.personalInfo.name || 'YOUR NAME'}
                </h1>
                <div className="text-lg mb-4" style={{ color: colors.accent }}>
                  {resumeData.personalInfo.title || 'The role you are applying for?'}
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    <span>Phone</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="w-3 h-3 mr-1" />
                    <span>LinkedIn/Portfolio</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>Location</span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {resumeData.personalInfo.photo ? (
                  <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.text, borderColor: colors.text }}>
                SUMMARY
              </h2>
              <p className="text-xs leading-relaxed">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.text, borderColor: colors.text }}>
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-xs">{exp.position}</div>
                      <div className="text-xs text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs" style={{ color: colors.accent }}>{exp.company}</div>
                      <div className="text-xs text-gray-500">{exp.location}</div>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">Company Description</div>
                    <ul className="text-xs space-y-1">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.text, borderColor: colors.text }}>
                EDUCATION
              </h2>
              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <div className="font-medium text-xs">{edu.degree}</div>
                      <div className="text-xs" style={{ color: colors.accent }}>{edu.school}</div>
                    </div>
                    <div className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.text, borderColor: colors.text }}>
                  LANGUAGES
                </h2>
                <div className="space-y-2">
                  {resumeData.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center">
                      <span className="text-xs">{lang.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs mr-2">{lang.level}</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div key={dot} className="w-2 h-2 rounded-full" 
                                 style={{ backgroundColor: dot <= 3 ? colors.primary : '#E5E7EB' }}></div>
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
          <div className="w-1/3 p-6" style={{ backgroundColor: colors.sidebar }}>
            {/* Key Achievements */}
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                KEY ACHIEVEMENTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-3 h-3 mt-1 mr-2" style={{ color: colors.accent }} />
                <div>
                  <div className="font-medium text-xs">Your Achievement</div>
                  <div className="text-xs text-gray-600">Describe what you did and the impact it had.</div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                SKILLS
              </h3>
              <div className="space-y-1">
                {resumeData.skills.slice(0, 8).map((skill) => (
                  <div key={skill.id} className="text-xs">{skill.name}</div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                COURSES
              </h3>
              <div className="text-xs">Course Title</div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-3 h-3 mt-1 mr-2" style={{ color: colors.accent }} />
                <div className="text-xs">Career Interest / Passion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Soft Blue Elegant Template
  if (template === 'soft-blue-elegant') {
    return (
      <div id="resume-preview" className="a4-page bg-white p-6" style={{ fontFamily }}>
        {/* Header with flowing design */}
        <div className="relative mb-6">
          {/* Decorative flowing element */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full" 
               style={{ backgroundColor: colors.accent }}></div>
          <div className="absolute top-4 right-8 w-24 h-24 opacity-20 rounded-full" 
               style={{ backgroundColor: colors.primary }}></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
                {resumeData.personalInfo.name || 'Your Name'}
              </h1>
              <div className="text-lg mb-4" style={{ color: colors.accent }}>
                {resumeData.personalInfo.title || 'The role you are applying for?'}
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  <span>Phone</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  <span>Email</span>
                </div>
                <div className="flex items-center">
                  <Linkedin className="w-3 h-3 mr-1" />
                  <span>LinkedIn/Portfolio</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>Location</span>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {resumeData.personalInfo.photo ? (
                <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Sidebar */}
          <div className="space-y-6">
            {/* Key Achievements */}
            <div>
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                KEY ACHIEVEMENTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-3 h-3 mt-1 mr-2" style={{ color: colors.accent }} />
                <div>
                  <div className="font-medium text-xs">Your Achievement</div>
                  <div className="text-xs text-gray-600">Describe what you did and the impact it had.</div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                SKILLS
              </h3>
              <div className="space-y-1">
                {resumeData.skills.slice(0, 6).map((skill) => (
                  <div key={skill.id} className="text-xs">{skill.name}</div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div>
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                COURSES
              </h3>
              <div className="text-xs" style={{ color: colors.accent }}>Course Title</div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-3 h-3 mt-1 mr-2" style={{ color: colors.accent }} />
                <div className="text-xs">Career Interest / Passion</div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Summary */}
            <div>
              <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                SUMMARY
              </h2>
              <p className="text-xs leading-relaxed">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div>
              <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="font-medium text-xs">{exp.position}</div>
                    <div className="text-xs mb-1" style={{ color: colors.accent }}>{exp.company}</div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      <Location className="w-3 h-3 ml-3 mr-1" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">Company Description</div>
                    <ul className="text-xs space-y-1">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                EDUCATION
              </h2>
              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <div className="font-medium text-xs">{edu.degree}</div>
                      <div className="text-xs" style={{ color: colors.accent }}>{edu.school}</div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <h2 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
                  LANGUAGES
                </h2>
                <div className="space-y-2">
                  {resumeData.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center">
                      <span className="text-xs">{lang.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs mr-2">{lang.level}</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div key={dot} className="w-2 h-2 rounded-full" 
                                 style={{ backgroundColor: dot <= 3 ? colors.accent : '#E5E7EB' }}></div>
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

  // Default fallback for existing templates
  return (
    <div id="resume-preview" className="a4-page bg-white p-6" style={{ fontFamily }}>
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
          {resumeData.personalInfo.name}
        </h1>
        <p className="text-lg mb-4" style={{ color: colors.secondary }}>
          {resumeData.personalInfo.title}
        </p>
        <div className="text-sm mb-6">
          {resumeData.personalInfo.email} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.location}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Summary</h2>
        <p className="text-sm">{resumeData.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Experience</h2>
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
        <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Education</h2>
        {resumeData.education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <h3 className="font-semibold">{edu.degree}</h3>
            <p className="text-sm" style={{ color: colors.secondary }}>{edu.school} • {edu.location}</p>
            <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Skills</h2>
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