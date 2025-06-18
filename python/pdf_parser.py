#!/usr/bin/env python3
"""
Enhanced LinkedIn PDF Parser using PyMuPDF (fitz)
Extracts structured data from LinkedIn profile PDFs with improved parsing logic
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
        # Enhanced section headers for better LinkedIn PDF recognition
        self.section_headers = {
            'personal': [
                'contact', 'contact information', 'personal information',
                'kontakt', 'kontaktinformationen', 'persönliche informationen'
            ],
            'summary': [
                'summary', 'about', 'about me', 'professional summary', 'profile',
                'zusammenfassung', 'über mich', 'profil', 'berufliches profil'
            ],
            'experience': [
                'experience', 'work experience', 'professional experience', 'employment',
                'career', 'work history', 'berufserfahrung', 'arbeitserfahrung',
                'karriere', 'beruflicher werdegang'
            ],
            'education': [
                'education', 'academic background', 'studies', 'university',
                'bildung', 'ausbildung', 'studium', 'akademischer hintergrund'
            ],
            'skills': [
                'skills', 'top skills', 'core competencies', 'technical skills',
                'competencies', 'abilities', 'fähigkeiten', 'kompetenzen',
                'fertigkeiten', 'kenntnisse'
            ],
            'certifications': [
                'certifications', 'licenses & certifications', 'certificates',
                'licenses', 'zertifikate', 'zertifizierungen', 'lizenzen'
            ],
            'languages': [
                'languages', 'language skills', 'sprachen', 'sprachkenntnisse'
            ]
        }
        
        # Common LinkedIn PDF patterns
        self.linkedin_patterns = {
            'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            'phone': r'[\+]?[\d\s\-\(\)]{10,}',
            'linkedin_url': r'linkedin\.com/in/[^\s]+',
            'website': r'(?:https?://)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?',
            'date_range': r'(\w+\s+\d{4}|\d{4})\s*[-–]\s*(\w+\s+\d{4}|\d{4}|Present|Current|Heute|Aktuell)',
            'location': r'[A-Za-zÀ-ÿ\s,\-]+(?:,\s*[A-Za-zÀ-ÿ\s]+)*'
        }
        
    def parse_pdf(self, pdf_path: str) -> ResumeData:
        """Enhanced PDF parsing with better text extraction and positioning"""
        try:
            doc = fitz.open(pdf_path)
            
            # Extract text with enhanced positioning and formatting
            structured_content = self._extract_structured_content(doc)
            doc.close()
            
            # Parse the structured content
            return self._parse_structured_data(structured_content)
            
        except Exception as e:
            raise Exception(f"Error parsing PDF: {str(e)}")
    
    def _extract_structured_content(self, doc) -> Dict[str, Any]:
        """Extract text with positioning, font size, and formatting information"""
        content = {
            'text_blocks': [],
            'lines': [],
            'fonts': {},
            'page_count': len(doc)
        }
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Get text with detailed formatting
            text_dict = page.get_text("dict")
            
            for block in text_dict["blocks"]:
                if "lines" in block:
                    for line in block["lines"]:
                        line_text = ""
                        line_fonts = []
                        
                        for span in line["spans"]:
                            text = span["text"].strip()
                            if text:
                                line_text += text + " "
                                font_info = {
                                    'font': span.get('font', ''),
                                    'size': span.get('size', 12),
                                    'flags': span.get('flags', 0),
                                    'color': span.get('color', 0)
                                }
                                line_fonts.append(font_info)
                        
                        if line_text.strip():
                            content['text_blocks'].append({
                                'text': line_text.strip(),
                                'bbox': line["bbox"],
                                'page': page_num,
                                'fonts': line_fonts,
                                'is_bold': any(f.get('flags', 0) & 2**4 for f in line_fonts),
                                'font_size': max([f.get('size', 12) for f in line_fonts]) if line_fonts else 12
                            })
        
        # Sort by position (top to bottom, left to right)
        content['text_blocks'].sort(key=lambda x: (x['page'], -x['bbox'][1], x['bbox'][0]))
        content['lines'] = [block['text'] for block in content['text_blocks']]
        
        return content
    
    def _parse_structured_data(self, content: Dict[str, Any]) -> ResumeData:
        """Enhanced parsing with better section detection and data extraction"""
        resume = ResumeData(personal_info=PersonalInfo())
        
        lines = content['lines']
        text_blocks = content['text_blocks']
        
        # Identify sections using enhanced detection
        sections = self._identify_sections_enhanced(lines, text_blocks)
        
        # Parse each section with improved logic
        resume.personal_info = self._parse_personal_info_enhanced(lines, text_blocks, sections)
        resume.summary = self._parse_summary_enhanced(lines, sections)
        resume.experience = self._parse_experience_enhanced(lines, text_blocks, sections)
        resume.education = self._parse_education_enhanced(lines, sections)
        resume.skills = self._parse_skills_enhanced(lines, sections)
        resume.certifications = self._parse_certifications_enhanced(lines, sections)
        resume.languages = self._parse_languages_enhanced(lines, sections)
        
        return resume
    
    def _identify_sections_enhanced(self, lines: List[str], text_blocks: List[Dict]) -> Dict[str, List[int]]:
        """Enhanced section detection using font size, formatting, and content analysis"""
        sections = {}
        
        for i, (line, block) in enumerate(zip(lines, text_blocks)):
            line_lower = line.lower().strip()
            
            # Check if this looks like a section header
            is_potential_header = (
                block['is_bold'] or 
                block['font_size'] > 12 or
                line.isupper() or
                line.endswith(':')
            )
            
            if is_potential_header:
                for section_type, headers in self.section_headers.items():
                    for header in headers:
                        # More flexible matching
                        if (header in line_lower or 
                            line_lower.startswith(header) or
                            line_lower == header.replace(' ', '') or
                            line_lower == header + ':'):
                            
                            if section_type not in sections:
                                sections[section_type] = []
                            sections[section_type].append(i)
                            break
        
        return sections
    
    def _parse_personal_info_enhanced(self, lines: List[str], text_blocks: List[Dict], sections: Dict[str, List[int]]) -> PersonalInfo:
        """Enhanced personal information extraction"""
        personal_info = PersonalInfo()
        
        # Look in the first 15 lines for personal info (LinkedIn PDFs typically have this at the top)
        header_lines = lines[:15]
        
        for i, line in enumerate(header_lines):
            # Name detection (usually the largest text at the top)
            if not personal_info.name and i < len(text_blocks):
                block = text_blocks[i]
                if (block['font_size'] >= 16 and 
                    re.match(r'^[A-Za-zÀ-ÿ\s.\'-]+$', line) and 
                    len(line.split()) <= 4 and
                    not any(pattern in line.lower() for pattern in ['email', 'phone', 'linkedin', '@'])):
                    personal_info.name = line.strip()
                    continue
            
            # Title/headline (usually after name, medium font size)
            if (personal_info.name and not personal_info.title and 
                i > 0 and i < len(text_blocks)):
                block = text_blocks[i]
                if (block['font_size'] >= 12 and 
                    not re.search(self.linkedin_patterns['email'], line) and
                    not re.search(self.linkedin_patterns['phone'], line) and
                    'linkedin.com' not in line.lower() and
                    len(line) > 5):
                    personal_info.title = line.strip()
                    continue
            
            # Extract contact information using patterns
            email_match = re.search(self.linkedin_patterns['email'], line)
            if email_match and not personal_info.email:
                personal_info.email = email_match.group()
            
            phone_match = re.search(self.linkedin_patterns['phone'], line)
            if phone_match and not personal_info.phone and '@' not in line:
                personal_info.phone = phone_match.group().strip()
            
            linkedin_match = re.search(self.linkedin_patterns['linkedin_url'], line, re.IGNORECASE)
            if linkedin_match and not personal_info.linkedin:
                personal_info.linkedin = linkedin_match.group()
            
            # Website detection (excluding email and LinkedIn)
            if not personal_info.website and not personal_info.email in line and 'linkedin.com' not in line.lower():
                website_match = re.search(self.linkedin_patterns['website'], line)
                if website_match:
                    personal_info.website = website_match.group()
        
        # Location detection (often appears with other contact info)
        for line in header_lines:
            if not personal_info.location:
                # Look for location patterns
                if (not re.search(self.linkedin_patterns['email'], line) and
                    not re.search(self.linkedin_patterns['phone'], line) and
                    'linkedin.com' not in line.lower() and
                    (',' in line or any(loc in line.lower() for loc in 
                     ['germany', 'deutschland', 'berlin', 'munich', 'münchen', 'hamburg', 
                      'usa', 'united states', 'uk', 'london', 'paris', 'france']))):
                    
                    # Clean and validate location
                    potential_location = re.sub(r'[^\w\s,\-À-ÿ]', '', line).strip()
                    if (len(potential_location) < 50 and 
                        len(potential_location.split()) <= 6 and
                        not any(word in potential_location.lower() for word in 
                               ['engineer', 'developer', 'manager', 'director', 'analyst'])):
                        personal_info.location = potential_location
        
        return personal_info
    
    def _parse_summary_enhanced(self, lines: List[str], sections: Dict[str, List[int]]) -> str:
        """Enhanced summary parsing"""
        summary_lines = self._get_section_lines(lines, sections, 'summary')
        
        if summary_lines:
            # Clean and join summary lines
            summary = ' '.join(summary_lines)
            # Remove common LinkedIn PDF artifacts
            summary = re.sub(r'\s+', ' ', summary)
            summary = summary.strip()
            return summary
        
        return ""
    
    def _parse_experience_enhanced(self, lines: List[str], text_blocks: List[Dict], sections: Dict[str, List[int]]) -> List[Experience]:
        """Enhanced experience parsing with better date and company detection"""
        exp_lines = self._get_section_lines(lines, sections, 'experience')
        experiences = []
        
        current_exp = None
        i = 0
        
        while i < len(exp_lines):
            line = exp_lines[i].strip()
            
            # Look for date patterns to identify new experience entries
            date_match = re.search(self.linkedin_patterns['date_range'], line, re.IGNORECASE)
            
            if date_match:
                # Save previous experience
                if current_exp:
                    experiences.append(current_exp)
                
                # Create new experience
                current_exp = Experience(
                    id=str(len(experiences) + 1),
                    start_date=date_match.group(1),
                    end_date=date_match.group(2),
                    current='present' in date_match.group(2).lower() or 'current' in date_match.group(2).lower()
                )
                
                # Look for position and company in surrounding lines
                self._extract_job_details(exp_lines, i, current_exp)
                
            elif current_exp and line and not re.match(r'^\d{4}', line):
                # Add to description if it's not a date and we have a current experience
                if (len(line) > 10 and 
                    not any(keyword in line.lower() for keyword in ['page', 'linkedin', 'generated'])):
                    current_exp.description.append(line)
            
            i += 1
        
        # Add last experience
        if current_exp:
            experiences.append(current_exp)
        
        return experiences
    
    def _extract_job_details(self, lines: List[str], date_line_idx: int, experience: Experience):
        """Extract job position, company, and location from surrounding lines"""
        # Look in lines before and after the date line
        search_range = range(max(0, date_line_idx - 3), min(len(lines), date_line_idx + 3))
        
        for i in search_range:
            if i == date_line_idx:
                continue
                
            line = lines[i].strip()
            if not line:
                continue
            
            # Position detection (often contains job titles)
            if not experience.position and any(title in line.lower() for title in 
                ['engineer', 'developer', 'manager', 'director', 'analyst', 'consultant', 
                 'specialist', 'lead', 'senior', 'junior', 'intern', 'cto', 'ceo', 'founder']):
                experience.position = line
            
            # Company detection (usually a proper noun, not too long)
            elif (not experience.company and 
                  len(line) < 80 and 
                  not any(word in line.lower() for word in ['at', 'in', 'from', 'to', 'since']) and
                  not re.search(self.linkedin_patterns['date_range'], line)):
                experience.company = line
            
            # Location detection
            elif (not experience.location and 
                  (',' in line or any(loc in line.lower() for loc in 
                   ['germany', 'usa', 'uk', 'berlin', 'munich', 'london', 'paris']))):
                experience.location = line
    
    def _parse_education_enhanced(self, lines: List[str], sections: Dict[str, List[int]]) -> List[Education]:
        """Enhanced education parsing"""
        edu_lines = self._get_section_lines(lines, sections, 'education')
        education = []
        
        current_edu = None
        
        for line in edu_lines:
            line = line.strip()
            if not line:
                continue
            
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
                # Degree detection
                if any(degree in line.lower() for degree in 
                      ['bachelor', 'master', 'phd', 'diploma', 'certificate', 'degree']):
                    current_edu.degree = line
                # School detection
                elif not current_edu.school:
                    current_edu.school = line
                # Additional info
                else:
                    if not current_edu.description:
                        current_edu.description = line
        
        if current_edu:
            education.append(current_edu)
        
        return education
    
    def _parse_skills_enhanced(self, lines: List[str], sections: Dict[str, List[int]]) -> List[Skill]:
        """Enhanced skills parsing with better separation and categorization"""
        skill_lines = self._get_section_lines(lines, sections, 'skills')
        skills = []
        
        for line in skill_lines:
            line = line.strip()
            if not line or len(line) < 2:
                continue
            
            # Split skills by various separators
            skill_items = re.split(r'[,•·\|\n\t]|(?:\s{2,})', line)
            
            for skill_item in skill_items:
                skill_name = skill_item.strip()
                
                # Filter out non-skill items
                if (skill_name and 
                    len(skill_name) > 1 and 
                    len(skill_name) < 50 and
                    not skill_name.isdigit() and
                    not any(word in skill_name.lower() for word in 
                           ['page', 'linkedin', 'generated', 'years', 'experience'])):
                    
                    skills.append(Skill(
                        id=str(len(skills) + 1),
                        name=skill_name,
                        level="Intermediate"
                    ))
        
        return skills
    
    def _parse_certifications_enhanced(self, lines: List[str], sections: Dict[str, List[int]]) -> List[Certification]:
        """Enhanced certifications parsing"""
        cert_lines = self._get_section_lines(lines, sections, 'certifications')
        certifications = []
        
        for line in cert_lines:
            line = line.strip()
            if not line:
                continue
            
            # Try to parse certification with issuer and date
            parts = re.split(r'[-–|]', line)
            if len(parts) >= 2:
                cert_name = parts[0].strip()
                issuer = parts[1].strip()
                date = parts[2].strip() if len(parts) > 2 else ""
                
                # Extract date from issuer if it contains a date
                date_match = re.search(r'\b\d{4}\b', issuer)
                if date_match and not date:
                    date = date_match.group()
                    issuer = re.sub(r'\b\d{4}\b', '', issuer).strip()
                
                certifications.append(Certification(
                    id=str(len(certifications) + 1),
                    name=cert_name,
                    issuer=issuer,
                    date=date
                ))
            else:
                # Simple certification without clear structure
                certifications.append(Certification(
                    id=str(len(certifications) + 1),
                    name=line,
                    issuer="",
                    date=""
                ))
        
        return certifications
    
    def _parse_languages_enhanced(self, lines: List[str], sections: Dict[str, List[int]]) -> List[Language]:
        """Enhanced languages parsing"""
        lang_lines = self._get_section_lines(lines, sections, 'languages')
        languages = []
        
        for line in lang_lines:
            line = line.strip()
            if not line:
                continue
            
            # Pattern: Language (Proficiency) or Language - Proficiency
            patterns = [
                r'^(.+?)\s*\((.+?)\)$',
                r'^(.+?)\s*[-–]\s*(.+?)$',
                r'^(.+?)\s*:\s*(.+?)$'
            ]
            
            matched = False
            for pattern in patterns:
                lang_match = re.match(pattern, line)
                if lang_match:
                    languages.append(Language(
                        id=str(len(languages) + 1),
                        name=lang_match.group(1).strip(),
                        level=lang_match.group(2).strip()
                    ))
                    matched = True
                    break
            
            if not matched:
                # Simple language without proficiency level
                languages.append(Language(
                    id=str(len(languages) + 1),
                    name=line,
                    level=""
                ))
        
        return languages
    
    def _get_section_lines(self, lines: List[str], sections: Dict[str, List[int]], section_type: str) -> List[str]:
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

def main():
    parser = argparse.ArgumentParser(description='Enhanced LinkedIn PDF Parser')
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