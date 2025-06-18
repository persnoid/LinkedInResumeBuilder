import React from 'react';
import { ResumeData } from '../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Code, Award, BookOpen, Briefcase, User, Star, TrendingUp, Camera, Languages, GraduationCap, Building2, MapPin as Location } from 'lucide-react';

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

  // Skill Focus Layout - Orange sidebar with skills emphasis
  const renderSkillFocusLayout = () => (
    <div className="bg-white min-h-[297mm] w-[210mm] flex shadow-lg" style={{ fontFamily, color: customColors.text }}>
      {/* Left Sidebar */}
      <div className="w-1/3 p-6" style={{ backgroundColor: customColors.sidebar || '#FEF3C7' }}>
        {/* Profile Photo */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
            {resumeData.personalInfo.photo ? (
              <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <h2 className="text-sm font-medium" style={{ color: customColors.secondary }}>
            {resumeData.personalInfo.title}
          </h2>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: customColors.primary }}>
            Contact
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <Mail className="w-3 h-3 mr-2" style={{ color: customColors.accent }} />
              <span className="break-all">{resumeData.personalInfo.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-3 h-3 mr-2" style={{ color: customColors.accent }} />
              <span>{resumeData.personalInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-2" style={{ color: customColors.accent }} />
              <span>{resumeData.personalInfo.location}</span>
            </div>
            {resumeData.personalInfo.linkedin && (
              <div className="flex items-center">
                <Linkedin className="w-3 h-3 mr-2" style={{ color: customColors.accent }} />
                <span className="break-all text-xs">{resumeData.personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: customColors.primary }}>
            Skills
          </h3>
          <div className="space-y-3">
            {resumeData.skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-gray-600">{skill.level}</span>
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
            <h3 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: customColors.primary }}>
              Languages
            </h3>
            <div className="space-y-2">
              {resumeData.languages.map((language) => (
                <div key={language.id} className="flex justify-between text-xs">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-gray-600">{language.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* About Me */}
        {resumeData.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 border-b-2 pb-1" style={{ color: customColors.primary, borderColor: customColors.accent }}>
              About Me
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 border-b-2 pb-1" style={{ color: customColors.primary, borderColor: customColors.accent }}>
            Work Experience
          </h3>
          <div className="space-y-4">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border-l-3 pl-4" style={{ borderColor: customColors.accent }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-sm">{exp.position}</h4>
                    <p className="font-medium text-sm" style={{ color: customColors.secondary }}>{exp.company}</p>
                    {exp.location && <p className="text-xs text-gray-600">{exp.location}</p>}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="text-xs space-y-1 text-gray-700">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: customColors.accent }} />
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-3 border-b-2 pb-1" style={{ color: customColors.primary, borderColor: customColors.accent }}>
              Education
            </h3>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">{edu.degree}</h4>
                      <p className="font-medium text-sm" style={{ color: customColors.secondary }}>{edu.school}</p>
                      {edu.location && <p className="text-xs text-gray-600">{edu.location}</p>}
                    </div>
                    <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {edu.gpa && <p className="text-xs text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-xs text-gray-700 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Profile Plus Layout - Large photo with comprehensive info
  const renderProfilePlusLayout = () => (
    <div className="bg-white min-h-[297mm] w-[210mm] p-6 shadow-lg" style={{ fontFamily, color: customColors.text }}>
      {/* Header with Photo */}
      <div className="flex items-start space-x-6 mb-6 pb-6 border-b-2" style={{ borderColor: customColors.primary }}>
        <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 border-4 border-white shadow-lg flex-shrink-0" style={{ backgroundColor: customColors.photoFrame }}>
          {resumeData.personalInfo.photo ? (
            <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <h2 className="text-xl mb-4" style={{ color: customColors.secondary }}>
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
                <span className="truncate">{resumeData.personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* About Me */}
          {resumeData.summary && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: customColors.primary }}>
                About Me
              </h3>
              <p className="text-sm leading-relaxed text-gray-700">{resumeData.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: customColors.primary }}>
              Work Experience
            </h3>
            <div className="space-y-4">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: customColors.accent }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold">{exp.position}</h4>
                      <p className="font-medium" style={{ color: customColors.secondary }}>{exp.company}</p>
                      {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                    </div>
                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="text-sm space-y-1 text-gray-700">
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
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: customColors.primary }}>
              Skills
            </h3>
            <div className="space-y-2">
              {resumeData.skills.map((skill) => (
                <div key={skill.id} className="bg-gray-50 p-2 rounded">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-xs text-gray-600">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
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

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: customColors.primary }}>
                Education
              </h3>
              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="bg-gray-50 p-3 rounded">
                    <h4 className="font-bold text-sm">{edu.degree}</h4>
                    <p className="font-medium text-sm" style={{ color: customColors.secondary }}>{edu.school}</p>
                    <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: customColors.primary }}>
                Languages
              </h3>
              <div className="space-y-2">
                {resumeData.languages.map((language) => (
                  <div key={language.id} className="flex justify-between bg-gray-50 p-2 rounded">
                    <span className="font-medium text-sm">{language.name}</span>
                    <span className="text-xs text-gray-600">{language.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: customColors.primary }}>
                Certifications
              </h3>
              <div className="space-y-2">
                {resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="bg-gray-50 p-2 rounded">
                    <h4 className="font-bold text-sm">{cert.name}</h4>
                    <p className="text-xs" style={{ color: customColors.secondary }}>{cert.issuer}</p>
                    <p className="text-xs text-gray-600">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Compact Connection Layout - Streamlined with sidebar
  const renderCompactConnectionLayout = () => (
    <div className="bg-white min-h-[297mm] w-[210mm] flex shadow-lg" style={{ fontFamily, color: customColors.text }}>
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <h2 className="text-lg mb-4" style={{ color: customColors.secondary }}>
            {resumeData.personalInfo.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.email}
            </span>
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.phone}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.location}
            </span>
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: customColors.highlight }}>
            <h3 className="font-bold mb-2" style={{ color: customColors.primary }}>
              Professional Summary
            </h3>
            <p className="text-sm leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: customColors.primary }}>
            <Briefcase className="w-5 h-5 mr-2" />
            Work Experience
          </h3>
          <div className="space-y-4">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 pl-4" style={{ borderColor: customColors.accent }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{exp.position}</h4>
                    <p className="font-medium" style={{ color: customColors.secondary }}>{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                  </div>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="text-sm space-y-1 text-gray-700">
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
        </div>

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: customColors.primary }}>
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </h3>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="border-l-4 pl-4" style={{ borderColor: customColors.accent }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{edu.degree}</h4>
                      <p className="font-medium" style={{ color: customColors.secondary }}>{edu.school}</p>
                      {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                    </div>
                    <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-1/3 p-6" style={{ backgroundColor: customColors.highlight }}>
        {/* Profile Photo */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
            {resumeData.personalInfo.photo ? (
              <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: customColors.primary }}>
            Contact Details
          </h3>
          <div className="space-y-2 text-xs">
            <div className="bg-white p-2 rounded">
              <div className="font-medium">Email</div>
              <div className="break-all">{resumeData.personalInfo.email}</div>
            </div>
            <div className="bg-white p-2 rounded">
              <div className="font-medium">Phone</div>
              <div>{resumeData.personalInfo.phone}</div>
            </div>
            <div className="bg-white p-2 rounded">
              <div className="font-medium">Location</div>
              <div>{resumeData.personalInfo.location}</div>
            </div>
            {resumeData.personalInfo.linkedin && (
              <div className="bg-white p-2 rounded">
                <div className="font-medium">LinkedIn</div>
                <div className="break-all">{resumeData.personalInfo.linkedin}</div>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: customColors.primary }}>
            Skills
          </h3>
          <div className="flex flex-wrap gap-1">
            {resumeData.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-1 rounded text-xs font-medium bg-white"
                style={{ color: customColors.primary }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: customColors.primary }}>
              Languages
            </h3>
            <div className="space-y-2">
              {resumeData.languages.map((language) => (
                <div key={language.id} className="bg-white p-2 rounded text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium">{language.name}</span>
                    <span className="text-gray-600">{language.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <div>
            <h3 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: customColors.primary }}>
              Certifications
            </h3>
            <div className="space-y-2">
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="bg-white p-2 rounded text-xs">
                  <div className="font-medium">{cert.name}</div>
                  <div className="text-gray-600">{cert.issuer}</div>
                  <div className="text-gray-500">{cert.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Pathfinder Layout - Timeline with sidebar
  const renderPathfinderLayout = () => (
    <div className="bg-white min-h-[297mm] w-[210mm] flex shadow-lg" style={{ fontFamily, color: customColors.text }}>
      {/* Left Sidebar */}
      <div className="w-1/3 p-6" style={{ backgroundColor: customColors.timeline }}>
        {/* Profile */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-gray-200 border-3 border-white shadow">
            {resumeData.personalInfo.photo ? (
              <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <h1 className="text-lg font-bold" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <h2 className="text-sm" style={{ color: customColors.secondary }}>
            {resumeData.personalInfo.title}
          </h2>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3" style={{ color: customColors.primary }}>
            Contact Information
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <Mail className="w-3 h-3 mr-2" />
              <span className="break-all">{resumeData.personalInfo.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-3 h-3 mr-2" />
              <span>{resumeData.personalInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-2" />
              <span>{resumeData.personalInfo.location}</span>
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3" style={{ color: customColors.primary }}>
            Technical Skills
          </h3>
          <div className="space-y-2">
            {resumeData.skills.map((skill) => (
              <div key={skill.id} className="flex items-center text-xs">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: customColors.accent }} />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: customColors.primary }}>
              Languages
            </h3>
            <div className="space-y-1">
              {resumeData.languages.map((language) => (
                <div key={language.id} className="text-xs">
                  <span className="font-medium">{language.name}</span>
                  {language.level && <span className="text-gray-600 ml-2">({language.level})</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Timeline */}
      <div className="flex-1 p-6">
        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3" style={{ color: customColors.primary }}>
              Professional Journey
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        {/* Experience Timeline */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: customColors.accent }} />
          
          <h3 className="text-lg font-bold mb-4" style={{ color: customColors.primary }}>
            Work Experience
          </h3>
          
          <div className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="relative pl-10">
                <div className="absolute left-2.5 w-3 h-3 rounded-full border-2 border-white shadow" style={{ backgroundColor: customColors.accent }} />
                <div className="bg-white p-4 rounded-lg shadow border-l-4" style={{ borderColor: customColors.accent }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold">{exp.position}</h4>
                      <p className="font-medium" style={{ color: customColors.secondary }}>{exp.company}</p>
                      {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="text-sm space-y-1 text-gray-700">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: customColors.accent }} />
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: customColors.primary }}>
              Education
            </h3>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: customColors.accent }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{edu.degree}</h4>
                      <p className="font-medium" style={{ color: customColors.secondary }}>{edu.school}</p>
                      {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                    </div>
                    <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Essence of You Layout - Elegant minimalist
  const renderEssenceOfYouLayout = () => (
    <div className="bg-white min-h-[297mm] w-[210mm] p-8 shadow-lg" style={{ fontFamily, color: customColors.text }}>
      {/* Header */}
      <div className="text-center mb-8 border-t-2 border-b-2 py-6" style={{ borderColor: customColors.primary }}>
        <h1 className="text-3xl font-bold mb-3" style={{ color: customColors.primary }}>
          {resumeData.personalInfo.name}
        </h1>
        <div className="w-16 h-0.5 mx-auto mb-3" style={{ backgroundColor: customColors.accent }} />
        <h2 className="text-xl italic mb-4" style={{ color: customColors.secondary }}>
          {resumeData.personalInfo.title}
        </h2>
        <div className="flex justify-center space-x-6 text-sm">
          <span>{resumeData.personalInfo.email}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.phone}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.location}</span>
        </div>
      </div>

      {/* Photo */}
      {resumeData.personalInfo.photo && (
        <div className="text-center mb-8">
          <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-gray-200 shadow-lg">
            <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Summary */}
      {resumeData.summary && (
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold mb-4 uppercase tracking-widest" style={{ color: customColors.primary }}>
            Professional Summary
          </h3>
          <p className="text-lg leading-relaxed italic max-w-4xl mx-auto">
            "{resumeData.summary}"
          </p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-12">
        {/* Left Column */}
        <div>
          <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest text-center" style={{ color: customColors.primary }}>
            Professional Experience
          </h3>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-lg">{exp.position}</h4>
                  <p className="italic" style={{ color: customColors.secondary }}>{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                <div className="text-sm leading-relaxed">
                  {exp.description.map((desc, i) => (
                    <p key={i} className="mb-2">• {desc}</p>
                  ))}
                </div>
                <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: customColors.accent }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Education */}
          {resumeData.education.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest text-center" style={{ color: customColors.primary }}>
                Education
              </h3>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="text-center">
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="italic" style={{ color: customColors.secondary }}>{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest text-center" style={{ color: customColors.primary }}>
              Core Competencies
            </h3>
            <div className="text-center">
              <div className="grid grid-cols-1 gap-2">
                {resumeData.skills.map((skill) => (
                  <div key={skill.id} className="py-2 border-b border-gray-200">
                    <span className="font-medium">{skill.name}</span>
                    {skill.level && <span className="text-sm text-gray-500 ml-2">({skill.level})</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest text-center" style={{ color: customColors.primary }}>
                Languages
              </h3>
              <div className="text-center space-y-2">
                {resumeData.languages.map((language) => (
                  <div key={language.id}>
                    <span className="font-medium">{language.name}</span>
                    {language.level && <span className="text-sm text-gray-500 ml-2">({language.level})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t text-center" style={{ borderColor: customColors.primary }}>
        <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: customColors.accent }} />
      </div>
    </div>
  );

  // Vibrant View Layout - Energetic with gradients
  const renderVibrantViewLayout = () => (
    <div className="bg-white min-h-[297mm] w-[210mm] flex shadow-lg" style={{ fontFamily, color: customColors.text }}>
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with gradient */}
        <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-orange-100 to-yellow-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-3 border-white shadow-lg">
              {resumeData.personalInfo.photo ? (
                <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: customColors.primary }}>
                {resumeData.personalInfo.name}
              </h1>
              <h2 className="text-lg" style={{ color: customColors.secondary }}>
                {resumeData.personalInfo.title}
              </h2>
              <div className="flex space-x-4 text-sm mt-2">
                <span className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {resumeData.personalInfo.email}
                </span>
                <span className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {resumeData.personalInfo.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center" style={{ color: customColors.primary }}>
              <User className="w-5 h-5 mr-2" />
              About Me
            </h3>
            <p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg">{resumeData.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: customColors.primary }}>
            <Briefcase className="w-5 h-5 mr-2" />
            Work Experience
          </h3>
          <div className="space-y-4">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 pl-4 bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-r-lg" style={{ borderColor: customColors.accent }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{exp.position}</h4>
                    <p className="font-medium" style={{ color: customColors.secondary }}>{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-600 flex items-center">
                      <Building2 className="w-3 h-3 mr-1" />
                      {exp.location}
                    </p>}
                  </div>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="text-sm space-y-1 text-gray-700">
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
        </div>

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: customColors.primary }}>
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </h3>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg border-l-4" style={{ borderColor: customColors.accent }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{edu.degree}</h4>
                      <p className="font-medium" style={{ color: customColors.secondary }}>{edu.school}</p>
                      {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                    </div>
                    <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-1/3 p-6" style={{ backgroundColor: customColors.vibrant }}>
        {/* Skills */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: customColors.primary }}>
            <Star className="w-5 h-5 mr-2" />
            Skills
          </h3>
          <div className="space-y-3">
            {resumeData.skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{skill.name}</span>
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
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: customColors.primary }}>
              <Languages className="w-5 h-5 mr-2" />
              Languages
            </h3>
            <div className="space-y-2">
              {resumeData.languages.map((language) => (
                <div key={language.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{language.name}</span>
                    <span className="text-sm text-gray-600">{language.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: customColors.primary }}>
              <Award className="w-5 h-5 mr-2" />
              Certifications
            </h3>
            <div className="space-y-2">
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <h4 className="font-bold text-sm">{cert.name}</h4>
                  <p className="text-xs" style={{ color: customColors.secondary }}>{cert.issuer}</p>
                  <p className="text-xs text-gray-600">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div>
          <h3 className="font-bold text-lg mb-4" style={{ color: customColors.primary }}>
            Contact
          </h3>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Location className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                <span>{resumeData.personalInfo.location}</span>
              </div>
            </div>
            {resumeData.personalInfo.linkedin && (
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-2" style={{ color: customColors.accent }} />
                  <span className="break-all text-xs">{resumeData.personalInfo.linkedin}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Keep all existing template functions (renderModernLayout, renderExecutiveLayout, etc.)
  // ... (all the existing template functions remain unchanged)

  // Modern Single Column Layout
  const renderModernLayout = () => (
    <div className="bg-white p-8 min-h-[11in] w-full" style={{ fontFamily, color: customColors.text }}>
      {renderModernHeader()}
      {renderModernSummary()}
      {renderModernExperience()}
      {renderModernEducation()}
      {renderModernSkills()}
      {renderModernCertifications()}
    </div>
  );

  // Executive Two-Column Layout
  const renderExecutiveLayout = () => (
    <div className="bg-white min-h-[11in] w-full flex" style={{ fontFamily, color: customColors.text }}>
      {/* Sidebar */}
      <div className="w-1/3 p-6" style={{ backgroundColor: customColors.sidebar || '#F9FAFB' }}>
        <div className="mb-6">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {resumeData.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: customColors.primary }}>
              Professional Summary
            </h3>
            <p className="leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: customColors.primary }}>
            Professional Experience
          </h3>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
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
        </div>

        {resumeData.education.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: customColors.primary }}>
              Education
            </h3>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p style={{ color: customColors.secondary }}>{edu.school}</p>
                  <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Creative Blocks Layout
  const renderCreativeLayout = () => (
    <div className="bg-white p-6 min-h-[11in] w-full" style={{ fontFamily, color: customColors.text }}>
      {/* Header with creative styling */}
      <div className="relative mb-8 p-6 rounded-lg" style={{ backgroundColor: customColors.highlight || '#FEF3C7' }}>
        <div className="absolute top-0 left-0 w-2 h-full rounded-l-lg" style={{ backgroundColor: customColors.accent }} />
        <div className="ml-4">
          <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <h2 className="text-xl mb-4" style={{ color: customColors.secondary }}>
            {resumeData.personalInfo.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.email}
            </span>
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.phone}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {resumeData.personalInfo.location}
            </span>
          </div>
        </div>
      </div>

      {/* Creative grid layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Summary - spans 2 columns */}
        <div className="col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg h-full">
            <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: customColors.primary }}>
              <User className="w-5 h-5 mr-2" />
              About Me
            </h3>
            <p className="leading-relaxed">{resumeData.summary}</p>
          </div>
        </div>

        {/* Skills - 1 column */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg h-full">
            <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: customColors.primary }}>
              <Star className="w-5 h-5 mr-2" />
              Skills
            </h3>
            <div className="space-y-2">
              {resumeData.skills.slice(0, 6).map((skill) => (
                <div key={skill.id} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>{skill.name}</span>
                    <span className="text-xs text-gray-500">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        backgroundColor: customColors.accent,
                        width: skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '80%' : skill.level === 'Intermediate' ? '60%' : '40%'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Experience - spans full width */}
        <div className="col-span-3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: customColors.primary }}>
              <Briefcase className="w-5 h-5 mr-2" />
              Experience
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="bg-white p-4 rounded-lg border-l-4" style={{ borderColor: customColors.accent }}>
                  <h4 className="font-semibold">{exp.position}</h4>
                  <p className="font-medium text-sm" style={{ color: customColors.secondary }}>{exp.company}</p>
                  <p className="text-xs text-gray-500 mb-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  <ul className="text-xs space-y-1">
                    {exp.description.slice(0, 3).map((desc, i) => (
                      <li key={i}>• {desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tech Grid Layout
  const renderTechLayout = () => (
    <div className="bg-white p-6 min-h-[11in] w-full" style={{ fontFamily: 'Monaco, Consolas, monospace', color: customColors.text }}>
      {/* Terminal-style header */}
      <div className="bg-gray-900 text-green-400 p-4 rounded-t-lg font-mono text-sm mb-6">
        <div className="flex items-center mb-2">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span>resume.json</span>
        </div>
        <div>
          <span className="text-blue-400">const</span> <span className="text-yellow-400">developer</span> = &#123;
        </div>
        <div className="ml-4">
          <span className="text-red-400">"name"</span>: <span className="text-green-400">"{resumeData.personalInfo.name}"</span>,
        </div>
        <div className="ml-4">
          <span className="text-red-400">"role"</span>: <span className="text-green-400">"{resumeData.personalInfo.title}"</span>,
        </div>
        <div className="ml-4">
          <span className="text-red-400">"contact"</span>: <span className="text-green-400">"{resumeData.personalInfo.email}"</span>
        </div>
        <div>&#125;;</div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-4 gap-4">
        {/* Skills as code blocks */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: customColors.primary }}>
            <Code className="w-5 h-5 mr-2" />
            Technical Stack
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.skills.map((skill) => (
              <div key={skill.id} className="p-2 rounded text-xs font-mono" style={{ backgroundColor: customColors.code || '#F1F5F9' }}>
                <span style={{ color: customColors.accent }}>const</span> {skill.name.toLowerCase().replace(/\s+/g, '_')} = <span style={{ color: customColors.secondary }}>"{skill.level}"</span>;
              </div>
            ))}
          </div>
        </div>

        {/* Experience as function definitions */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: customColors.primary }}>
            <TrendingUp className="w-5 h-5 mr-2" />
            Work History
          </h3>
          <div className="space-y-3">
            {resumeData.experience.slice(0, 3).map((exp) => (
              <div key={exp.id} className="p-3 rounded text-xs font-mono" style={{ backgroundColor: customColors.code || '#F1F5F9' }}>
                <div style={{ color: customColors.accent }}>function</div>
                <div className="ml-2">
                  <span style={{ color: customColors.primary }}>{exp.position.replace(/\s+/g, '')}()</span> &#123;
                </div>
                <div className="ml-4 text-gray-600">
                  // {exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
                <div className="ml-4">
                  <span style={{ color: customColors.secondary }}>return</span> "{exp.description[0]?.substring(0, 50)}...";
                </div>
                <div className="ml-2">&#125;</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Timeline Layout
  const renderTimelineLayout = () => (
    <div className="bg-white p-8 min-h-[11in] w-full" style={{ fontFamily, color: customColors.text }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
          {resumeData.personalInfo.name}
        </h1>
        <h2 className="text-xl mb-4" style={{ color: customColors.secondary }}>
          {resumeData.personalInfo.title}
        </h2>
        <div className="flex justify-center space-x-6 text-sm">
          <span>{resumeData.personalInfo.email}</span>
          <span>{resumeData.personalInfo.phone}</span>
          <span>{resumeData.personalInfo.location}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 text-center">
        <p className="max-w-3xl mx-auto leading-relaxed">{resumeData.summary}</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full" style={{ backgroundColor: customColors.timeline || '#FEE2E2' }} />
        
        <div className="space-y-8">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: customColors.accent }}>
                  <h4 className="font-semibold">{exp.position}</h4>
                  <p className="font-medium" style={{ color: customColors.secondary }}>{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  <p className="text-sm">{exp.description[0]}</p>
                </div>
              </div>
              
              <div className="w-2/12 flex justify-center">
                <div className="w-4 h-4 rounded-full border-4 border-white shadow-md" style={{ backgroundColor: customColors.accent }} />
              </div>
              
              <div className="w-5/12" />
            </div>
          ))}
        </div>
      </div>

      {/* Skills at bottom */}
      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold mb-4" style={{ color: customColors.primary }}>
          Core Competencies
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {resumeData.skills.map((skill) => (
            <span
              key={skill.id}
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: customColors.accent + '20',
                color: customColors.text 
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // Minimal Layout with lots of white space
  const renderMinimalLayout = () => (
    <div className="bg-white p-12 min-h-[11in] w-full" style={{ fontFamily, color: customColors.text }}>
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Minimal header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light tracking-wide" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="text-lg font-light" style={{ color: customColors.secondary }}>
            {resumeData.personalInfo.title}
          </p>
          <div className="flex justify-center space-x-8 text-sm font-light">
            <span>{resumeData.personalInfo.email}</span>
            <span>{resumeData.personalInfo.phone}</span>
          </div>
        </div>

        {/* Minimal summary */}
        <div className="text-center">
          <p className="text-lg font-light leading-relaxed">{resumeData.summary}</p>
        </div>

        {/* Minimal experience */}
        <div className="space-y-8">
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="text-center space-y-2">
              <h3 className="text-xl font-light" style={{ color: customColors.primary }}>
                {exp.position}
              </h3>
              <p className="font-light" style={{ color: customColors.secondary }}>
                {exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
              <p className="font-light text-gray-600 max-w-lg mx-auto">
                {exp.description[0]}
              </p>
            </div>
          ))}
        </div>

        {/* Minimal skills */}
        <div className="text-center">
          <p className="font-light text-lg">
            {resumeData.skills.map(skill => skill.name).join(' • ')}
          </p>
        </div>
      </div>
    </div>
  );

  // Academic Layout
  const renderAcademicLayout = () => (
    <div className="bg-white p-8 min-h-[11in] w-full" style={{ fontFamily: 'Times New Roman, serif', color: customColors.text }}>
      {/* Academic header */}
      <div className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: customColors.primary }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: customColors.primary }}>
          {resumeData.personalInfo.name}
        </h1>
        <p className="text-lg">{resumeData.personalInfo.title}</p>
        <div className="mt-4 text-sm">
          <p>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
          <p>{resumeData.personalInfo.location}</p>
        </div>
      </div>

      {/* Academic sections */}
      <div className="space-y-6">
        {/* Research Interests / Summary */}
        <div>
          <h3 className="text-lg font-bold mb-2 uppercase tracking-wide" style={{ color: customColors.primary }}>
            Research Interests
          </h3>
          <p className="leading-relaxed">{resumeData.summary}</p>
        </div>

        {/* Education first in academic format */}
        <div>
          <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: customColors.primary }}>
            Education
          </h3>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="italic">{edu.school}, {edu.location}</p>
                </div>
                <p>{edu.startDate} - {edu.endDate}</p>
              </div>
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>

        {/* Professional Experience */}
        <div>
          <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: customColors.primary }}>
            Professional Experience
          </h3>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <div>
                  <p className="font-semibold">{exp.position}</p>
                  <p className="italic">{exp.company}, {exp.location}</p>
                </div>
                <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Skills as competencies */}
        <div>
          <h3 className="text-lg font-bold mb-2 uppercase tracking-wide" style={{ color: customColors.primary }}>
            Technical Competencies
          </h3>
          <p>{resumeData.skills.map(skill => skill.name).join(', ')}</p>
        </div>
      </div>
    </div>
  );

  // Infographic Layout
  const renderInfographicLayout = () => (
    <div className="bg-white p-6 min-h-[11in] w-full" style={{ fontFamily, color: customColors.text }}>
      {/* Infographic header with stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
              {resumeData.personalInfo.name}
            </h1>
            <h2 className="text-xl" style={{ color: customColors.secondary }}>
              {resumeData.personalInfo.title}
            </h2>
          </div>
          <div className="text-right">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg shadow">
                <div className="text-2xl font-bold" style={{ color: customColors.accent }}>
                  {resumeData.experience.length}
                </div>
                <div className="text-xs">Positions</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow">
                <div className="text-2xl font-bold" style={{ color: customColors.accent }}>
                  {resumeData.skills.length}
                </div>
                <div className="text-xs">Skills</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual skills chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: customColors.primary }}>
          Skill Proficiency
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {resumeData.skills.slice(0, 8).map((skill) => (
            <div key={skill.id} className="flex items-center space-x-3">
              <span className="text-sm w-20 truncate">{skill.name}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: customColors.accent,
                    width: skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '80%' : skill.level === 'Intermediate' ? '60%' : '40%'
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 w-16">{skill.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Experience timeline */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: customColors.primary }}>
          Career Journey
        </h3>
        <div className="space-y-4">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: customColors.accent }}>
                  {index + 1}
                </div>
                {index < resumeData.experience.length - 1 && (
                  <div className="w-0.5 h-16 mt-2" style={{ backgroundColor: customColors.accent }} />
                )}
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">{exp.position}</h4>
                <p style={{ color: customColors.secondary }}>{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                <p className="text-sm mt-2">{exp.description[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Compact Dense Layout
  const renderCompactLayout = () => (
    <div className="bg-white p-6 min-h-[11in] w-full text-sm" style={{ fontFamily, color: customColors.text }}>
      {/* Compact header */}
      <div className="flex justify-between items-start mb-4 pb-2 border-b" style={{ borderColor: customColors.primary }}>
        <div>
          <h1 className="text-xl font-bold" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <p className="font-medium" style={{ color: customColors.secondary }}>
            {resumeData.personalInfo.title}
          </p>
        </div>
        <div className="text-right text-xs">
          <p>{resumeData.personalInfo.email}</p>
          <p>{resumeData.personalInfo.phone}</p>
          <p>{resumeData.personalInfo.location}</p>
        </div>
      </div>

      {/* Two column layout for maximum density */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left column - Experience */}
        <div className="col-span-2 space-y-3">
          <h3 className="font-semibold text-sm uppercase" style={{ color: customColors.primary }}>
            Experience
          </h3>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="border-l-2 pl-3" style={{ borderColor: customColors.accent }}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm">{exp.position}</h4>
                  <p className="text-xs" style={{ color: customColors.secondary }}>{exp.company}</p>
                </div>
                <span className="text-xs text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <ul className="text-xs mt-1 space-y-0.5">
                {exp.description.slice(0, 2).map((desc, i) => (
                  <li key={i}>• {desc}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Education in left column */}
          <div className="mt-4">
            <h3 className="font-semibold text-sm uppercase" style={{ color: customColors.primary }}>
              Education
            </h3>
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="mt-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-sm">{edu.degree}</p>
                    <p className="text-xs" style={{ color: customColors.secondary }}>{edu.school}</p>
                  </div>
                  <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Skills, etc */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm uppercase mb-2" style={{ color: customColors.primary }}>
              Skills
            </h3>
            <div className="space-y-1">
              {resumeData.skills.map((skill) => (
                <div key={skill.id} className="text-xs">
                  <span className="font-medium">{skill.name}</span>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-0.5">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        backgroundColor: customColors.accent,
                        width: skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '80%' : skill.level === 'Intermediate' ? '60%' : '40%'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {resumeData.certifications.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm uppercase mb-2" style={{ color: customColors.primary }}>
                Certifications
              </h3>
              <div className="space-y-1">
                {resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-gray-500">{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.languages && resumeData.languages.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm uppercase mb-2" style={{ color: customColors.primary }}>
                Languages
              </h3>
              <div className="space-y-1">
                {resumeData.languages.map((lang) => (
                  <div key={lang.id} className="text-xs">
                    <span className="font-medium">{lang.name}</span>
                    {lang.level && <span className="text-gray-500 ml-1">({lang.level})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary at bottom */}
      <div className="mt-4 pt-3 border-t" style={{ borderColor: customColors.primary }}>
        <h3 className="font-semibold text-sm uppercase mb-2" style={{ color: customColors.primary }}>
          Summary
        </h3>
        <p className="text-xs leading-relaxed">{resumeData.summary}</p>
      </div>
    </div>
  );

  // Elegant Serif Layout
  const renderElegantLayout = () => (
    <div className="bg-white p-10 min-h-[11in] w-full" style={{ fontFamily: 'Playfair Display, serif', color: customColors.text }}>
      {/* Elegant header with decorative elements */}
      <div className="text-center mb-10">
        <div className="border-t-2 border-b-2 py-6" style={{ borderColor: customColors.primary }}>
          <h1 className="text-4xl font-bold mb-3" style={{ color: customColors.primary }}>
            {resumeData.personalInfo.name}
          </h1>
          <div className="w-24 h-0.5 mx-auto mb-3" style={{ backgroundColor: customColors.accent }} />
          <h2 className="text-xl italic" style={{ color: customColors.secondary }}>
            {resumeData.personalInfo.title}
          </h2>
          <div className="mt-4 text-sm">
            <span>{resumeData.personalInfo.email}</span>
            <span className="mx-3">•</span>
            <span>{resumeData.personalInfo.phone}</span>
            <span className="mx-3">•</span>
            <span>{resumeData.personalInfo.location}</span>
          </div>
        </div>
      </div>

      {/* Elegant summary */}
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold mb-4 uppercase tracking-widest" style={{ color: customColors.primary }}>
          Professional Summary
        </h3>
        <p className="text-lg leading-relaxed italic max-w-4xl mx-auto">
          "{resumeData.summary}"
        </p>
      </div>

      {/* Two-column elegant layout */}
      <div className="grid grid-cols-2 gap-12">
        {/* Left column */}
        <div>
          <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest text-center" style={{ color: customColors.primary }}>
            Professional Experience
          </h3>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-lg">{exp.position}</h4>
                  <p className="italic" style={{ color: customColors.secondary }}>{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                <div className="text-sm leading-relaxed">
                  {exp.description.map((desc, i) => (
                    <p key={i} className="mb-2">• {desc}</p>
                  ))}
                </div>
                <div className="w-16 h-0.5 mx-auto mt-4" style={{ backgroundColor: customColors.accent }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Education */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest text-center" style={{ color: customColors.primary }}>
              Education
            </h3>
            <div className="space-y-4">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="text-center">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="italic" style={{ color: customColors.secondary }}>{edu.school}</p>
                  <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest text-center" style={{ color: customColors.primary }}>
              Core Competencies
            </h3>
            <div className="text-center">
              <div className="grid grid-cols-1 gap-2">
                {resumeData.skills.map((skill) => (
                  <div key={skill.id} className="py-2 border-b border-gray-200">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({skill.level})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant footer */}
      <div className="mt-10 pt-6 border-t text-center" style={{ borderColor: customColors.primary }}>
        <div className="w-24 h-0.5 mx-auto" style={{ backgroundColor: customColors.accent }} />
      </div>
    </div>
  );

  // Helper functions for common elements
  const renderModernHeader = () => (
    <div className="mb-8">
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

  const renderModernExperience = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ color: customColors.primary, borderColor: customColors.accent }}>
        WORK EXPERIENCE
      </h3>
      <div className="space-y-4">
        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: customColors.accent }}>
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
              {exp.description.map((desc, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: customColors.accent }} />
                  {desc}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModernEducation = () => (
    resumeData.education.length > 0 && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ color: customColors.primary, borderColor: customColors.accent }}>
          EDUCATION
        </h3>
        <div className="space-y-3">
          {resumeData.education.map((edu) => (
            <div key={edu.id}>
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
          ))}
        </div>
      </div>
    )
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

  return (
    <div id="resume-preview" className="w-full">
      {renderTemplate()}
    </div>
  );
};