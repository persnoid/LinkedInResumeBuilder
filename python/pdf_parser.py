#!/usr/bin/env python3
"""
LinkedIn PDF Parser using PyMuPDF (fitz)
Extracts structured data from LinkedIn profile PDFs
"""

import fitz  # PyMuPDF
import json
import re
import sys
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import argparse

@dataclass
class PersonalInfo:
    name: str = ""
    title: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    website: str = ""

@dataclass
class Experience:
    id: str = ""
    position: str = ""
    company: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    description: List[str] = None

    def __post_init__(self):
        if self.description is None:
            self.description = []

@dataclass
class Education:
    id: str = ""
    degree: str = ""
    school: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""
    description: str = ""

@dataclass
class Skill:
    id: str = ""
    name: str = ""
    level: str = "Intermediate"

@dataclass
class Certification:
    id: str = ""
    name: str = ""
    issuer: str = ""
    date: str = ""
    url: str = ""

@dataclass
class Language:
    id: str = ""
    name: str = ""
    level: str = ""

@dataclass
class ResumeData:
    personal_info: PersonalInfo
    summary: str = ""
    experience: List[Experience] = None
    education: List[Education] = None
    skills: List[Skill] = None
    certifications: List[Certification] = None
    languages: List[Language] = None

    def __post_init__(self):
        if self.experience is None:
            self.experience = []
        if self.education is None:
            self.education = []
        if self.skills is None:
            self.skills = []
        if self.certifications is None:
            self.certifications = []
        if self.languages is None:
            self.languages = []

