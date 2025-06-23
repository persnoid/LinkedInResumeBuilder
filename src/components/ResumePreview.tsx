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

  // Merge template colors with custom colors - custom colors take precedence
  const colors = { ...templateConfig.colors, ...customColors };
  
  console.log('ResumePreview - Template colors:', templateConfig.colors);
  console.log('ResumePreview - Custom colors:', customColors);
  console.log('ResumePreview - Final colors:', colors);
  
  const fontFamily = font === 'Inter' ? 'Inter, sans-serif' : 
                    font === 'Roboto' ? 'Roboto, sans-serif' :
                    font === 'Open Sans' ? 'Open Sans, sans-serif' :
                    font === 'Lato' ? 'Lato, sans-serif' :
                    font === 'Playfair Display' ? 'Playfair Display, serif' :
                    font === 'Merriweather' ? 'Merriweather, serif' : 'Inter, sans-serif';

  // Soft Blue Elegant Template - EXACT MATCH to your image
  if (template === 'soft-blue-elegant') {
    return (
      <div id="resume-preview" className="a4-page bg-white p-8" style={{ fontFamily }}>
        {/* Header with Name and Photo */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3 text-gray-400 uppercase tracking-wide">
              {resumeData.personalInfo.name || 'YOUR NAME'}
            </h1>
            <div className="text-lg mb-6" style={{ color: colors.accent }}>
              {resumeData.personalInfo.title || 'The role you are applying for?'}
            </div>
            
            {/* Contact Info */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>{resumeData.personalInfo.phone || 'Phone'}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>{resumeData.personalInfo.email || 'Email'}</span>
              </div>
              <div className="flex items-center">
                <Linkedin className="w-4 h-4 mr-2" />
                <span>{resumeData.personalInfo.linkedin || 'LinkedIn/Portfolio'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{resumeData.personalInfo.location || 'Location'}</span>
              </div>
            </div>
          </div>
          
          {/* Profile Photo - Top Right */}
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-gray-300 ml-8">
            {resumeData.personalInfo.photo ? (
              <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Summary and Experience */}
          <div className="col-span-7 space-y-8">
            {/* Summary */}
            <div>
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                SUMMARY
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div>
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="mb-2">
                      <div className="font-bold text-base text-gray-800">{exp.position || 'Title'}</div>
                      <div className="text-sm mb-1" style={{ color: colors.accent }}>{exp.company || 'Company Name'}</div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{exp.startDate || 'Date period'} - {exp.current ? 'Present' : exp.endDate || 'Date period'}</span>
                        <Location className="w-4 h-4 ml-4 mr-2" />
                        <span>{exp.location || 'Location'}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Company Description</div>
                    <ul className="text-sm space-y-1 text-gray-700">
                      {exp.description && exp.description.length > 0 ? exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-3 mt-1">•</span>
                          <span>{desc}</span>
                        </li>
                      )) : (
                        <li className="flex items-start">
                          <span className="mr-3 mt-1">•</span>
                          <span>Highlight your accomplishments, using numbers if possible.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )) : (
                  <div>
                    <div className="mb-2">
                      <div className="font-bold text-base text-gray-800">Title</div>
                      <div className="text-sm mb-1" style={{ color: colors.accent }}>Company Name</div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Date period</span>
                        <Location className="w-4 h-4 ml-4 mr-2" />
                        <span>Location</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Company Description</div>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1">•</span>
                        <span>Highlight your accomplishments, using numbers if possible.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                EDUCATION
              </h2>
              <div className="space-y-4">
                {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-base text-gray-800">{edu.degree || 'Degree and Field of Study'}</div>
                    <div className="text-sm mb-1" style={{ color: colors.accent }}>{edu.school || 'School or University'}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{edu.startDate || 'Date period'} - {edu.endDate || 'Date period'}</span>
                    </div>
                  </div>
                )) : (
                  <div>
                    <div className="font-bold text-base text-gray-800">Degree and Field of Study</div>
                    <div className="text-sm mb-1" style={{ color: colors.accent }}>School or University</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Date period</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                LANGUAGES
              </h2>
              <div className="space-y-3">
                {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">{lang.name}</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-3 text-gray-600">{lang.level || 'Beginner'}</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div key={dot} className="w-3 h-3 rounded-full" 
                               style={{ backgroundColor: dot <= 2 ? colors.primary : '#E5E7EB' }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">Language</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-3 text-gray-600">Beginner</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div key={dot} className="w-3 h-3 rounded-full" 
                               style={{ backgroundColor: dot <= 2 ? colors.primary : '#E5E7EB' }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Key Achievements, Skills, Courses, Interests */}
          <div className="col-span-5 space-y-8">
            {/* Key Achievements */}
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                KEY ACHIEVEMENTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-4 h-4 mt-1 mr-3 flex-shrink-0" style={{ color: colors.accent }} />
                <div>
                  <div className="font-semibold text-sm text-gray-800">Your Achievement</div>
                  <div className="text-xs text-gray-600 leading-relaxed">Describe what you did and the impact it had.</div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                SKILLS
              </h3>
              <div className="space-y-2">
                {resumeData.skills.length > 0 ? resumeData.skills.slice(0, 10).map((skill) => (
                  <div key={skill.id} className="text-sm text-gray-700">{skill.name}</div>
                )) : (
                  <div className="text-sm text-gray-700">Your Skill</div>
                )}
              </div>
            </div>

            {/* Courses */}
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                COURSES
              </h3>
              <div className="text-sm text-gray-700">Course Title</div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-4 h-4 mt-1 mr-3 flex-shrink-0" style={{ color: colors.accent }} />
                <div className="text-sm text-gray-700">Career Interest / Passion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ivy League Classic Template - EXACT MATCH to your image
  if (template === 'ivy-league-classic') {
    return (
      <div id="resume-preview" className="a4-page bg-white p-8" style={{ fontFamily }}>
        {/* Header with photo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-gray-300">
            {resumeData.personalInfo.photo ? (
              <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide" style={{ color: colors.primary }}>
            {resumeData.personalInfo.name || 'YOUR NAME'}
          </h1>
          
          <div className="text-lg mb-4" style={{ color: colors.secondary }}>
            {resumeData.personalInfo.title || 'The role you are applying for?'}
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <span>{resumeData.personalInfo.phone || 'Phone'}</span>
              <span className="mx-2">•</span>
            </div>
            <div className="flex items-center">
              <span>{resumeData.personalInfo.email || 'Email'}</span>
              <span className="mx-2">•</span>
            </div>
            <div className="flex items-center">
              <span>{resumeData.personalInfo.linkedin || 'LinkedIn/Portfolio'}</span>
              <span className="mx-2">•</span>
            </div>
            <div className="flex items-center">
              <span>{resumeData.personalInfo.location || 'Location'}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 text-center uppercase tracking-wide" 
              style={{ color: colors.primary, borderColor: colors.primary }}>
            Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 text-center">
            {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
          </p>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 text-center uppercase tracking-wide" 
              style={{ color: colors.primary, borderColor: colors.primary }}>
            Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
              <div key={exp.id} className="text-center">
                <div className="mb-2">
                  <div className="font-bold text-base text-gray-800">{exp.company || 'Company Name'}</div>
                  <div className="text-sm text-gray-600">{exp.position || 'Title'}</div>
                  <div className="text-sm text-gray-500">{exp.location || 'Location'}</div>
                  <div className="text-sm text-gray-500">{exp.startDate || 'Date period'} - {exp.current ? 'Present' : exp.endDate || 'Date period'}</div>
                </div>
                <div className="text-sm text-gray-600 mb-3">Company Description</div>
                <ul className="text-sm space-y-1 text-gray-700">
                  {exp.description && exp.description.length > 0 ? exp.description.map((desc, index) => (
                    <li key={index} className="flex items-start justify-center">
                      <span className="mr-3 mt-1">•</span>
                      <span>{desc}</span>
                    </li>
                  )) : (
                    <li className="flex items-start justify-center">
                      <span className="mr-3 mt-1">•</span>
                      <span>Highlight your accomplishments, using numbers if possible.</span>
                    </li>
                  )}
                </ul>
              </div>
            )) : (
              <div className="text-center">
                <div className="mb-2">
                  <div className="font-bold text-base text-gray-800">Company Name</div>
                  <div className="text-sm text-gray-600">Title</div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="text-sm text-gray-500">Date period</div>
                </div>
                <div className="text-sm text-gray-600 mb-3">Company Description</div>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li className="flex items-start justify-center">
                    <span className="mr-3 mt-1">•</span>
                    <span>Highlight your accomplishments, using numbers if possible.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 text-center uppercase tracking-wide" 
              style={{ color: colors.primary, borderColor: colors.primary }}>
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
              <div key={edu.id} className="text-center">
                <div className="font-bold text-base text-gray-800">{edu.school || 'School or University'}</div>
                <div className="text-sm text-gray-600">{edu.degree || 'Degree and Field of Study'}</div>
                <div className="text-sm text-gray-500">{edu.startDate || 'Date period'} - {edu.endDate || 'Date period'}</div>
              </div>
            )) : (
              <div className="text-center">
                <div className="font-bold text-base text-gray-800">School or University</div>
                <div className="text-sm text-gray-600">Degree and Field of Study</div>
                <div className="text-sm text-gray-500">Date period</div>
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 text-center uppercase tracking-wide" 
              style={{ color: colors.primary, borderColor: colors.primary }}>
            Languages
          </h2>
          <div className="space-y-3">
            {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((lang) => (
              <div key={lang.id} className="flex justify-center items-center">
                <span className="text-sm font-medium text-gray-800 mr-8">{lang.name}</span>
                <div className="flex items-center">
                  <span className="text-sm mr-3 text-gray-600">{lang.level || 'Beginner'}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div key={dot} className="w-3 h-3 rounded-full" 
                           style={{ backgroundColor: dot <= 2 ? colors.primary : '#E5E7EB' }}></div>
                    ))}
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex justify-center items-center">
                <span className="text-sm font-medium text-gray-800 mr-8">Language</span>
                <div className="flex items-center">
                  <span className="text-sm mr-3 text-gray-600">Beginner</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div key={dot} className="w-3 h-3 rounded-full" 
                           style={{ backgroundColor: dot <= 2 ? colors.primary : '#E5E7EB' }}></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Achievements */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 text-center uppercase tracking-wide" 
              style={{ color: colors.primary, borderColor: colors.primary }}>
            Key Achievements
          </h2>
          <div className="flex items-start justify-center">
            <Diamond className="w-4 h-4 mt-1 mr-3 flex-shrink-0" style={{ color: colors.accent }} />
            <div className="text-center">
              <div className="font-semibold text-sm text-gray-800">Your Achievement</div>
              <div className="text-xs text-gray-600 leading-relaxed">Describe what you did and the impact it had.</div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 text-center uppercase tracking-wide" 
              style={{ color: colors.primary, borderColor: colors.primary }}>
            Skills
          </h2>
          <div className="text-center">
            {resumeData.skills.length > 0 ? (
              <div className="text-sm text-gray-700">
                {resumeData.skills.slice(0, 8).map(skill => skill.name).join(' • ')}
              </div>
            ) : (
              <div className="text-sm text-gray-700">Your Skill</div>
            )}
          </div>
        </div>

        {/* Courses */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 text-center uppercase tracking-wide" 
              style={{ color: colors.primary, borderColor: colors.primary }}>
            Courses
          </h2>
          <div className="text-center text-sm text-gray-700">Course Title</div>
        </div>

        {/* Interests */}
        <div>
          <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 text-center uppercase tracking-wide" 
              style={{ color: colors.primary, borderColor: colors.primary }}>
            Interests
          </h2>
          <div className="flex items-start justify-center">
            <Diamond className="w-4 h-4 mt-1 mr-3 flex-shrink-0" style={{ color: colors.accent }} />
            <div className="text-sm text-gray-700">Career Interest / Passion</div>
          </div>
        </div>
      </div>
    );
  }

  // Green Organic Sidebar Template - EXACT MATCH
  if (template === 'green-organic-sidebar') {
    return (
      <div id="resume-preview" className="a4-page bg-white" style={{ fontFamily }}>
        <div className="flex h-full">
          {/* Left Sidebar - Exact match to image */}
          <div className="w-1/3 p-8 relative" style={{ backgroundColor: colors.sidebar || '#F0FDF4' }}>
            {/* Organic shape decorations - exact positioning */}
            <div className="absolute top-8 left-6 w-24 h-24 rounded-full opacity-40" 
                 style={{ backgroundColor: colors.accent }}></div>
            <div className="absolute top-12 left-10 w-16 h-16 rounded-full opacity-30" 
                 style={{ backgroundColor: colors.primary }}></div>
            <div className="absolute top-16 left-14 w-12 h-12 rounded-full opacity-20" 
                 style={{ backgroundColor: colors.secondary }}></div>
            
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
              <div className="flex items-center mb-4" style={{ color: colors.primary }}>
                <Mail className="w-5 h-5 mr-3" />
                <h3 className="font-bold text-base uppercase tracking-wide">CONTACTS</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex items-center mb-1" style={{ color: colors.primary }}>
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-medium">Phone</span>
                  </div>
                  <div className="text-gray-700 ml-6">{resumeData.personalInfo.phone}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1" style={{ color: colors.primary }}>
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="font-medium">Email</span>
                  </div>
                  <div className="text-gray-700 ml-6 break-all">{resumeData.personalInfo.email}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1" style={{ color: colors.primary }}>
                    <Linkedin className="w-4 h-4 mr-2" />
                    <span className="font-medium">LinkedIn/Portfolio</span>
                  </div>
                  <div className="text-gray-700 ml-6 break-all">{resumeData.personalInfo.linkedin}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1" style={{ color: colors.primary }}>
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-medium">Location</span>
                  </div>
                  <div className="text-gray-700 ml-6">{resumeData.personalInfo.location}</div>
                </div>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center mb-4" style={{ color: colors.primary }}>
                <Diamond className="w-5 h-5 mr-3" />
                <h3 className="font-bold text-base uppercase tracking-wide">KEY ACHIEVEMENTS</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0" style={{ backgroundColor: colors.accent }}></div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Your Achievement</div>
                    <div className="text-xs text-gray-600 leading-relaxed">Describe what you did and the impact it had.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center mb-4" style={{ color: colors.primary }}>
                <div className="w-5 h-5 mr-3 rounded flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
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
              <div className="flex items-center mb-4" style={{ color: colors.primary }}>
                <GraduationCap className="w-5 h-5 mr-3" />
                <h3 className="font-bold text-base uppercase tracking-wide">COURSES</h3>
              </div>
              <div className="text-sm text-gray-700">Course Title</div>
            </div>

            {/* Interests */}
            <div className="relative z-10">
              <div className="flex items-center mb-4" style={{ color: colors.primary }}>
                <div className="w-5 h-5 mr-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <h3 className="font-bold text-base uppercase tracking-wide">INTERESTS</h3>
              </div>
              <div className="flex items-start">
                <div className="w-3 h-3 rounded-full mt-1 mr-3 flex-shrink-0" style={{ backgroundColor: colors.accent }}></div>
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
                   style={{ backgroundColor: colors.highlight || '#DCFCE7', color: colors.primary }}>
                {resumeData.personalInfo.title || 'THE ROLE YOU ARE APPLYING FOR?'}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <div className="flex items-center mb-4" style={{ color: colors.primary }}>
                <User className="w-5 h-5 mr-3" />
                <h2 className="font-bold text-lg uppercase tracking-wide">SUMMARY</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <div className="flex items-center mb-4" style={{ color: colors.primary }}>
                <div className="w-5 h-5 mr-3 rounded flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
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
                          <span className="mr-3 mt-1" style={{ color: colors.primary }}>•</span>
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
              <div className="flex items-center mb-4" style={{ color: colors.primary }}>
                <GraduationCap className="w-5 h-5 mr-3" />
                <h2 className="font-bold text-lg uppercase tracking-wide">EDUCATION</h2>
              </div>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="border rounded-lg p-4" 
                       style={{ borderColor: colors.highlight || '#D1FAE5', backgroundColor: colors.sidebar || '#F0FDF4' }}>
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
                <div className="flex items-center mb-4" style={{ color: colors.primary }}>
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

  // Navy Header Professional Template - EXACT MATCH
  if (template === 'navy-header-professional') {
    return (
      <div id="resume-preview" className="a4-page bg-white" style={{ fontFamily }}>
        {/* Navy Header */}
        <div className="p-8" style={{ backgroundColor: colors.sidebar || '#1E293B' }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-3" style={{ color: colors.text || '#FFFFFF' }}>
                {resumeData.personalInfo.name || 'YOUR NAME'}
              </h1>
              <div className="text-xl mb-6" style={{ color: colors.accent }}>
                {resumeData.personalInfo.title || 'The role you are applying for?'}
              </div>
              <div className="flex items-center space-x-6 text-sm" style={{ color: '#E2E8F0' }}>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{resumeData.personalInfo.phone || 'Phone'}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{resumeData.personalInfo.email || 'Email'}</span>
                </div>
                <div className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-2" />
                  <span>{resumeData.personalInfo.linkedin || 'LinkedIn/Portfolio'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{resumeData.personalInfo.location || 'Location'}</span>
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
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                SUMMARY
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {resumeData.summary || 'Briefly explain why you\'re a great fit for the role - use the AI assistant to tailor this summary for each job posting.'}
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="font-bold text-base text-gray-800">{exp.position}</div>
                    <div className="text-sm mb-2" style={{ color: colors.accent }}>{exp.company}</div>
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
                          <span className="mr-3 mt-1" style={{ color: colors.accent }}>•</span>
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
              <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                EDUCATION
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-base text-gray-800">{edu.degree}</div>
                    <div className="text-sm" style={{ color: colors.accent }}>{edu.school}</div>
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
                <h2 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                    style={{ color: colors.primary, borderColor: colors.primary }}>
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
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                KEY ACHIEVEMENTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-4 h-4 mt-1 mr-3 flex-shrink-0" style={{ color: colors.accent }} />
                <div>
                  <div className="font-semibold text-sm text-gray-800">Your Achievement</div>
                  <div className="text-xs text-gray-600 leading-relaxed">Describe what you did and the impact it had.</div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
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
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                COURSES
              </h3>
              <div className="text-sm text-gray-700">Course Title</div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 uppercase tracking-wide" 
                  style={{ color: colors.primary, borderColor: colors.primary }}>
                INTERESTS
              </h3>
              <div className="flex items-start">
                <Diamond className="w-4 h-4 mt-1 mr-3 flex-shrink-0" style={{ color: colors.accent }} />
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