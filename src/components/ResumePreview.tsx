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
                  <span className="text-sm text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">{exp.company}</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: customColors.accent }} />
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
          <div key="education" className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <BookOpen size={18} />
              Education
            </h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className="text-sm text-gray-700">{edu.school}</p>
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
      case 'languages':
        return resumeData.languages && resumeData.languages.length > 0 && (
          <div key="languages" className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <Globe size={18} />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full"
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

  // Template-specific layouts
  const renderModernLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>
        
        {resumeData.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <User size={18} />
              Professional Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderSkillFocusLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="grid grid-cols-3 gap-0">
        <div className="col-span-1 p-6" style={{ backgroundColor: customColors.background || '#FEF3C7' }}>
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {resumeData.personalInfo.photo ? (
                <img 
                  src={resumeData.personalInfo.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.name}
            </h1>
            <p className="text-sm mb-4" style={{ color: customColors.secondary }}>
              {resumeData.personalInfo.title}
            </p>
          </div>
          
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
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Skills
              </h3>
              <div className="space-y-3">
                {resumeData.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="text-xs">{skill.level}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
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
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Languages
              </h3>
              <div className="space-y-2">
                {resumeData.languages.map((language, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{language.name}</span>
                    {language.level && <span className="text-xs ml-2">({language.level})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="col-span-2 p-6">
          {resumeData.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                About Me
              </h3>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {sectionOrder.filter(s => s !== 'skills' && s !== 'languages').map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderProfilePlusLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: customColors.photoFrame || '#E2E8F0' }}>
            {resumeData.personalInfo.photo ? (
              <img 
                src={resumeData.personalInfo.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={32} style={{ color: customColors.primary }} />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
            {renderContactInfo()}
          </div>
        </div>

        {resumeData.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
              About Me
            </h3>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {sectionOrder.map(section => renderSection(section))}
      </div>
    </div>
  );

  const renderCompactConnectionLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
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
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: customColors.primary }}>
                {resumeData.personalInfo.name}
              </h1>
              <p className="text-lg text-gray-600 mb-2">{resumeData.personalInfo.title}</p>
              <div className="text-sm text-gray-600">
                {resumeData.personalInfo.email} | {resumeData.personalInfo.phone}
              </div>
            </div>
          </div>

          {resumeData.summary && (
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {sectionOrder.slice(0, Math.ceil(sectionOrder.length / 2)).map(section => renderSection(section))}
        </div>

        <div className="w-80 p-6" style={{ backgroundColor: customColors.highlight || '#E0F2FE' }}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
              Details about me
            </h3>
            <div className="space-y-2 text-sm">
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
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="flex">
        <div className="w-80 p-6" style={{ backgroundColor: customColors.timeline || '#E0F2FE' }}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-md overflow-hidden">
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
            <h1 className="text-xl font-bold mb-2" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.name}
            </h1>
            <p className="text-sm" style={{ color: customColors.secondary }}>
              {resumeData.personalInfo.title}
            </p>
          </div>

          <div className="space-y-4 text-sm">
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
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Skills
              </h3>
              <div className="space-y-2">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="bg-white p-2 rounded text-sm">
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 p-6">
          {resumeData.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Career Path
              </h3>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: customColors.primary }}>
                Work Experience
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: customColors.accent }}></div>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="relative pl-12 pb-6 last:pb-0">
                    <div className="absolute left-2 w-4 h-4 rounded-full" style={{ backgroundColor: customColors.accent }}></div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{exp.position}</h4>
                        <span className="text-sm text-gray-500">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="font-medium text-gray-700 mb-2">{exp.company}</p>
                      <p className="text-sm text-gray-600">{exp.description[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sectionOrder.filter(s => s !== 'experience' && s !== 'skills').map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );

  const renderEssenceOfYouLayout = () => (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="p-8">
        <div className="text-center mb-8 p-6 border-t-2 border-b-2" style={{ borderColor: customColors.primary }}>
          <h1 className="text-3xl font-bold mb-3" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-3" style={{ backgroundColor: customColors.accent }}></div>
          <p className="text-lg italic" style={{ color: customColors.secondary }}>
            {resumeData.personalInfo.title}
          </p>
          <div className="mt-4">
            {renderContactInfo()}
          </div>
        </div>

        {resumeData.summary && (
          <div className="mb-8 text-center">
            <p className="text-lg leading-relaxed italic max-w-3xl mx-auto">
              "{resumeData.summary}"
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
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
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="relative">
        <div className="h-4" style={{ background: `linear-gradient(90deg, ${customColors.primary}, ${customColors.secondary})` }}></div>
        
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: customColors.primary }}>
                  {resumeData.personalInfo.name}
                </h1>
                <p className="text-lg text-gray-600">{resumeData.personalInfo.title}</p>
              </div>
            </div>

            {resumeData.summary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {sectionOrder.filter(s => s !== 'skills').map(section => renderSection(section))}
          </div>

          <div className="w-80 p-6" style={{ backgroundColor: customColors.vibrant || '#FEF3C7' }}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Details about me
              </h3>
              <div className="space-y-2 text-sm">
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
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                  Skills
                </h3>
                <div className="space-y-3">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.name}</span>
                        <span className="text-xs">{skill.level}</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
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
          </div>
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
              {resumeData.personalInfo.name}
            </h1>
            <p className="text-xl text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
            <div className="flex justify-center">
              {renderContactInfo()}
            </div>
          </div>

          {resumeData.summary && (
            <div className="mb-8 text-center">
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Executive Summary
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">{resumeData.summary}</p>
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
            <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden" style={{ backgroundColor: customColors.secondary }}>
              {resumeData.personalInfo.photo ? (
                <img 
                  src={resumeData.personalInfo.photo} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={32} style={{ color: customColors.primary }} />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
                {resumeData.personalInfo.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
              {renderContactInfo()}
            </div>
          </div>

          {resumeData.summary && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
                Creative Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
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
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
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
              {resumeData.personalInfo.name}
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

        {resumeData.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: customColors.primary }}>
              <TrendingUp size={18} />
              System Overview
            </h3>
            <p className="text-gray-300 leading-relaxed">{resumeData.summary}</p>
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
                          <span className="text-sm text-gray-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-300 mb-1">{exp.company}</p>
                        <ul className="text-sm text-gray-400 space-y-1">
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
                          {skill.name}
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
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
              Professional Journey
            </h3>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
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
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{exp.company}</p>
                    <ul className="text-sm text-gray-600 space-y-1">
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
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily }}>
      <div className="border-l-8 pl-8 pr-8 py-8" style={{ borderColor: customColors.primary }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
              Research Interests
            </h3>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
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
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-8 text-center">
            <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: customColors.primary }}>
              <User size={32} className="text-white" />
            </div>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">{resumeData.summary}</p>
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
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-lg text-gray-600 mb-3">{resumeData.personalInfo.title}</p>
          <div className="text-sm">
            {renderContactInfo()}
          </div>
        </div>

        {resumeData.summary && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
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
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4 italic">{resumeData.personalInfo.title}</p>
          {renderContactInfo()}
        </div>

        {resumeData.summary && (
          <div className="mb-8 text-center">
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 leading-relaxed italic text-lg">"{resumeData.summary}"</p>
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