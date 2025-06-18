import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Code, Award, BookOpen, Briefcase, User, Star, TrendingUp, Camera, Languages } from 'lucide-react';

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

  // A4 dimensions: 210mm x 297mm (8.27" x 11.69")
  const a4Style = {
    width: '210mm',
    minHeight: '297mm',
    maxWidth: '210mm',
    margin: '0 auto',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily,
    fontSize: '11px',
    lineHeight: '1.4',
    color: customColors.text || '#1F2937'
  };

  const renderContactInfo = () => (
    <div className="flex flex-wrap gap-3 text-xs">
      {resumeData.personalInfo.email && (
        <div className="flex items-center gap-1">
          <Mail size={12} />
          <span>{resumeData.personalInfo.email}</span>
        </div>
      )}
      {resumeData.personalInfo.phone && (
        <div className="flex items-center gap-1">
          <Phone size={12} />
          <span>{resumeData.personalInfo.phone}</span>
        </div>
      )}
      {resumeData.personalInfo.location && (
        <div className="flex items-center gap-1">
          <MapPin size={12} />
          <span>{resumeData.personalInfo.location}</span>
        </div>
      )}
      {resumeData.personalInfo.website && (
        <div className="flex items-center gap-1">
          <Globe size={12} />
          <span>{resumeData.personalInfo.website}</span>
        </div>
      )}
      {resumeData.personalInfo.linkedin && (
        <div className="flex items-center gap-1">
          <Linkedin size={12} />
          <span>{resumeData.personalInfo.linkedin}</span>
        </div>
      )}
    </div>
  );

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'experience':
        return resumeData.experience.length > 0 && (
          <div key="experience" className="mb-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
              <Briefcase size={14} />
              Work Experience
            </h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-xs">{exp.position}</h4>
                  <span className="text-xs text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-xs font-medium text-gray-700 mb-1">{exp.company}</p>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-1 mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: customColors.accent }} />
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'education':
        return resumeData.education.length > 0 && (
          <div key="education" className="mb-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
              <BookOpen size={14} />
              Education
            </h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-xs">{edu.degree}</h4>
                  <span className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className="text-xs text-gray-700">{edu.school}</p>
                {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        );
      case 'skills':
        return resumeData.skills.length > 0 && (
          <div key="skills" className="mb-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
              <Code size={14} />
              Skills
            </h3>
            <div className="flex flex-wrap gap-1">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-full"
                  style={{ backgroundColor: customColors.accent + '20', color: customColors.text }}
                >
                  {skill.name} {skill.level && `(${skill.level})`}
                </span>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        return resumeData.certifications.length > 0 && (
          <div key="certifications" className="mb-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
              <Award size={14} />
              Certifications
            </h3>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-xs">{cert.name}</h4>
                  <span className="text-xs text-gray-600">{cert.date}</span>
                </div>
                <p className="text-xs text-gray-700">{cert.issuer}</p>
              </div>
            ))}
          </div>
        );
      case 'languages':
        return resumeData.languages && resumeData.languages.length > 0 && (
          <div key="languages" className="mb-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
              <Languages size={14} />
              Languages
            </h3>
            <div className="flex flex-wrap gap-1">
              {resumeData.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-full"
                  style={{ backgroundColor: customColors.secondary + '20', color: customColors.text }}
                >
                  {language.name} {language.level && `(${language.level})`}
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Template-specific layouts with A4 sizing
  const renderModernLayout = () => (
    <div style={a4Style}>
      <div className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-sm text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>
        
        {resumeData.summary && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
              <User size={14} />
              Professional Summary
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderSkillFocusLayout = () => (
    <div style={a4Style}>
      <div className="grid grid-cols-3 gap-0 h-full">
        <div className="col-span-1 p-4" style={{ backgroundColor: customColors.background || '#FEF3C7' }}>
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3 overflow-hidden">
              {resumeData.personalInfo.photo ? (
                <img 
                  src={resumeData.personalInfo.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <h1 className="text-sm font-bold mb-1" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.name}
            </h1>
            <p className="text-xs mb-3" style={{ color: customColors.secondary }}>
              {resumeData.personalInfo.title}
            </p>
          </div>
          
          <div className="space-y-2 text-xs mb-4">
            {resumeData.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail size={10} />
                <span>{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone size={10} />
                <span>{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin size={10} />
                <span>{resumeData.personalInfo.location}</span>
              </div>
            )}
          </div>

          {resumeData.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                Skills
              </h3>
              <div className="space-y-2">
                {resumeData.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{skill.name}</span>
                      <span className="text-xs">{skill.level}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full" 
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
          )}

          {resumeData.languages && resumeData.languages.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                Languages
              </h3>
              <div className="space-y-1">
                {resumeData.languages.map((language, index) => (
                  <div key={index} className="text-xs">
                    <span className="font-medium">{language.name}</span>
                    {language.level && <span className="text-xs ml-1">({language.level})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="col-span-2 p-4">
          {resumeData.summary && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                About Me
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {sectionOrder.filter(s => s !== 'skills' && s !== 'languages').map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderProfilePlusLayout = () => (
    <div style={a4Style}>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: customColors.photoFrame || '#E2E8F0' }}>
            {resumeData.personalInfo.photo ? (
              <img 
                src={resumeData.personalInfo.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={24} style={{ color: customColors.primary }} />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.name}
            </h1>
            <p className="text-sm text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
            {renderContactInfo()}
          </div>
        </div>

        {resumeData.summary && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
              About Me
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderCompactConnectionLayout = () => (
    <div style={a4Style}>
      <div className="flex h-full">
        <div className="flex-1 p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
              {resumeData.personalInfo.photo ? (
                <img 
                  src={resumeData.personalInfo.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} style={{ color: customColors.primary }} />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold mb-1" style={{ color: customColors.primary }}>
                {resumeData.personalInfo.name}
              </h1>
              <p className="text-sm text-gray-600 mb-1">{resumeData.personalInfo.title}</p>
              <div className="text-xs text-gray-600">
                {resumeData.personalInfo.email} | {resumeData.personalInfo.phone}
              </div>
            </div>
          </div>

          {resumeData.summary && (
            <div className="mb-4">
              <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {sectionOrder.slice(0, Math.ceil(sectionOrder.length / 2)).map(section => renderSection(section))}
        </div>

        <div className="w-64 p-4" style={{ backgroundColor: customColors.highlight || '#E0F2FE' }}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
              Details about me
            </h3>
            <div className="space-y-1 text-xs">
              <div>
                <span className="font-medium">Contact Number:</span>
                <div>{resumeData.personalInfo.phone}</div>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <div>{resumeData.personalInfo.email}</div>
              </div>
              <div>
                <span className="font-medium">Residential Location:</span>
                <div>{resumeData.personalInfo.location}</div>
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span>
                <div>July 23 1995</div>
              </div>
            </div>
          </div>

          {sectionOrder.slice(Math.ceil(sectionOrder.length / 2)).map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderPathfinderLayout = () => (
    <div style={a4Style}>
      <div className="flex h-full">
        <div className="w-64 p-4" style={{ backgroundColor: customColors.timeline || '#E0F2FE' }}>
          <div className="text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-md overflow-hidden">
              {resumeData.personalInfo.photo ? (
                <img 
                  src={resumeData.personalInfo.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} style={{ color: customColors.primary }} />
              )}
            </div>
            <h1 className="text-sm font-bold mb-1" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.name}
            </h1>
            <p className="text-xs" style={{ color: customColors.secondary }}>
              {resumeData.personalInfo.title}
            </p>
          </div>

          <div className="space-y-2 text-xs mb-4">
            {resumeData.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail size={10} />
                <span>{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone size={10} />
                <span>{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin size={10} />
                <span>{resumeData.personalInfo.location}</span>
              </div>
            )}
          </div>

          {resumeData.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                Skills
              </h3>
              <div className="space-y-1">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="bg-white p-1.5 rounded text-xs">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.languages && resumeData.languages.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                Languages
              </h3>
              <div className="space-y-1">
                {resumeData.languages.map((language, index) => (
                  <div key={index} className="bg-white p-1.5 rounded text-xs">
                    {language.name} {language.level && `(${language.level})`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 p-4">
          {resumeData.summary && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                Career Path
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {resumeData.experience.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-3" style={{ color: customColors.primary }}>
                Work Experience
              </h3>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ backgroundColor: customColors.accent }}></div>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="relative pl-8 pb-4 last:pb-0">
                    <div className="absolute left-2 w-3 h-3 rounded-full" style={{ backgroundColor: customColors.accent }}></div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-xs">{exp.position}</h4>
                        <span className="text-xs text-gray-500">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="font-medium text-gray-700 mb-1 text-xs">{exp.company}</p>
                      <p className="text-xs text-gray-600">{exp.description[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sectionOrder.filter(s => s !== 'experience' && s !== 'skills' && s !== 'languages').map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderEssenceOfYouLayout = () => (
    <div style={a4Style}>
      <div className="p-6">
        <div className="text-center mb-6 p-4 border-t-2 border-b-2" style={{ borderColor: customColors.primary }}>
          <h1 className="text-2xl font-bold mb-3" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <div className="w-12 h-0.5 mx-auto mb-3" style={{ backgroundColor: customColors.accent }}></div>
          <p className="text-sm italic" style={{ color: customColors.secondary }}>
            {resumeData.personalInfo.title}
          </p>
          <div className="mt-3">
            {renderContactInfo()}
          </div>
        </div>

        {resumeData.summary && (
          <div className="mb-6 text-center">
            <p className="text-sm leading-relaxed italic max-w-2xl mx-auto">
              "{resumeData.summary}"
            </p>
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

  const renderVibrantViewLayout = () => (
    <div style={a4Style}>
      <div className="relative h-full">
        <div className="h-3" style={{ background: `linear-gradient(90deg, ${customColors.primary}, ${customColors.secondary})` }}></div>
        
        <div className="flex h-full">
          <div className="flex-1 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {resumeData.personalInfo.photo ? (
                  <img 
                    src={resumeData.personalInfo.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={18} style={{ color: customColors.primary }} />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold mb-1" style={{ color: customColors.primary }}>
                  {resumeData.personalInfo.name}
                </h1>
                <p className="text-sm text-gray-600">{resumeData.personalInfo.title}</p>
              </div>
            </div>

            {resumeData.summary && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                  About Me
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {sectionOrder.filter(s => s !== 'skills' && s !== 'languages').map(section => renderSection(section))}
          </div>

          <div className="w-64 p-4" style={{ backgroundColor: customColors.vibrant || '#FEF3C7' }}>
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                Details about me
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="font-medium">Contact Number:</span>
                  <div>{resumeData.personalInfo.phone}</div>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <div>{resumeData.personalInfo.email}</div>
                </div>
                <div>
                  <span className="font-medium">Residential Location:</span>
                  <div>{resumeData.personalInfo.location}</div>
                </div>
                <div>
                  <span className="font-medium">Date of Birth:</span>
                  <div>July 23 1995</div>
                </div>
              </div>
            </div>

            {resumeData.skills.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                  Skills
                </h3>
                <div className="space-y-2">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{skill.name}</span>
                        <span className="text-xs">{skill.level}</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full" 
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
            )}

            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                  Languages
                </h3>
                <div className="space-y-1">
                  {resumeData.languages.map((language, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium">{language.name}</span>
                      {language.level && <span className="text-xs ml-1">({language.level})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecutiveLayout = () => (
    <div style={a4Style}>
      <div className="border-t-4 h-full" style={{ borderColor: customColors.primary }}>
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.name}
            </h1>
            <p className="text-sm text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
            <div className="flex justify-center">
              {renderContactInfo()}
            </div>
          </div>

          {resumeData.summary && (
            <div className="mb-6 text-center">
              <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                Executive Summary
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed max-w-2xl mx-auto">{resumeData.summary}</p>
            </div>
          )}

          {sectionOrder.map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderCreativeLayout = () => (
    <div style={a4Style}>
      <div className="relative overflow-hidden h-full">
        <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(90deg, ${customColors.primary}, ${customColors.secondary}, ${customColors.primary})` }}></div>
        
        <div className="p-6 pt-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden" style={{ backgroundColor: customColors.secondary }}>
              {resumeData.personalInfo.photo ? (
                <img 
                  src={resumeData.personalInfo.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={24} style={{ color: customColors.primary }} />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2" style={{ color: customColors.primary }}>
                {resumeData.personalInfo.name}
              </h1>
              <p className="text-sm text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
              {renderContactInfo()}
            </div>
          </div>

          {resumeData.summary && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
                Creative Vision
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {sectionOrder.map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderMinimalLayout = () => (
    <div style={a4Style}>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-light mb-2 text-gray-900">
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-sm text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-6">
            <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderTechLayout = () => (
    <div style={{ ...a4Style, backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Code size={20} style={{ color: customColors.primary }} />
            <h1 className="text-2xl font-bold" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.name}
            </h1>
          </div>
          <p className="text-sm text-gray-300 mb-3">{resumeData.personalInfo.title}</p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-300">
            {resumeData.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail size={12} />
                <span>{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone size={12} />
                <span>{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{resumeData.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {resumeData.summary && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
              <TrendingUp size={14} />
              System Overview
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        <div className="space-y-4">
          {sectionOrder.map(section => {
            switch (section) {
              case 'experience':
                return resumeData.experience.length > 0 && (
                  <div key="experience" className="mb-4">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
                      <Briefcase size={14} />
                      Experience
                    </h3>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="mb-3 last:mb-0 p-3 bg-gray-800 rounded">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-white text-xs">{exp.position}</h4>
                          <span className="text-xs text-gray-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-300 mb-1">{exp.company}</p>
                        <ul className="text-xs text-gray-400 space-y-0.5">
                          {exp.description.map((desc, i) => (
                            <li key={i}>• {desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              case 'skills':
                return resumeData.skills.length > 0 && (
                  <div key="skills" className="mb-4">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
                      <Code size={14} />
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {resumeData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs rounded bg-gray-800 text-gray-300 border"
                          style={{ borderColor: customColors.primary }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              case 'languages':
                return resumeData.languages && resumeData.languages.length > 0 && (
                  <div key="languages" className="mb-4">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: customColors.primary }}>
                      <Languages size={14} />
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {resumeData.languages.map((language, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs rounded bg-gray-800 text-gray-300 border"
                          style={{ borderColor: customColors.secondary }}
                        >
                          {language.name} {language.level && `(${language.level})`}
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
    <div style={a4Style}>
      <div className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-sm text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
              Professional Journey
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {resumeData.experience.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-1" style={{ color: customColors.primary }}>
              <Calendar size={14} />
              Career Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ backgroundColor: customColors.primary }}></div>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="relative pl-8 pb-6 last:pb-0">
                  <div className="absolute left-2 w-3 h-3 rounded-full" style={{ backgroundColor: customColors.primary }}></div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-xs">{exp.position}</h4>
                      <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-700 mb-1">{exp.company}</p>
                    <ul className="text-xs text-gray-600 space-y-0.5">
                      {exp.description.map((desc, i) => (
                        <li key={i}>• {desc}</li>
                      ))}
                    </ul>
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
    <div style={a4Style}>
      <div className="border-l-8 pl-6 pr-6 py-6 h-full" style={{ borderColor: customColors.primary }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-sm text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-2" style={{ color: customColors.primary }}>
              Research Interests
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderInfographicLayout = () => (
    <div style={a4Style}>
      <div className="p-6">
        <div className="text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: customColors.secondary }}>
          <h1 className="text-2xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-sm text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-6 text-center">
            <div className="inline-block p-3 rounded-full mb-3" style={{ backgroundColor: customColors.primary }}>
              <User size={24} className="text-white" />
            </div>
            <p className="text-xs text-gray-700 leading-relaxed max-w-2xl mx-auto">{resumeData.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionOrder.map(section => (
            <div key={section} className="p-3 rounded-lg" style={{ backgroundColor: customColors.secondary }}>
              {renderSection(section)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompactLayout = () => (
    <div style={a4Style}>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold mb-1" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-sm text-gray-600 mb-2">{resumeData.personalInfo.title}</p>
          <div className="text-xs">
            {renderContactInfo()}
          </div>
        </div>

        {resumeData.summary && (
          <div className="mb-4">
            <p className="text-xs text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        <div className="space-y-3">
          {sectionOrder.map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderElegantLayout = () => (
    <div style={a4Style}>
      <div className="p-6">
        <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: customColors.primary }}>
          <h1 className="text-3xl font-light mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-sm text-gray-600 mb-3 italic">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-6 text-center">
            <div className="max-w-2xl mx-auto">
              <p className="text-xs text-gray-700 leading-relaxed italic">"{resumeData.summary}"</p>
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
    <div id="resume-preview" className="w-full flex justify-center bg-gray-100 p-4">
      {renderTemplate()}
    </div>
  );
};