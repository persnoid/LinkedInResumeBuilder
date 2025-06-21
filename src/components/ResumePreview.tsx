import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar } from 'lucide-react';

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

  // Modern Sidebar Layout (Double Column)
  if (template === 'modern-sidebar') {
    return (
      <div 
        id="resume-preview" 
        className="w-full max-w-4xl mx-auto bg-white shadow-lg"
        style={{ fontFamily, minHeight: '11in', aspectRatio: '8.5/11' }}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div 
            className="w-1/3 p-6 text-white"
            style={{ backgroundColor: colors.sidebar || '#1E293B' }}
          >
            {/* Profile Photo */}
            {resumeData.personalInfo.photo && (
              <div className="mb-6 text-center">
                <img 
                  src={resumeData.personalInfo.photo} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white"
                />
              </div>
            )}

            {/* Contact Info */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4 text-white">CONTACT</h3>
              <div className="space-y-3 text-sm">
                {resumeData.personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="break-all">{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
                {resumeData.personalInfo.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="break-all">{resumeData.personalInfo.website}</span>
                  </div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="break-all">{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4 text-white">SKILLS</h3>
              <div className="space-y-3">
                {resumeData.skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="text-xs opacity-75">{skill.level}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: colors.accent,
                          width: skill.level === 'Expert' ? '100%' : 
                                 skill.level === 'Advanced' ? '80%' : 
                                 skill.level === 'Intermediate' ? '60%' : '40%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-4 text-white">LANGUAGES</h3>
                <div className="space-y-2">
                  {resumeData.languages.map((language) => (
                    <div key={language.id} className="flex justify-between text-sm">
                      <span>{language.name}</span>
                      <span className="text-xs opacity-75">{language.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 
                className="text-3xl font-bold mb-2"
                style={{ color: colors.primary }}
              >
                {resumeData.personalInfo.name}
              </h1>
              <h2 
                className="text-xl mb-4"
                style={{ color: colors.secondary }}
              >
                {resumeData.personalInfo.title}
              </h2>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div className="mb-6">
                <h3 
                  className="text-lg font-bold mb-3 pb-2 border-b-2"
                  style={{ color: colors.primary, borderColor: colors.accent }}
                >
                  PROFESSIONAL SUMMARY
                </h3>
                <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Experience */}
            <div className="mb-6">
              <h3 
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                EXPERIENCE
              </h3>
              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                        <p style={{ color: colors.secondary }} className="font-medium">{exp.company}</p>
                        {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    <ul className="text-gray-700 space-y-1">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-gray-400 mr-2 mt-1">•</span>
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
              <h3 
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                EDUCATION
              </h3>
              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p style={{ color: colors.secondary }} className="font-medium">{edu.school}</p>
                        {edu.location && <p className="text-sm text-gray-500">{edu.location}</p>}
                      </div>
                      <div className="text-sm text-gray-500">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
              <div>
                <h3 
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{ color: colors.primary, borderColor: colors.accent }}
                >
                  CERTIFICATIONS
                </h3>
                <div className="space-y-2">
                  {resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                        <p style={{ color: colors.secondary }}>{cert.issuer}</p>
                      </div>
                      <div className="text-sm text-gray-500">{cert.date}</div>
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

  // Classic Centered Layout (Ivy League)
  if (template === 'classic-centered') {
    return (
      <div 
        id="resume-preview" 
        className="w-full max-w-4xl mx-auto bg-white shadow-lg p-8"
        style={{ fontFamily, minHeight: '11in', aspectRatio: '8.5/11' }}
      >
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: colors.primary }}>
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            {resumeData.personalInfo.name}
          </h1>
          <h2 
            className="text-xl mb-4"
            style={{ color: colors.secondary }}
          >
            {resumeData.personalInfo.title}
          </h2>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.phone && <span>•</span>}
            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.location && <span>•</span>}
            {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-8 text-center">
            <h3 
              className="text-lg font-bold mb-4"
              style={{ color: colors.primary }}
            >
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">{resumeData.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div className="mb-8">
          <h3 
            className="text-lg font-bold mb-6 text-center"
            style={{ color: colors.primary }}
          >
            EXPERIENCE
          </h3>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="text-center">
                <h4 className="font-bold text-gray-900 text-lg">{exp.position}</h4>
                <p style={{ color: colors.secondary }} className="font-semibold text-lg">{exp.company}</p>
                <p className="text-sm text-gray-500 mb-3">
                  {exp.location && `${exp.location} | `}
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <div className="text-gray-700 space-y-2 max-w-3xl mx-auto">
                  {exp.description.map((desc, i) => (
                    <p key={i} className="text-sm leading-relaxed">{desc}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h3 
            className="text-lg font-bold mb-6 text-center"
            style={{ color: colors.primary }}
          >
            EDUCATION
          </h3>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="text-center">
                <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                <p style={{ color: colors.secondary }} className="font-semibold">{edu.school}</p>
                <p className="text-sm text-gray-500">
                  {edu.location && `${edu.location} | `}
                  {edu.startDate} - {edu.endDate}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </p>
                {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h3 
            className="text-lg font-bold mb-4 text-center"
            style={{ color: colors.primary }}
          >
            SKILLS
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {resumeData.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: colors.accent + '20', 
                  color: colors.text,
                  border: `1px solid ${colors.accent}`
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <div>
            <h3 
              className="text-lg font-bold mb-4 text-center"
              style={{ color: colors.primary }}
            >
              CERTIFICATIONS
            </h3>
            <div className="space-y-3">
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="text-center">
                  <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                  <p style={{ color: colors.secondary }}>{cert.issuer} | {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Creative Grid Layout
  if (template === 'creative-grid') {
    return (
      <div 
        id="resume-preview" 
        className="w-full max-w-4xl mx-auto bg-white shadow-lg p-6"
        style={{ fontFamily, minHeight: '11in', aspectRatio: '8.5/11' }}
      >
        <div className="grid grid-cols-3 gap-6 h-full">
          {/* Left Column - Header & Contact */}
          <div className="col-span-2 space-y-6">
            {/* Header Block */}
            <div 
              className="p-6 rounded-lg text-white"
              style={{ backgroundColor: colors.primary }}
            >
              <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.name}</h1>
              <h2 className="text-xl opacity-90">{resumeData.personalInfo.title}</h2>
            </div>

            {/* Summary Block */}
            {resumeData.summary && (
              <div 
                className="p-6 rounded-lg"
                style={{ backgroundColor: colors.highlight || '#FEF3C7' }}
              >
                <h3 
                  className="text-lg font-bold mb-3"
                  style={{ color: colors.primary }}
                >
                  ABOUT ME
                </h3>
                <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Experience Block */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 
                className="text-lg font-bold mb-4"
                style={{ color: colors.primary }}
              >
                EXPERIENCE
              </h3>
              <div className="space-y-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                        <p style={{ color: colors.secondary }} className="font-medium">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      {exp.description.slice(0, 2).map((desc, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio/Projects Block */}
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: colors.accent + '20' }}
            >
              <h3 
                className="text-lg font-bold mb-4"
                style={{ color: colors.secondary }}
              >
                PORTFOLIO HIGHLIGHTS
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: colors.accent }}
                >
                  Project 1
                </div>
                <div className="h-16 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-semibold">
                  Project 2
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Skills & Info */}
          <div className="space-y-6">
            {/* Contact Block */}
            <div 
              className="p-4 rounded-lg text-white"
              style={{ backgroundColor: colors.accent }}
            >
              <h3 className="text-lg font-bold mb-3">CONTACT</h3>
              <div className="space-y-2 text-sm">
                {resumeData.personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="break-all">{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Block */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: colors.primary }}
              >
                SKILLS
              </h3>
              <div className="space-y-3">
                {resumeData.skills.slice(0, 6).map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: colors.accent,
                          width: skill.level === 'Expert' ? '100%' : 
                                 skill.level === 'Advanced' ? '80%' : 
                                 skill.level === 'Intermediate' ? '60%' : '40%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Block */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 
                className="text-lg font-bold mb-3"
                style={{ color: colors.primary }}
              >
                EDUCATION
              </h3>
              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="font-semibold text-sm text-gray-900">{edu.degree}</h4>
                    <p className="text-xs" style={{ color: colors.secondary }}>{edu.school}</p>
                    <p className="text-xs text-gray-500">{edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards Block */}
            <div 
              className="p-4 rounded-lg text-white"
              style={{ backgroundColor: colors.secondary }}
            >
              <h3 className="text-lg font-bold mb-3">ACHIEVEMENTS</h3>
              <div className="space-y-2">
                {resumeData.certifications.slice(0, 2).map((cert) => (
                  <div key={cert.id}>
                    <h4 className="font-semibold text-sm">{cert.name}</h4>
                    <p className="text-xs opacity-90">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Timeline Layout
  if (template === 'timeline-visual') {
    return (
      <div 
        id="resume-preview" 
        className="w-full max-w-4xl mx-auto bg-white shadow-lg p-8"
        style={{ fontFamily, minHeight: '11in', aspectRatio: '8.5/11' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            {resumeData.personalInfo.name}
          </h1>
          <h2 
            className="text-xl mb-4"
            style={{ color: colors.secondary }}
          >
            {resumeData.personalInfo.title}
          </h2>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.phone && <span>•</span>}
            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.location && <span>•</span>}
            {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-8 text-center">
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">{resumeData.summary}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="relative mb-8">
          <h3 
            className="text-2xl font-bold mb-8 text-center"
            style={{ color: colors.primary }}
          >
            CAREER TIMELINE
          </h3>
          
          {/* Timeline line */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-transparent via-current to-transparent"
            style={{ 
              height: `${resumeData.experience.length * 200}px`,
              color: colors.timeline || '#FEE2E2'
            }}
          ></div>
          
          {/* Timeline items */}
          <div className="space-y-12">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div 
                    className="p-6 rounded-lg shadow-md"
                    style={{ backgroundColor: colors.timeline || '#FEE2E2' }}
                  >
                    <h4 
                      className="font-bold text-lg mb-2"
                      style={{ color: colors.primary }}
                    >
                      {exp.position}
                    </h4>
                    <p 
                      className="font-semibold mb-2"
                      style={{ color: colors.secondary }}
                    >
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {exp.location && `${exp.location} | `}
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      {exp.description.slice(0, 2).map((desc, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Timeline marker */}
                <div className="relative z-10">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {new Date(exp.startDate).getFullYear().toString().slice(-2)}
                  </div>
                </div>
                
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom sections */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          {/* Education */}
          <div>
            <h3 
              className="text-xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              EDUCATION
            </h3>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p style={{ color: colors.secondary }}>{edu.school}</p>
                  <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 
              className="text-xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              SKILLS
            </h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: colors.accent + '20', 
                    color: colors.text,
                    border: `1px solid ${colors.accent}`
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal Spaced Layout
  if (template === 'minimal-space') {
    return (
      <div 
        id="resume-preview" 
        className="w-full max-w-4xl mx-auto bg-white shadow-lg p-12"
        style={{ fontFamily, minHeight: '11in', aspectRatio: '8.5/11' }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-5xl font-light mb-4 tracking-wide"
            style={{ color: colors.primary }}
          >
            {resumeData.personalInfo.name}
          </h1>
          <h2 
            className="text-2xl font-light mb-8 tracking-wide"
            style={{ color: colors.secondary }}
          >
            {resumeData.personalInfo.title}
          </h2>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-16 text-center">
            <p className="text-gray-700 leading-loose text-lg max-w-3xl mx-auto font-light">
              {resumeData.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        <div className="mb-16">
          <h3 
            className="text-2xl font-light mb-12 text-center tracking-wide"
            style={{ color: colors.primary }}
          >
            Experience
          </h3>
          <div className="space-y-12">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="text-center">
                <h4 className="font-medium text-xl text-gray-900 mb-2">{exp.position}</h4>
                <p 
                  className="text-lg mb-2"
                  style={{ color: colors.secondary }}
                >
                  {exp.company}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <div className="max-w-2xl mx-auto">
                  <div 
                    className="w-24 h-px mx-auto mb-6"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <div className="text-gray-700 space-y-3 font-light leading-relaxed">
                    {exp.description.map((desc, i) => (
                      <p key={i}>{desc}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-16">
          <h3 
            className="text-2xl font-light mb-12 text-center tracking-wide"
            style={{ color: colors.primary }}
          >
            Education
          </h3>
          <div className="space-y-8">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="text-center">
                <h4 className="font-medium text-lg text-gray-900">{edu.degree}</h4>
                <p 
                  className="text-lg"
                  style={{ color: colors.secondary }}
                >
                  {edu.school}
                </p>
                <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="text-center">
          <h3 
            className="text-2xl font-light mb-12 tracking-wide"
            style={{ color: colors.primary }}
          >
            Skills
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {resumeData.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-6 py-3 rounded-full text-sm font-light tracking-wide border"
                style={{ 
                  color: colors.text,
                  borderColor: colors.accent
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback (shouldn't happen with our 5 templates)
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