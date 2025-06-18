import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Code, Award, BookOpen, Briefcase, User, Star, TrendingUp } from 'lucide-react';

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

  // A4 dimensions in pixels (at 96 DPI)
  const A4_WIDTH = 794; // 210mm
  const A4_HEIGHT = 1123; // 297mm

  // Helper function to split content into pages
  const splitIntoPages = (content: React.ReactNode[], maxHeight: number = A4_HEIGHT - 100) => {
    const pages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let currentHeight = 0;

    content.forEach((item, index) => {
      const estimatedHeight = estimateContentHeight(item, index);
      
      if (currentHeight + estimatedHeight > maxHeight && currentPage.length > 0) {
        pages.push([...currentPage]);
        currentPage = [item];
        currentHeight = estimatedHeight;
      } else {
        currentPage.push(item);
        currentHeight += estimatedHeight;
      }
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages.length > 0 ? pages : [content];
  };

  // Estimate content height for pagination
  const estimateContentHeight = (content: React.ReactNode, index: number): number => {
    if (index === 0) return 200; // Header
    if (typeof content === 'object' && content !== null && 'type' in content) {
      const type = (content as any).type;
      if (type === 'summary') return 100;
      if (type === 'experience') return 150;
      if (type === 'education') return 80;
      if (type === 'skills') return 120;
      if (type === 'certifications') return 100;
      if (type === 'languages') return 80;
    }
    return 100; // Default
  };

  // Template-specific layouts with multi-page support
  const renderTemplate = () => {
    switch (template) {
      case 'skill-focus':
        return renderSkillFocusLayout();
      case 'profile-plus':
        return renderProfilePlusLayout();
      case 'compact-connection':
        return renderCompactConnectionLayout();
      case 'pathfinder':
        return renderPathfinderLayout();
      case 'essence-of-you':
        return renderEssenceOfYouLayout();
      case 'vibrant-view':
        return renderVibrantViewLayout();
      case 'executive':
        return renderExecutiveLayout();
      case 'creative':
        return renderCreativeLayout();
      case 'minimal':
        return renderMinimalLayout();
      case 'tech':
        return renderTechLayout();
      case 'timeline':
        return renderTimelineLayout();
      case 'academic':
        return renderAcademicLayout();
      case 'infographic':
        return renderInfographicLayout();
      case 'compact':
        return renderCompactLayout();
      case 'elegant':
        return renderElegantLayout();
      default:
        return renderModernLayout();
    }
  };

  // Skill Focus Layout with multi-page support
  const renderSkillFocusLayout = () => {
    const content = [
      { type: 'header', content: renderSkillFocusHeader() },
      { type: 'summary', content: renderSkillFocusSummary() },
      ...resumeData.experience.map((exp, i) => ({ type: 'experience', content: renderExperienceItem(exp, i) })),
      ...resumeData.education.map((edu, i) => ({ type: 'education', content: renderEducationItem(edu, i) })),
      { type: 'certifications', content: renderCertificationsSection() },
      { type: 'languages', content: renderLanguagesSection() }
    ];

    const pages = splitIntoPages(content.map(item => item.content));

    return (
      <div style={{ fontFamily, color: customColors.text }}>
        {pages.map((pageContent, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white flex"
            style={{ 
              width: `${A4_WIDTH}px`, 
              minHeight: `${A4_HEIGHT}px`,
              pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto'
            }}
          >
            {/* Sidebar - appears on every page */}
            <div className="w-1/3 p-6" style={{ backgroundColor: customColors.background || '#FEF3C7' }}>
              {pageIndex === 0 ? (
                <>
                  {/* Profile Photo */}
                  <div className="text-center mb-6">
                    {resumeData.personalInfo.photo ? (
                      <img
                        src={resumeData.personalInfo.photo}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-white shadow-lg flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <h1 className="text-xl font-bold mb-1" style={{ color: customColors.primary }}>
                      {resumeData.personalInfo.name}
                    </h1>
                    <h2 className="text-lg mb-4" style={{ color: customColors.secondary }}>
                      {resumeData.personalInfo.title}
                    </h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center">
                        <Mail className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                        {resumeData.personalInfo.email}
                      </div>
                      <div className="flex items-center justify-center">
                        <Phone className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                        {resumeData.personalInfo.phone}
                      </div>
                      <div className="flex items-center justify-center">
                        <MapPin className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                        {resumeData.personalInfo.location}
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide" style={{ color: customColors.primary }}>
                      Core Skills
                    </h3>
                    <div className="space-y-3">
                      {resumeData.skills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-xs text-gray-600">{skill.level}</span>
                          </div>
                          <div className="w-full bg-white rounded-full h-2 shadow-inner">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: customColors.accent,
                                width: skill.level === 'Expert' ? '100%' : 
                                       skill.level === 'Advanced' ? '80%' : 
                                       skill.level === 'Intermediate' ? '60%' : '40%'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  {resumeData.languages && resumeData.languages.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide" style={{ color: customColors.primary }}>
                        Languages
                      </h3>
                      <div className="space-y-2">
                        {resumeData.languages.map((language) => (
                          <div key={language.id} className="flex justify-between items-center">
                            <span className="text-sm font-medium">{language.name}</span>
                            <span className="text-xs text-gray-600">{language.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h1 className="text-lg font-bold" style={{ color: customColors.primary }}>
                    {resumeData.personalInfo.name}
                  </h1>
                  <p className="text-sm" style={{ color: customColors.secondary }}>
                    Page {pageIndex + 1}
                  </p>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {pageContent}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Profile Plus Layout with multi-page support
  const renderProfilePlusLayout = () => {
    const content = [
      { type: 'header', content: renderProfilePlusHeader() },
      { type: 'summary', content: renderProfilePlusSummary() },
      ...resumeData.experience.map((exp, i) => ({ type: 'experience', content: renderExperienceItem(exp, i) })),
      ...resumeData.education.map((edu, i) => ({ type: 'education', content: renderEducationItem(edu, i) })),
      { type: 'certifications', content: renderCertificationsSection() }
    ];

    const pages = splitIntoPages(content.map(item => item.content));

    return (
      <div style={{ fontFamily, color: customColors.text }}>
        {pages.map((pageContent, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white p-8"
            style={{ 
              width: `${A4_WIDTH}px`, 
              minHeight: `${A4_HEIGHT}px`,
              pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto'
            }}
          >
            {pageIndex === 0 && (
              <div className="flex items-start space-x-6 mb-8 pb-6 border-b-2" style={{ borderColor: customColors.primary }}>
                {/* Large Profile Photo */}
                {resumeData.personalInfo.photo ? (
                  <img
                    src={resumeData.personalInfo.photo}
                    alt="Profile"
                    className="w-32 h-32 rounded-lg object-cover shadow-lg border-4"
                    style={{ borderColor: customColors.photoFrame || '#E2E8F0' }}
                  />
                ) : (
                  <div 
                    className="w-32 h-32 rounded-lg shadow-lg border-4 flex items-center justify-center"
                    style={{ borderColor: customColors.photoFrame || '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  >
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2" style={{ color: customColors.primary }}>
                    {resumeData.personalInfo.name}
                  </h1>
                  <h2 className="text-2xl mb-4" style={{ color: customColors.secondary }}>
                    {resumeData.personalInfo.title}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                      {resumeData.personalInfo.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                      {resumeData.personalInfo.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                      {resumeData.personalInfo.location}
                    </div>
                    {resumeData.personalInfo.linkedin && (
                      <div className="flex items-center">
                        <Linkedin className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                        {resumeData.personalInfo.linkedin}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {pageIndex > 0 && (
              <div className="text-center mb-6 pb-4 border-b" style={{ borderColor: customColors.primary }}>
                <h1 className="text-xl font-bold" style={{ color: customColors.primary }}>
                  {resumeData.personalInfo.name} - Page {pageIndex + 1}
                </h1>
              </div>
            )}

            <div className="space-y-6">
              {pageContent}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Modern Single Column Layout with multi-page support
  const renderModernLayout = () => {
    const content = [
      { type: 'header', content: renderModernHeader() },
      { type: 'summary', content: renderModernSummary() },
      ...resumeData.experience.map((exp, i) => ({ type: 'experience', content: renderModernExperience(exp, i) })),
      ...resumeData.education.map((edu, i) => ({ type: 'education', content: renderModernEducation(edu, i) })),
      { type: 'skills', content: renderModernSkills() },
      { type: 'certifications', content: renderModernCertifications() },
      { type: 'languages', content: renderModernLanguages() }
    ];

    const pages = splitIntoPages(content.map(item => item.content));

    return (
      <div style={{ fontFamily, color: customColors.text }}>
        {pages.map((pageContent, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white p-8"
            style={{ 
              width: `${A4_WIDTH}px`, 
              minHeight: `${A4_HEIGHT}px`,
              pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto'
            }}
          >
            {pageIndex > 0 && (
              <div className="text-center mb-6 pb-4 border-b" style={{ borderColor: customColors.primary }}>
                <h1 className="text-xl font-bold" style={{ color: customColors.primary }}>
                  {resumeData.personalInfo.name} - Page {pageIndex + 1}
                </h1>
              </div>
            )}
            <div className="space-y-6">
              {pageContent}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Executive Two-Column Layout with multi-page support
  const renderExecutiveLayout = () => {
    const mainContent = [
      { type: 'summary', content: renderExecutiveSummary() },
      ...resumeData.experience.map((exp, i) => ({ type: 'experience', content: renderExecutiveExperience(exp, i) })),
      ...resumeData.education.map((edu, i) => ({ type: 'education', content: renderExecutiveEducation(edu, i) }))
    ];

    const pages = splitIntoPages(mainContent.map(item => item.content), A4_HEIGHT - 200);

    return (
      <div style={{ fontFamily, color: customColors.text }}>
        {pages.map((pageContent, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white min-h-full w-full flex"
            style={{ 
              width: `${A4_WIDTH}px`, 
              minHeight: `${A4_HEIGHT}px`,
              pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto'
            }}
          >
            {/* Sidebar - appears on every page */}
            <div className="w-1/3 p-6" style={{ backgroundColor: customColors.sidebar || '#F9FAFB' }}>
              {pageIndex === 0 ? (
                <>
                  <div className="mb-6">
                    {resumeData.personalInfo.photo && (
                      <img
                        src={resumeData.personalInfo.photo}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                      />
                    )}
                    <h1 className="text-2xl font-bold mb-1" style={{ color: customColors.primary }}>
                      {resumeData.personalInfo.name}
                    </h1>
                    <h2 className="text-lg mb-4" style={{ color: customColors.secondary }}>
                      {resumeData.personalInfo.title}
                    </h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                        {resumeData.personalInfo.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                        {resumeData.personalInfo.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                        {resumeData.personalInfo.location}
                      </div>
                    </div>
                  </div>
                  
                  {/* Skills in Sidebar */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide" style={{ color: customColors.primary }}>
                      Core Skills
                    </h3>
                    <div className="space-y-2">
                      {resumeData.skills.slice(0, 8).map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-sm">{skill.name}</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor: level <= (skill.level === 'Expert' ? 5 : skill.level === 'Advanced' ? 4 : skill.level === 'Intermediate' ? 3 : 2)
                                    ? customColors.accent
                                    : '#E5E7EB'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  {resumeData.languages && resumeData.languages.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide" style={{ color: customColors.primary }}>
                        Languages
                      </h3>
                      <div className="space-y-1">
                        {resumeData.languages.map((language) => (
                          <div key={language.id} className="text-sm">
                            <span className="font-medium">{language.name}</span>
                            {language.level && <span className="text-gray-500 ml-2">({language.level})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h1 className="text-lg font-bold" style={{ color: customColors.primary }}>
                    {resumeData.personalInfo.name}
                  </h1>
                  <p className="text-sm" style={{ color: customColors.secondary }}>
                    Page {pageIndex + 1}
                  </p>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {pageContent}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper functions for rendering individual sections
  const renderSkillFocusHeader = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
        Professional Summary
      </h3>
      <p className="leading-relaxed">{resumeData.summary}</p>
    </div>
  );

  const renderSkillFocusSummary = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
        About Me
      </h3>
      <p className="leading-relaxed">{resumeData.summary}</p>
    </div>
  );

  const renderProfilePlusHeader = () => null; // Header is rendered in main layout

  const renderProfilePlusSummary = () => (
    resumeData.summary && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
          Professional Summary
        </h3>
        <p className="leading-relaxed">{resumeData.summary}</p>
      </div>
    )
  );

  const renderExperienceItem = (exp: any, index: number) => (
    <div key={exp.id} className="mb-6">
      {index === 0 && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: customColors.primary }}>
          Professional Experience
        </h3>
      )}
      <div className="border-l-2 pl-4 mb-4" style={{ borderColor: customColors.accent }}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-gray-900">{exp.position}</h4>
            <p className="font-medium" style={{ color: customColors.secondary }}>{exp.company}</p>
            {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
          </div>
        </div>
        <ul className="text-gray-700 space-y-1">
          {exp.description.map((desc: string, i: number) => (
            <li key={i} className="flex items-start">
              <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: customColors.accent }} />
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderEducationItem = (edu: any, index: number) => (
    <div key={edu.id} className="mb-4">
      {index === 0 && (
        <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
          Education
        </h3>
      )}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
          <p className="font-medium" style={{ color: customColors.secondary }}>{edu.school}</p>
          <p className="text-sm text-gray-600">{edu.location}</p>
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {edu.startDate} - {edu.endDate}
        </div>
      </div>
      {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
      {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
    </div>
  );

  const renderCertificationsSection = () => (
    resumeData.certifications.length > 0 && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
          Certifications
        </h3>
        <div className="space-y-2">
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                <p className="text-sm" style={{ color: customColors.secondary }}>{cert.issuer}</p>
              </div>
              <div className="text-sm text-gray-500">{cert.date}</div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderLanguagesSection = () => (
    resumeData.languages && resumeData.languages.length > 0 && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
          Languages
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {resumeData.languages.map((language) => (
            <div key={language.id} className="flex justify-between items-center">
              <span className="font-medium">{language.name}</span>
              <span className="text-sm text-gray-600">{language.level}</span>
            </div>
          ))}
        </div>
      </div>
    )
  );

  // Modern layout helper functions
  const renderModernHeader = () => (
    <div className="mb-8">
      <div className="flex items-start space-x-6">
        {resumeData.personalInfo.photo && (
          <img
            src={resumeData.personalInfo.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <h2 className="text-xl mb-4" style={{ color: customColors.secondary }}>
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
      </div>
    </div>
  );

  const renderModernSummary = () => (
    resumeData.summary && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ color: customColors.primary, borderColor: customColors.accent }}>
          PROFESSIONAL SUMMARY
        </h3>
        <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
      </div>
    )
  );

  const renderModernExperience = (exp: any, index: number) => (
    <div key={exp.id} className="mb-6">
      {index === 0 && (
        <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ color: customColors.primary, borderColor: customColors.accent }}>
          WORK EXPERIENCE
        </h3>
      )}
      <div className="border-l-2 pl-4 mb-4" style={{ borderColor: customColors.accent }}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-gray-900">{exp.position}</h4>
            <p className="font-medium" style={{ color: customColors.secondary }}>{exp.company}</p>
            {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
          </div>
        </div>
        <ul className="text-gray-700 space-y-1">
          {exp.description.map((desc: string, i: number) => (
            <li key={i} className="flex items-start">
              <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: customColors.accent }} />
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderModernEducation = (edu: any, index: number) => (
    <div key={edu.id} className="mb-4">
      {index === 0 && (
        <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ color: customColors.primary, borderColor: customColors.accent }}>
          EDUCATION
        </h3>
      )}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
          <p className="font-medium" style={{ color: customColors.secondary }}>{edu.school}</p>
          <p className="text-sm text-gray-600">{edu.location}</p>
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {edu.startDate} - {edu.endDate}
        </div>
      </div>
      {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
      {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
    </div>
  );

  const renderModernSkills = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ color: customColors.primary, borderColor: customColors.accent }}>
        SKILLS
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {resumeData.skills.map((skill) => (
          <div key={skill.id} className="px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: customColors.accent + '20', color: customColors.text }}>
            <div className="font-semibold">{skill.name}</div>
            {skill.level && <div className="text-xs opacity-80">{skill.level}</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderModernCertifications = () => (
    resumeData.certifications.length > 0 && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ color: customColors.primary, borderColor: customColors.accent }}>
          CERTIFICATIONS
        </h3>
        <div className="space-y-2">
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                <p className="text-sm" style={{ color: customColors.secondary }}>{cert.issuer}</p>
              </div>
              <div className="text-sm text-gray-500">{cert.date}</div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderModernLanguages = () => (
    resumeData.languages && resumeData.languages.length > 0 && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ color: customColors.primary, borderColor: customColors.accent }}>
          LANGUAGES
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {resumeData.languages.map((language) => (
            <div key={language.id} className="flex justify-between items-center">
              <span className="font-medium">{language.name}</span>
              <span className="text-sm text-gray-600">{language.level}</span>
            </div>
          ))}
        </div>
      </div>
    )
  );

  // Executive layout helper functions
  const renderExecutiveSummary = () => (
    resumeData.summary && (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
          Professional Summary
        </h3>
        <p className="leading-relaxed">{resumeData.summary}</p>
      </div>
    )
  );

  const renderExecutiveExperience = (exp: any, index: number) => (
    <div key={exp.id} className="mb-6">
      {index === 0 && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: customColors.primary }}>
          Professional Experience
        </h3>
      )}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold">{exp.position}</h4>
            <p className="font-medium" style={{ color: customColors.secondary }}>{exp.company}</p>
          </div>
          <span className="text-sm text-gray-500">
            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
          </span>
        </div>
        <ul className="space-y-1 text-sm">
          {exp.description.map((desc: string, i: number) => (
            <li key={i} className="flex items-start">
              <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: customColors.accent }} />
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderExecutiveEducation = (edu: any, index: number) => (
    <div key={edu.id} className="mb-4">
      {index === 0 && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: customColors.primary }}>
          Education
        </h3>
      )}
      <div className="mb-3">
        <h4 className="font-semibold">{edu.degree}</h4>
        <p style={{ color: customColors.secondary }}>{edu.school}</p>
        <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
      </div>
    </div>
  );

  // Placeholder implementations for other layouts (simplified for brevity)
  const renderCompactConnectionLayout = () => renderModernLayout();
  const renderPathfinderLayout = () => renderModernLayout();
  const renderEssenceOfYouLayout = () => renderModernLayout();
  const renderVibrantViewLayout = () => renderModernLayout();
  const renderCreativeLayout = () => renderModernLayout();
  const renderMinimalLayout = () => renderModernLayout();
  const renderTechLayout = () => renderModernLayout();
  const renderTimelineLayout = () => renderModernLayout();
  const renderAcademicLayout = () => renderModernLayout();
  const renderInfographicLayout = () => renderModernLayout();
  const renderCompactLayout = () => renderModernLayout();
  const renderElegantLayout = () => renderModernLayout();

  return (
    <div id="resume-preview" className="w-full">
      {renderTemplate()}
    </div>
  );
};