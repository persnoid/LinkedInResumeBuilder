#!/usr/bin/env python3
"""
AI-Powered LinkedIn PDF Parser using OpenAI GPT
Extracts structured data from LinkedIn profile PDFs using LLM intelligence
"""

import fitz  # PyMuPDF
import json
import sys
import os
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import argparse
from dotenv import load_dotenv
import openai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

# Load environment variables
load_dotenv()

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

class AILinkedInPDFParser:
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the AI-powered PDF parser"""
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass it directly.")
        
        # Initialize OpenAI client
        openai.api_key = self.api_key
        self.client = openai.OpenAI(api_key=self.api_key)
        
        # Text splitter for large documents
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=4000,
            chunk_overlap=200,
            length_function=len,
        )
        
        # JSON schema for structured extraction
        self.extraction_schema = {
            "type": "object",
            "properties": {
                "personal_info": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "description": "Full name of the person"},
                        "title": {"type": "string", "description": "Professional title or headline"},
                        "email": {"type": "string", "description": "Email address"},
                        "phone": {"type": "string", "description": "Phone number"},
                        "location": {"type": "string", "description": "Location/address"},
                        "linkedin": {"type": "string", "description": "LinkedIn profile URL"},
                        "website": {"type": "string", "description": "Personal website URL"}
                    }
                },
                "summary": {"type": "string", "description": "Professional summary or about section"},
                "experience": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "position": {"type": "string", "description": "Job title/position"},
                            "company": {"type": "string", "description": "Company name"},
                            "location": {"type": "string", "description": "Job location"},
                            "start_date": {"type": "string", "description": "Start date (format: YYYY-MM or Month YYYY)"},
                            "end_date": {"type": "string", "description": "End date (format: YYYY-MM or Month YYYY or 'Present')"},
                            "current": {"type": "boolean", "description": "Whether this is the current position"},
                            "description": {"type": "array", "items": {"type": "string"}, "description": "List of job responsibilities and achievements"}
                        }
                    }
                },
                "education": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "degree": {"type": "string", "description": "Degree name"},
                            "school": {"type": "string", "description": "School/university name"},
                            "location": {"type": "string", "description": "School location"},
                            "start_date": {"type": "string", "description": "Start date"},
                            "end_date": {"type": "string", "description": "End date"},
                            "gpa": {"type": "string", "description": "GPA if mentioned"},
                            "description": {"type": "string", "description": "Additional details"}
                        }
                    }
                },
                "skills": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Skill name"},
                            "level": {"type": "string", "enum": ["Beginner", "Intermediate", "Advanced", "Expert"], "description": "Skill proficiency level"}
                        }
                    }
                },
                "certifications": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Certification name"},
                            "issuer": {"type": "string", "description": "Issuing organization"},
                            "date": {"type": "string", "description": "Issue date"},
                            "url": {"type": "string", "description": "Certification URL if available"}
                        }
                    }
                },
                "languages": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Language name"},
                            "level": {"type": "string", "description": "Proficiency level"}
                        }
                    }
                }
            }
        }
    
    def parse_pdf(self, pdf_path: str) -> ResumeData:
        """Parse LinkedIn PDF using AI-powered extraction"""
        try:
            # Extract text from PDF
            raw_text = self._extract_text_from_pdf(pdf_path)
            
            # Use AI to extract structured data
            structured_data = self._extract_with_ai(raw_text)
            
            # Convert to ResumeData object
            return self._convert_to_resume_data(structured_data)
            
        except Exception as e:
            raise Exception(f"Error parsing PDF with AI: {str(e)}")
    
    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract raw text from PDF using PyMuPDF"""
        doc = fitz.open(pdf_path)
        text = ""
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text += page.get_text()
        
        doc.close()
        return text
    
    def _extract_with_ai(self, text: str) -> Dict[str, Any]:
        """Use OpenAI GPT to extract structured data from text"""
        
        # Create the extraction prompt
        system_prompt = """You are an expert at extracting structured information from LinkedIn profile PDFs. 
        Your task is to analyze the provided text and extract relevant information into a structured JSON format.
        
        Guidelines:
        1. Extract personal information (name, title, contact details) from the header/top section
        2. Identify and extract work experience with dates, positions, companies, and descriptions
        3. Find education information including degrees, schools, and dates
        4. Extract skills mentioned in the document
        5. Identify certifications and their issuers
        6. Find language skills if mentioned
        7. Extract the professional summary/about section
        
        Important:
        - Be accurate with dates and format them consistently
        - For current positions, mark current=true and use "Present" as end_date
        - Extract job descriptions as bullet points/list items
        - Infer skill levels as "Intermediate" if not explicitly stated
        - Handle both English and German content
        - If information is not available, use empty strings or empty arrays
        
        Return the data in the exact JSON schema format provided."""
        
        user_prompt = f"""Please extract structured resume data from this LinkedIn PDF text:

{text}

Return the data as a JSON object following this schema:
{json.dumps(self.extraction_schema, indent=2)}"""

        try:
            # Split text if it's too long
            if len(text) > 12000:  # Leave room for prompt and response
                chunks = self._split_text(text)
                extracted_data = self._extract_from_chunks(chunks)
            else:
                extracted_data = self._single_extraction(system_prompt, user_prompt)
            
            return extracted_data
            
        except Exception as e:
            raise Exception(f"AI extraction failed: {str(e)}")
    
    def _single_extraction(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        """Perform single AI extraction call"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        
        response_text = response.choices[0].message.content
        
        # Parse JSON response
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Try to extract JSON from response if it's wrapped in markdown
            import re
            json_match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(1))
            else:
                raise Exception("Failed to parse AI response as JSON")
    
    def _split_text(self, text: str) -> List[str]:
        """Split text into manageable chunks"""
        docs = [Document(page_content=text)]
        chunks = self.text_splitter.split_documents(docs)
        return [chunk.page_content for chunk in chunks]
    
    def _extract_from_chunks(self, chunks: List[str]) -> Dict[str, Any]:
        """Extract data from multiple text chunks and merge results"""
        all_results = []
        
        for i, chunk in enumerate(chunks):
            system_prompt = f"""You are extracting data from part {i+1} of {len(chunks)} of a LinkedIn PDF. 
            Extract any relevant resume information from this chunk. If this chunk doesn't contain 
            certain types of information, return empty values for those fields."""
            
            user_prompt = f"""Extract resume data from this text chunk:

{chunk}

Return as JSON following the schema structure."""
            
            try:
                result = self._single_extraction(system_prompt, user_prompt)
                all_results.append(result)
            except Exception as e:
                print(f"Warning: Failed to extract from chunk {i+1}: {e}")
                continue
        
        # Merge results from all chunks
        return self._merge_extraction_results(all_results)
    
    def _merge_extraction_results(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Merge extraction results from multiple chunks"""
        merged = {
            "personal_info": {},
            "summary": "",
            "experience": [],
            "education": [],
            "skills": [],
            "certifications": [],
            "languages": []
        }
        
        for result in results:
            if not result:
                continue
            
            # Merge personal info (take first non-empty values)
            if "personal_info" in result:
                for key, value in result["personal_info"].items():
                    if value and not merged["personal_info"].get(key):
                        merged["personal_info"][key] = value
            
            # Merge summary (take longest one)
            if result.get("summary") and len(result["summary"]) > len(merged["summary"]):
                merged["summary"] = result["summary"]
            
            # Merge arrays (combine and deduplicate)
            for array_field in ["experience", "education", "skills", "certifications", "languages"]:
                if array_field in result and result[array_field]:
                    merged[array_field].extend(result[array_field])
        
        # Deduplicate arrays
        merged["skills"] = self._deduplicate_skills(merged["skills"])
        merged["experience"] = self._deduplicate_experience(merged["experience"])
        merged["education"] = self._deduplicate_education(merged["education"])
        merged["certifications"] = self._deduplicate_certifications(merged["certifications"])
        merged["languages"] = self._deduplicate_languages(merged["languages"])
        
        return merged
    
    def _deduplicate_skills(self, skills: List[Dict]) -> List[Dict]:
        """Remove duplicate skills"""
        seen = set()
        unique_skills = []
        for skill in skills:
            if skill.get("name") and skill["name"].lower() not in seen:
                seen.add(skill["name"].lower())
                unique_skills.append(skill)
        return unique_skills
    
    def _deduplicate_experience(self, experiences: List[Dict]) -> List[Dict]:
        """Remove duplicate experience entries"""
        seen = set()
        unique_exp = []
        for exp in experiences:
            key = (exp.get("position", ""), exp.get("company", ""), exp.get("start_date", ""))
            if key not in seen and any(key):
                seen.add(key)
                unique_exp.append(exp)
        return unique_exp
    
    def _deduplicate_education(self, education: List[Dict]) -> List[Dict]:
        """Remove duplicate education entries"""
        seen = set()
        unique_edu = []
        for edu in education:
            key = (edu.get("degree", ""), edu.get("school", ""))
            if key not in seen and any(key):
                seen.add(key)
                unique_edu.append(edu)
        return unique_edu
    
    def _deduplicate_certifications(self, certifications: List[Dict]) -> List[Dict]:
        """Remove duplicate certifications"""
        seen = set()
        unique_certs = []
        for cert in certifications:
            key = (cert.get("name", ""), cert.get("issuer", ""))
            if key not in seen and any(key):
                seen.add(key)
                unique_certs.append(cert)
        return unique_certs
    
    def _deduplicate_languages(self, languages: List[Dict]) -> List[Dict]:
        """Remove duplicate languages"""
        seen = set()
        unique_langs = []
        for lang in languages:
            if lang.get("name") and lang["name"].lower() not in seen:
                seen.add(lang["name"].lower())
                unique_langs.append(lang)
        return unique_langs
    
    def _convert_to_resume_data(self, data: Dict[str, Any]) -> ResumeData:
        """Convert AI-extracted data to ResumeData object"""
        
        # Convert personal info
        personal_info = PersonalInfo(
            name=data.get("personal_info", {}).get("name", ""),
            title=data.get("personal_info", {}).get("title", ""),
            email=data.get("personal_info", {}).get("email", ""),
            phone=data.get("personal_info", {}).get("phone", ""),
            location=data.get("personal_info", {}).get("location", ""),
            linkedin=data.get("personal_info", {}).get("linkedin", ""),
            website=data.get("personal_info", {}).get("website", "")
        )
        
        # Convert experience
        experience = []
        for i, exp in enumerate(data.get("experience", [])):
            experience.append(Experience(
                id=str(i + 1),
                position=exp.get("position", ""),
                company=exp.get("company", ""),
                location=exp.get("location", ""),
                start_date=exp.get("start_date", ""),
                end_date=exp.get("end_date", ""),
                current=exp.get("current", False),
                description=exp.get("description", [])
            ))
        
        # Convert education
        education = []
        for i, edu in enumerate(data.get("education", [])):
            education.append(Education(
                id=str(i + 1),
                degree=edu.get("degree", ""),
                school=edu.get("school", ""),
                location=edu.get("location", ""),
                start_date=edu.get("start_date", ""),
                end_date=edu.get("end_date", ""),
                gpa=edu.get("gpa", ""),
                description=edu.get("description", "")
            ))
        
        # Convert skills
        skills = []
        for i, skill in enumerate(data.get("skills", [])):
            skills.append(Skill(
                id=str(i + 1),
                name=skill.get("name", ""),
                level=skill.get("level", "Intermediate")
            ))
        
        # Convert certifications
        certifications = []
        for i, cert in enumerate(data.get("certifications", [])):
            certifications.append(Certification(
                id=str(i + 1),
                name=cert.get("name", ""),
                issuer=cert.get("issuer", ""),
                date=cert.get("date", ""),
                url=cert.get("url", "")
            ))
        
        # Convert languages
        languages = []
        for i, lang in enumerate(data.get("languages", [])):
            languages.append(Language(
                id=str(i + 1),
                name=lang.get("name", ""),
                level=lang.get("level", "")
            ))
        
        return ResumeData(
            personal_info=personal_info,
            summary=data.get("summary", ""),
            experience=experience,
            education=education,
            skills=skills,
            certifications=certifications,
            languages=languages
        )

def main():
    parser = argparse.ArgumentParser(description='AI-Powered LinkedIn PDF Parser')
    parser.add_argument('pdf_path', help='Path to PDF file')
    parser.add_argument('--output', '-o', help='Output JSON file path')
    parser.add_argument('--api-key', help='OpenAI API key (or set OPENAI_API_KEY env var)')
    
    args = parser.parse_args()
    
    try:
        pdf_parser = AILinkedInPDFParser(api_key=args.api_key)
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