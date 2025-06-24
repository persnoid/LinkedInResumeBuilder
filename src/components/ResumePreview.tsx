import React from 'react';
import { ResumeData } from '../types/resume';
import { resumeTemplates } from '../data/templates';
import { reactiveTemplates } from '../data/reactive-templates';
import { TemplateRenderer } from './template-engine/TemplateRenderer';
import { TemplateContext } from '../types/template';
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
  // Check if this is a reactive template FIRST
  const reactiveTemplate = reactiveTemplates.find(t => t.id === template);
  
  if (reactiveTemplate) {
    // Use the new template engine for reactive templates
    const context: TemplateContext = {
      data: resumeData,
      config: reactiveTemplate,
      customizations: {
        colors: customColors,
        typography: font ? {
          fontFamily: font === 'Inter' ? 'Inter, sans-serif' : 
                      font === 'Roboto' ? 'Roboto, sans-serif' :
                      font === 'Open Sans' ? 'Open Sans, sans-serif' :
                      font === 'Lato' ? 'Lato, sans-serif' :
                      font === 'Playfair Display' ? 'Playfair Display, serif' :
                      font === 'Merriweather' ? 'Merriweather, serif' : 'Inter, sans-serif'
        } : undefined,
      }
    };

    return <TemplateRenderer context={context} />;
  }

  // Fallback to existing template system for legacy templates ONLY
  const templateConfig = resumeTemplates.find(t => t.id === template);
  if (!templateConfig) {
    // If template not found in either system, default to first reactive template
    const defaultTemplate = reactiveTemplates[0];
    const context: TemplateContext = {
      data: resumeData,
      config: defaultTemplate,
      customizations: {
        colors: customColors,
        typography: font ? {
          fontFamily: font === 'Inter' ? 'Inter, sans-serif' : 
                      font === 'Roboto' ? 'Roboto, sans-serif' :
                      font === 'Open Sans' ? 'Open Sans, sans-serif' :
                      font === 'Lato' ? 'Lato, sans-serif' :
                      font === 'Playfair Display' ? 'Playfair Display, serif' :
                      font === 'Merriweather' ? 'Merriweather, serif' : 'Inter, sans-serif'
        } : undefined,
      }
    };
    return <TemplateRenderer context={context} />;
  }

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

  // Beige Professional Clean Template - EXACT MATCH to your image
  if (template === 'beige-professional-clean') {
    return (
      <div id="resume-preview" className="a4-page" style={{ fontFamily, backgroundColor: colors.background }}>
        <div className="bg-white rounded-lg shadow-lg p-8 m-8">
          {/* Header with photo and contact */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                {resumeData.personalInfo.photo ? (
                  <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  {resumeData.personalInfo.name || 'Ed Walter'}
                </h1>
                <p className="text-gray-600 mb-2">
                  {resumeData.personalInfo.title || 'Professional Title'}
                </p>
              </div>
            </div>
            
            <div className="text-right text-sm text-gray-600">
              <div className="font-semibold mb-2" style={{ color: colors.accent }}>CONTACT DETAILS</div>
              <div className="space-y-1">
                <div>{resumeData.personalInfo.phone || 'Phone'}</div>
                <div>{resumeData.personalInfo.email || 'Email'}</div>
                <div>{resumeData.personalInfo.linkedin || 'LinkedIn'}</div>
                <div>{resumeData.personalInfo.location || 'Location'}</div>
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 pb-2 border-b-2" 
                style={{ color: colors.accent, borderColor: colors.accent }}>
              About Me
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">
              {resumeData.summary || 'I am a dedicated pharmacy technician with over 4 years of experience in providing exceptional customer service and ensuring accurate medication dispensing. I have extensive knowledge of pharmaceutical products and am skilled in managing inventory, cash handling, and maintaining detailed records. I am committed to helping customers with their healthcare needs while maintaining the highest standards of professionalism.'}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Work Experience */}
            <div className="col-span-2">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b-2" 
                  style={{ color: colors.accent, borderColor: colors.accent }}>
                Work Experience
              </h2>
              <div className="space-y-6">
                {resumeData.experience.length > 0 ? resumeData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="mb-2">
                      <h3 className="font-bold text-base text-gray-800">{exp.position}</h3>
                      <div className="text-sm font-medium" style={{ color: colors.accent }}>{exp.company}</div>
                      <div className="text-sm text-gray-600">{exp.location}</div>
                      <div className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Company Description</div>
                    <ul className="text-sm space-y-1 text-gray-700">
                      {exp.description && exp.description.length > 0 ? exp.description.map((desc, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-3 mt-1" style={{ color: colors.accent }}>•</span>
                          <span>{desc}</span>
                        </li>
                      )) : (
                        <li className="flex items-start">
                          <span className="mr-3 mt-1" style={{ color: colors.accent }}>•</span>
                          <span>Accurately dispensed prescription medications and provided excellent customer service to over 100 customers daily.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )) : (
                  <div>
                    <div className="mb-2">
                      <h3 className="font-bold text-base text-gray-800">Pharmacy Technician</h3>
                      <div className="text-sm font-medium" style={{ color: colors.accent }}>Boots Pharmacy</div>
                      <div className="text-sm text-gray-600">London, UK</div>
                      <div className="text-sm text-gray-500">2020 - Present</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Leading pharmacy chain in the UK</div>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li className="flex items-start">
                        <span className="mr-3 mt-1" style={{ color: colors.accent }}>•</span>
                        <span>Accurately dispensed prescription medications and provided excellent customer service to over 100 customers daily.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Education */}
              <div className="mt-8">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b-2" 
                    style={{ color: colors.accent, borderColor: colors.accent }}>
                  Education
                </h2>
                <div className="space-y-4">
                  {resumeData.education.length > 0 ? resumeData.education.map((edu) => (
                    <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-base text-gray-800">{edu.school}</h3>
                      <div className="text-sm font-medium" style={{ color: colors.accent }}>{edu.degree}</div>
                      <div className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</div>
                    </div>
                  )) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-base text-gray-800">Texas State Board of Pharmacy</h3>
                      <div className="text-sm font-medium" style={{ color: colors.accent }}>Pharmacy Technician License</div>
                      <div className="text-sm text-gray-500">2019 - 2023</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Skills, Technical Skills, Languages */}
            <div className="space-y-6">
              {/* Skills */}
              <div>
                <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" 
                    style={{ color: colors.accent, borderColor: colors.accent }}>
                  Skills
                </h3>
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-gray-800">Software Skills</div>
                  <div className="space-y-1 text-sm text-gray-700">
                    {resumeData.skills.length > 0 ? resumeData.skills.slice(0, 5).map((skill) => (
                      <div key={skill.id}>{skill.name}</div>
                    )) : (
                      <>
                        <div>Pharmacy Management Software</div>
                        <div>POS Systems</div>
                        <div>Inventory Management</div>
                        <div>Microsoft Office</div>
                        <div>Customer Service</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" 
                    style={{ color: colors.accent, borderColor: colors.accent }}>
                  Technical Skills
                </h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <div>Medication Dispensing</div>
                  <div>Prescription Processing</div>
                  <div>Inventory Control</div>
                  <div>Cash Handling</div>
                  <div>Quality Assurance</div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-lg font-bold mb-3 pb-2 border-b-2" 
                    style={{ color: colors.accent, borderColor: colors.accent }}>
                  Language(s)
                </h3>
                <div className="space-y-2">
                  {resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages.map((lang) => (
                    <div key={lang.id} className="text-sm">
                      <span className="font-medium text-gray-800">{lang.name}</span>
                      <span className="text-gray-600"> ({lang.level})</span>
                    </div>
                  )) : (
                    <>
                      <div className="text-sm">
                        <span className="font-medium text-gray-800">English</span>
                        <span className="text-gray-600"> (Native)</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-800">French</span>
                        <span className="text-gray-600"> (Native)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback for other legacy templates
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