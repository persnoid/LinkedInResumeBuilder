import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Code, Award, BookOpen, Briefcase, User, Star, TrendingUp, Camera } from 'lucide-react';

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

  const renderContactInfo = () => (
    <div className="flex flex-wrap gap-4 text-sm">
      {resumeData.personalInfo.email && (
        <div className="flex items-center gap-1">
          <Mail size={14} />
          <span>{resumeData.personalInfo.email}</span>
        </div>
      )}
      {resumeData.personalInfo.phone && (
        <div className="flex items-center gap-1">
          <Phone size={14} />
          <span>{resumeData.personalInfo.phone}</span>
        </div>
      )}
      {resumeData.personalInfo.location && (
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{resumeData.personalInfo.location}</span>
        </div>
      )}
      {resumeData.personalInfo.website && (
        <div className="flex items-center gap-1">
          <Globe size={14} />
          <span>{resumeData.personalInfo.website}</span>
        </div>
      )}
      {resumeData.personalInfo.linkedin && (
        <div className="flex items-center gap-1">
          <Linkedin size={14} />
          <span>{resumeData.personalInfo.linkedin}</span>
        </div>
      )}
    </div>
  );

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'experience':
        return resumeData.experience.length > 0 && (
          <div key="experience" className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <Briefcase size={18} />
              Experience
            </h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{exp.position}</h4>
                  <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">{exp.company}</p>
                <p className="text-sm text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        );
      case 'education':
        return resumeData.education.length > 0 && (
          <div key="education" className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <BookOpen size={18} />
              Education
            </h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                </div>
                <p className="text-sm text-gray-700">{edu.institution}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        );
      case 'skills':
        return resumeData.skills.length > 0 && (
          <div key="skills" className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <Code size={18} />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{ backgroundColor: customColors.secondary, color: customColors.primary }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return resumeData.projects.length > 0 && (
          <div key="projects" className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <Star size={18} />
              Projects
            </h3>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="font-medium mb-1">{project.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 text-xs rounded"
                        style={{ backgroundColor: customColors.secondary }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'certifications':
        return resumeData.certifications.length > 0 && (
          <div key="certifications" className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <Award size={18} />
              Certifications
            </h3>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{cert.name}</h4>
                  <span className="text-sm text-gray-600">{cert.date}</span>
                </div>
                <p className="text-sm text-gray-700">{cert.issuer}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Template-specific layouts
  const renderModernLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>
        
        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <User size={18} />
              Professional Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderSkillFocusLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="grid grid-cols-3 gap-0">
        <div className="col-span-1 p-6" style={{ backgroundColor: customColors.primary }}>
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-2">{resumeData.personalInfo.fullName}</h1>
            <p className="text-lg mb-6 opacity-90">{resumeData.personalInfo.title}</p>
            
            <div className="space-y-3 text-sm mb-6">
              {resumeData.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              )}
            </div>

            {resumeData.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <div className="space-y-2">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-2 p-6">
          {resumeData.personalInfo.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Professional Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {sectionOrder.filter(s => s !== 'skills').map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderProfilePlusLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="relative">
        <div className="h-32" style={{ backgroundColor: customColors.primary }}></div>
        <div className="absolute top-16 left-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <User size={40} style={{ color: customColors.primary }} />
          </div>
        </div>
      </div>
      
      <div className="pt-16 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
              About Me
            </h3>
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderCompactConnectionLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <User size={32} style={{ color: customColors.primary }} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.fullName}
            </h1>
            <p className="text-lg text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
            {renderContactInfo()}
          </div>
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            {sectionOrder.slice(0, Math.ceil(sectionOrder.length / 2)).map(section => renderSection(section))}
          </div>
          <div>
            {sectionOrder.slice(Math.ceil(sectionOrder.length / 2)).map(section => renderSection(section))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPathfinderLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{ backgroundColor: customColors.primary }}>
          <div className="w-full h-full rounded-full transform translate-x-32 -translate-y-32"></div>
        </div>
        
        <div className="relative p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.fullName}
            </h1>
            <p className="text-xl text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
            {renderContactInfo()}
          </div>

          {resumeData.personalInfo.summary && (
            <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: customColors.secondary }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Career Path
              </h3>
              <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {sectionOrder.map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderEssenceOfYouLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-8">
        <div className="text-center mb-8 p-6 rounded-lg" style={{ backgroundColor: customColors.secondary }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: customColors.primary }}>
            <User size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-8 text-center">
            <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
              My Essence
            </h3>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderVibrantViewLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="relative">
        <div className="h-4" style={{ background: `linear-gradient(90deg, ${customColors.primary}, ${customColors.secondary})` }}></div>
        
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: customColors.primary }}>
              <User size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ color: customColors.primary }}>
                {resumeData.personalInfo.fullName}
              </h1>
              <p className="text-lg text-gray-600">{resumeData.personalInfo.title}</p>
            </div>
          </div>

          <div className="mb-8">
            {renderContactInfo()}
          </div>

          {resumeData.personalInfo.summary && (
            <div className="mb-8 p-4 border-l-4" style={{ borderColor: customColors.primary, backgroundColor: customColors.secondary }}>
              <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {sectionOrder.map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderExecutiveLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="border-t-4" style={{ borderColor: customColors.primary }}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.fullName}
            </h1>
            <p className="text-xl text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
            <div className="flex justify-center">
              {renderContactInfo()}
            </div>
          </div>

          {resumeData.personalInfo.summary && (
            <div className="mb-8 text-center">
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Executive Summary
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {sectionOrder.map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderCreativeLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(90deg, ${customColors.primary}, ${customColors.secondary}, ${customColors.primary})` }}></div>
        
        <div className="p-8 pt-12">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-lg flex items-center justify-center" style={{ backgroundColor: customColors.secondary }}>
              <Camera size={32} style={{ color: customColors.primary }} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
                {resumeData.personalInfo.fullName}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
              {renderContactInfo()}
            </div>
          </div>

          {resumeData.personalInfo.summary && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Creative Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {sectionOrder.map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderMinimalLayout = () => (
    <div className="max-w-4xl mx-auto bg-white" style={{ fontFamily }}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-light mb-2 text-gray-900">
            {resumeData.personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderTechLayout = () => (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white shadow-lg" style={{ fontFamily }}>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Code size={24} style={{ color: customColors.primary }} />
            <h1 className="text-3xl font-bold" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.fullName}
            </h1>
          </div>
          <p className="text-lg text-gray-300 mb-4">{resumeData.personalInfo.title}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            {resumeData.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail size={14} />
                <span>{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone size={14} />
                <span>{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{resumeData.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <TrendingUp size={18} />
              System Overview
            </h3>
            <p className="text-gray-300 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        <div className="space-y-6">
          {sectionOrder.map(section => {
            switch (section) {
              case 'experience':
                return resumeData.experience.length > 0 && (
                  <div key="experience" className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
                      <Briefcase size={18} />
                      Experience
                    </h3>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="mb-4 last:mb-0 p-4 bg-gray-800 rounded">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-white">{exp.position}</h4>
                          <span className="text-sm text-gray-400">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-300 mb-1">{exp.company}</p>
                        <p className="text-sm text-gray-400">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                );
              case 'skills':
                return resumeData.skills.length > 0 && (
                  <div key="skills" className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
                      <Code size={18} />
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded bg-gray-800 text-gray-300 border"
                          style={{ borderColor: customColors.primary }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              default:
                return renderSection(section);
            }
          })}
        </div>
      </div>
    </div>
  );

  const renderTimelineLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
              Professional Journey
            </h3>
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {resumeData.experience.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: customColors.primary }}>
              <Calendar size={18} />
              Career Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: customColors.primary }}></div>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="relative pl-12 pb-8 last:pb-0">
                  <div className="absolute left-2 w-4 h-4 rounded-full" style={{ backgroundColor: customColors.primary }}></div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{exp.position}</h4>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{exp.company}</p>
                    <p className="text-sm text-gray-600">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sectionOrder.filter(s => s !== 'experience').map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderAcademicLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="border-l-8 pl-8 pr-8 py-8" style={{ borderColor: customColors.primary }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
              Research Interests
            </h3>
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderInfographicLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-8">
        <div className="text-center mb-8 p-6 rounded-lg" style={{ backgroundColor: customColors.secondary }}>
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-8 text-center">
            <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: customColors.primary }}>
              <User size={32} className="text-white" />
            </div>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectionOrder.map(section => (
            <div key={section} className="p-4 rounded-lg" style={{ backgroundColor: customColors.secondary }}>
              {renderSection(section)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompactLayout = () => (
    <div className="max-w-3xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
          <div className="text-sm">
            {renderContactInfo()}
          </div>
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        <div className="space-y-4">
          {sectionOrder.map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderElegantLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-8">
        <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: customColors.primary }}>
          <h1 className="text-4xl font-light mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.fullName}
          </h1>
          <p className="text-xl text-gray-600 mb-4 italic">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-8 text-center">
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 leading-relaxed italic text-lg">"{resumeData.personalInfo.summary}"</p>
            </div>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  // Template-specific layouts
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

  return (
    <div id="resume-preview" className="w-full">
      {renderTemplate()}
    </div>
  );
};