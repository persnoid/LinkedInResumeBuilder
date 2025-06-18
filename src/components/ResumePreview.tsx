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

[Previous content continues with all the layout rendering functions...]

  return (
    <div id="resume-preview" className="w-full">
      {renderTemplate()}
    </div>
  );
};