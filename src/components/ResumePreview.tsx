import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar } from 'lucide-react';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
  customColors: any;
  font: string;
  sectionOrder: string[];
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  template,
  customColors,
  font,
  sectionOrder
}) => {
  const fontFamily = font === 'Inter' ? 'Inter, sans-serif' : 
                     font === 'Roboto' ? 'Roboto, sans-serif' :
                     font === 'Open Sans' ? 'Open Sans, sans-serif' :
                     font === 'Lato' ? 'Lato, sans-serif' :
                     font === 'Playfair Display' ? 'Playfair Display, serif' :
                     font === 'Merriweather' ? 'Merriweather, serif' :
                     'Inter, sans-serif';

  const renderHeader = () => (
    <div className="mb-8">
      <h1 
        className="text-3xl font-bold mb-2"
        style={{ color: customColors.primary, fontFamily }}
      >
        {resumeData.personalInfo.name}
      </h1>
      <h2 
        className="text-xl mb-4"
        style={{ color: customColors.secondary, fontFamily }}
      >
        {resumeData.personalInfo.title}
      </h2>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-1" />
          {resumeData.personalInfo.email}
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-1" />
          {resumeData.personalInfo.phone}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {resumeData.personalInfo.location}
        </div>
        {resumeData.personalInfo.website && (
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-1" />
            {resumeData.personalInfo.website}
          </div>
        )}
        {resumeData.personalInfo.linkedin && (
          <div className="flex items-center">
            <Linkedin className="w-4 h-4 mr-1" />
            {resumeData.personalInfo.linkedin}
          </div>
        )}
      </div>
    </div>
  );

  const renderSectionTitle = (title: string) => (
    <h3 
      className="text-lg font-semibold mb-3 pb-1 border-b-2"
      style={{ 
        color: customColors.primary,
        borderColor: customColors.accent,
        fontFamily 
      }}
    >
      {title.toUpperCase()}
    </h3>
  );

  const renderSummary = () => (
    <div className="mb-6">
      {renderSectionTitle('Professional Summary')}
      <p className="text-gray-700 leading-relaxed" style={{ fontFamily }}>
        {resumeData.summary}
      </p>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6">
      {renderSectionTitle('Work Experience')}
      <div className="space-y-4">
        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: customColors.accent }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900" style={{ fontFamily }}>
                  {exp.position}
                </h4>
                <p 
                  className="font-medium"
                  style={{ color: customColors.secondary, fontFamily }}
                >
                  {exp.company}
                </p>
                <p className="text-sm text-gray-600" style={{ fontFamily }}>
                  {exp.location}
                </p>
              </div>
              <div className="text-sm text-gray-500 flex items-center" style={{ fontFamily }}>
                <Calendar className="w-4 h-4 mr-1" />
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </div>
            </div>
            <ul className="text-gray-700 space-y-1" style={{ fontFamily }}>
              {exp.description.map((desc, index) => (
                <li key={index} className="flex items-start">
                  <span 
                    className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: customColors.accent }}
                  />
                  {desc}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="mb-6">
      {renderSectionTitle('Education')}
      <div className="space-y-3">
        {resumeData.education.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900" style={{ fontFamily }}>
                  {edu.degree}
                </h4>
                <p 
                  className="font-medium"
                  style={{ color: customColors.secondary, fontFamily }}
                >
                  {edu.school}
                </p>
                <p className="text-sm text-gray-600" style={{ fontFamily }}>
                  {edu.location}
                </p>
              </div>
              <div className="text-sm text-gray-500 flex items-center" style={{ fontFamily }}>
                <Calendar className="w-4 h-4 mr-1" />
                {edu.startDate} - {edu.endDate}
              </div>
            </div>
            {edu.gpa && (
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily }}>
                GPA: {edu.gpa}
              </p>
            )}
            {edu.description && (
              <p className="text-sm text-gray-700 mt-1" style={{ fontFamily }}>
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="mb-6">
      {renderSectionTitle('Skills')}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {resumeData.skills.map((skill) => (
          <div
            key={skill.id}
            className="px-3 py-2 rounded-lg text-sm font-medium"
            style={{ 
              backgroundColor: customColors.accent + '20',
              color: customColors.text,
              fontFamily 
            }}
          >
            <div className="font-semibold">{skill.name}</div>
            {skill.level && (
              <div className="text-xs opacity-80">{skill.level}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="mb-6">
      {renderSectionTitle('Certifications')}
      <div className="space-y-2">
        {resumeData.certifications.map((cert) => (
          <div key={cert.id} className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-900" style={{ fontFamily }}>
                {cert.name}
              </h4>
              <p 
                className="text-sm"
                style={{ color: customColors.secondary, fontFamily }}
              >
                {cert.issuer}
              </p>
            </div>
            <div className="text-sm text-gray-500" style={{ fontFamily }}>
              {cert.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const sectionRenderers = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    certifications: renderCertifications
  };

  return (
    <div 
      id="resume-preview"
      className="bg-white p-8 min-h-[11in] w-full"
      style={{ 
        fontFamily,
        fontSize: '14px',
        lineHeight: '1.5',
        color: customColors.text || '#1F2937'
      }}
    >
      {renderHeader()}
      {sectionOrder.map((section) => (
        <div key={section}>
          {sectionRenderers[section as keyof typeof sectionRenderers]?.()}
        </div>
      ))}
      
      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400" style={{ fontFamily }}>
          Generated with LinkedIn Resume Generator
        </p>
      </div>
    </div>
  );
};