class LinkedInPDFParser:
    def __init__(self):
        self.section_headers = {
            'personal': ['personal information', 'contact', 'contact information'],
            'summary': ['summary', 'about', 'about me', 'professional summary'],
            'experience': ['experience', 'work experience', 'professional experience', 'employment'],
            'education': ['education', 'academic background'],
            'skills': ['skills', 'top skills', 'core competencies', 'technical skills'],
            'certifications': ['certifications', 'licenses & certifications', 'certificates'],
            'languages': ['languages', 'language skills']
        }
        
    def parse_pdf(self, pdf_path: str) -> ResumeData:
        """Parse LinkedIn PDF and extract structured data"""
        try:
            doc = fitz.open(pdf_path)
            
            # Extract text with positioning
            text_blocks = []
            for page_num in range(len(doc)):
                page = doc[page_num]
                blocks = page.get_text("dict")
                
                for block in blocks["blocks"]:
                    if "lines" in block:
                        for line in block["lines"]:
                            line_text = ""
                            for span in line["spans"]:
                                line_text += span["text"]
                            if line_text.strip():
                                text_blocks.append({
                                    'text': line_text.strip(),
                                    'bbox': line["bbox"],
                                    'page': page_num
                                })
            
            doc.close()
            
            # Sort blocks by position (top to bottom, left to right)
            text_blocks.sort(key=lambda x: (x['page'], -x['bbox'][1], x['bbox'][0]))
            
            # Extract lines of text
            lines = [block['text'] for block in text_blocks]
            
            return self._parse_structured_data(lines)
            
        except Exception as e:
            raise Exception(f"Error parsing PDF: {str(e)}")
    
    def _parse_structured_data(self, lines: List[str]) -> ResumeData:
        """Parse lines into structured resume data"""
        resume = ResumeData(personal_info=PersonalInfo())
        
        # Find section boundaries
        sections = self._identify_sections(lines)
        
        # Parse each section
        resume.personal_info = self._parse_personal_info(lines, sections)
        resume.summary = self._parse_summary(lines, sections)
        resume.experience = self._parse_experience(lines, sections)
        resume.education = self._parse_education(lines, sections)
        resume.skills = self._parse_skills(lines, sections)
        resume.certifications = self._parse_certifications(lines, sections)
        resume.languages = self._parse_languages(lines, sections)
        
        return resume
    
    def _identify_sections(self, lines: List[str]) -> Dict[str, List[int]]:
        """Identify section headers and their line ranges"""
        sections = {}
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            
            for section_type, headers in self.section_headers.items():
                for header in headers:
                    if line_lower == header or line_lower == header + ':':
                        if section_type not in sections:
                            sections[section_type] = []
                        sections[section_type].append(i)
        
        return sections
    
    def _get_section_lines(self, lines: List[str], sections: Dict[str, List[int]], 
                          section_type: str) -> List[str]:
        """Get lines belonging to a specific section"""
        if section_type not in sections:
            return []
        
        section_lines = []
        for start_idx in sections[section_type]:
            # Find end of section
            end_idx = len(lines)
            for other_section, indices in sections.items():
                if other_section != section_type:
                    for idx in indices:
                        if idx > start_idx and idx < end_idx:
                            end_idx = idx
            
            # Extract lines for this section
            section_content = lines[start_idx + 1:end_idx]
            section_lines.extend([line.strip() for line in section_content if line.strip()])
        
        return section_lines
    
    def _parse_personal_info(self, lines: List[str], sections: Dict[str, List[int]]) -> PersonalInfo:
        """Parse personal information"""
        personal_info = PersonalInfo()
        
        # Get explicit personal info section
        personal_lines = self._get_section_lines(lines, sections, 'personal')
        
        # Parse label-value pairs
        for line in personal_lines:
            if ':' in line:
                label, value = line.split(':', 1)
                label = label.strip().lower()
                value = value.strip()
                
                if label in ['name', 'full name']:
                    personal_info.name = value
                elif label in ['title', 'headline', 'position']:
                    personal_info.title = value
                elif label == 'email':
                    personal_info.email = value
                elif label in ['phone', 'telephone', 'mobile']:
                    personal_info.phone = value
                elif label == 'location':
                    personal_info.location = value
                elif label == 'linkedin':
                    personal_info.linkedin = value
                elif label in ['website', 'url']:
                    personal_info.website = value
        
        # Fallback: extract from header if no explicit section
        if not personal_info.name:
            personal_info = self._extract_header_info(lines, personal_info)
        
        return personal_info
    
    def _extract_header_info(self, lines: List[str], personal_info: PersonalInfo) -> PersonalInfo:
        """Extract personal info from document header"""
        for i, line in enumerate(lines[:10]):  # Check first 10 lines
            line = line.strip()
            
            # Name detection (first substantial line that looks like a name)
            if not personal_info.name and re.match(r'^[A-Z][a-zA-Z\s.\''-]+$', line) and len(line.split()) <= 4:
                personal_info.name = line
                continue
            
            # Email detection
            email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', line)
            if email_match and not personal_info.email:
                personal_info.email = email_match.group()
            
            # LinkedIn URL detection
            linkedin_match = re.search(r'linkedin\.com/in/[^\s]+', line, re.IGNORECASE)
            if linkedin_match and not personal_info.linkedin:
                personal_info.linkedin = linkedin_match.group()
            
            # Phone detection
            phone_match = re.search(r'[\+]?[\d\s\-\(\)]{10,}', line)
            if phone_match and not personal_info.phone and not '@' in line:
                personal_info.phone = phone_match.group().strip()
            
            # Title/headline (line after name, if it's not contact info)
            if personal_info.name and not personal_info.title and i > 0:
                if not any(x in line.lower() for x in ['@', 'linkedin', 'www', '+']) and len(line) > 5:
                    personal_info.title = line
        
        return personal_info
    
    def _parse_summary(self, lines: List[str], sections: Dict[str, List[int]]) -> str:
        """Parse professional summary"""
        summary_lines = self._get_section_lines(lines, sections, 'summary')
        return ' '.join(summary_lines)
    
    def _parse_experience(self, lines: List[str], sections: Dict[str, List[int]]) -> List[Experience]:
        """Parse work experience"""
        exp_lines = self._get_section_lines(lines, sections, 'experience')
        experiences = []
        
        current_exp = None
        
        for line in exp_lines:
            # Date pattern detection
            date_patterns = [
                r'(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|Present|Current)',
                r'(\d{4})\s*[-–]\s*(\d{4}|Present|Current)',
                r'(\w+\s+\d{4})\s*[-–]\s*(Present|Current)'
            ]
            
            date_match = None
            for pattern in date_patterns:
                date_match = re.search(pattern, line, re.IGNORECASE)
                if date_match:
                    break
            
            if date_match:
                # Save previous experience
                if current_exp:
                    experiences.append(current_exp)
                
                # Start new experience
                current_exp = Experience(
                    id=str(len(experiences) + 1),
                    start_date=date_match.group(1),
                    end_date=date_match.group(2),
                    current='present' in date_match.group(2).lower() or 'current' in date_match.group(2).lower()
                )
                
            elif current_exp and line and not re.match(r'^\d{4}', line):
                # Determine if this is position, company, location, or description
                if not current_exp.position and any(title in line.lower() for title in 
                    ['engineer', 'manager', 'director', 'analyst', 'developer', 'consultant', 'specialist', 'lead', 'cto', 'ceo', 'founder']):
                    current_exp.position = line
                elif not current_exp.company and len(line) < 100:
                    current_exp.company = line
                elif not current_exp.location and (',' in line or any(loc in line.lower() for loc in 
                    ['germany', 'usa', 'uk', 'france', 'berlin', 'munich', 'london', 'paris', 'new york'])):
                    current_exp.location = line
                else:
                    current_exp.description.append(line)
        
        # Add last experience
        if current_exp:
            experiences.append(current_exp)
        
        return experiences
    
    def _parse_education(self, lines: List[str], sections: Dict[str, List[int]]) -> List[Education]:
        """Parse education"""
        edu_lines = self._get_section_lines(lines, sections, 'education')
        education = []
        
        current_edu = None
        
        for line in edu_lines:
            # Date pattern for education
            date_match = re.search(r'(\d{4})\s*[-–]\s*(\d{4})', line)
            
            if date_match:
                if current_edu:
                    education.append(current_edu)
                
                current_edu = Education(
                    id=str(len(education) + 1),
                    start_date=date_match.group(1),
                    end_date=date_match.group(2)
                )
                
            elif current_edu and line:
                # Determine if this is degree, school, or description
                if any(degree in line.lower() for degree in ['bachelor', 'master', 'phd', 'diploma', 'certificate']):
                    current_edu.degree = line
                elif not current_edu.school:
                    current_edu.school = line
                else:
                    current_edu.description = line
        
        if current_edu:
            education.append(current_edu)
        
        return education
    
    def _parse_skills(self, lines: List[str], sections: Dict[str, List[int]]) -> List[Skill]:
        """Parse skills"""
        skill_lines = self._get_section_lines(lines, sections, 'skills')
        skills = []
        
        for line in skill_lines:
            # Split skills by common separators
            skill_items = re.split(r'[,•·|]', line)
            for skill_item in skill_items:
                skill_name = skill_item.strip()
                if skill_name and len(skill_name) > 1:
                    skills.append(Skill(
                        id=str(len(skills) + 1),
                        name=skill_name,
                        level="Intermediate"
                    ))
        
        return skills
    
    def _parse_certifications(self, lines: List[str], sections: Dict[str, List[int]]) -> List[Certification]:
        """Parse certifications"""
        cert_lines = self._get_section_lines(lines, sections, 'certifications')
        certifications = []
        
        for line in cert_lines:
            # Basic certification parsing
            parts = re.split(r'[-–|]', line)
            if len(parts) >= 2:
                certifications.append(Certification(
                    id=str(len(certifications) + 1),
                    name=parts[0].strip(),
                    issuer=parts[1].strip(),
                    date=parts[2].strip() if len(parts) > 2 else ""
                ))
        
        return certifications
    
    def _parse_languages(self, lines: List[str], sections: Dict[str, List[int]]) -> List[Language]:
        """Parse languages"""
        lang_lines = self._get_section_lines(lines, sections, 'languages')
        languages = []
        
        for line in lang_lines:
            # Pattern: Language (Proficiency)
            lang_match = re.match(r'^(.+?)\s*\((.+?)\)$', line)
            if lang_match:
                languages.append(Language(
                    id=str(len(languages) + 1),
                    name=lang_match.group(1).strip(),
                    level=lang_match.group(2).strip()
                ))
            else:
                languages.append(Language(
                    id=str(len(languages) + 1),
                    name=line.strip(),
                    level=""
                ))
        
        return languages

def main():
    parser = argparse.ArgumentParser(description='Parse LinkedIn PDF')
    parser.add_argument('pdf_path', help='Path to PDF file')
    parser.add_argument('--output', '-o', help='Output JSON file path')
    
    args = parser.parse_args()
    
    try:
        pdf_parser = LinkedInPDFParser()
        resume_data = pdf_parser.parse_pdf(args.pdf_path)
        
        # Convert to dict for JSON serialization
        result = asdict(resume_data)
        
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"Results saved to {args.output}")
        else:
            print(json.dumps(result, indent=2, ensure_ascii=False))
            
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()