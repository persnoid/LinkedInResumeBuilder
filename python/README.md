# Enhanced LinkedIn PDF Parser with PyMuPDF

This Python service uses PyMuPDF (fitz) to parse LinkedIn profile PDFs with enhanced extraction capabilities based on OpenAI recommendations.

## Key Improvements

### Enhanced PDF Parsing
- **Better Text Extraction**: Uses PyMuPDF's detailed text positioning and formatting information
- **Font Analysis**: Leverages font size, bold formatting, and positioning to identify section headers
- **Multi-language Support**: Supports both English and German LinkedIn PDFs
- **Improved Pattern Recognition**: Enhanced regex patterns for better data extraction

### Smart Section Detection
- **Formatting-based Detection**: Uses font size and bold text to identify section headers
- **Flexible Matching**: Handles variations in section naming and formatting
- **Position-aware Parsing**: Considers text positioning for better structure recognition

### Advanced Data Extraction
- **Personal Information**: Enhanced name, title, and contact extraction from PDF header
- **Experience Parsing**: Better job title, company, and date range detection
- **Skills Processing**: Improved skill separation and filtering
- **Education & Certifications**: More robust parsing of academic and professional credentials

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the API server:
```bash
python api_server.py
```

The server will start on `http://localhost:5000`

## Usage

### API Endpoint

**POST** `/api/parse-pdf`
- Upload a PDF file using multipart/form-data
- Field name: `pdf`
- Returns structured JSON data with enhanced extraction

### Command Line

```bash
python pdf_parser.py path/to/linkedin.pdf --output result.json
```

## Features

### Core Capabilities
- **Advanced Text Extraction**: Uses PyMuPDF's precise text positioning and font information
- **Intelligent Section Detection**: Automatically identifies LinkedIn profile sections using formatting cues
- **Multi-format Support**: Handles various LinkedIn PDF export formats and layouts
- **Robust Data Parsing**: Enhanced parsing logic for experience, education, skills, and certifications
- **Fallback Support**: Frontend gracefully falls back to client-side parsing if service unavailable

### Supported Sections
- **Personal Information**: Name, title, email, phone, location, LinkedIn URL, website
- **Professional Summary**: Complete summary/about section
- **Work Experience**: Position, company, location, dates, job descriptions
- **Education**: Degrees, schools, dates, GPA, additional details
- **Skills**: Technical and soft skills with proficiency levels
- **Certifications**: Professional certifications with issuers and dates
- **Languages**: Language skills with proficiency levels

### Enhanced Pattern Recognition
- **Date Parsing**: Flexible date range detection (various formats)
- **Contact Information**: Improved email, phone, and URL extraction
- **Location Detection**: Smart location identification and validation
- **Job Title Recognition**: Better job position and company name extraction

## Technical Implementation

### PyMuPDF Integration
```python
# Enhanced text extraction with formatting
text_dict = page.get_text("dict")
for block in text_dict["blocks"]:
    # Extract text with font size, bold formatting, and positioning
    font_info = {
        'font': span.get('font', ''),
        'size': span.get('size', 12),
        'flags': span.get('flags', 0),  # Bold, italic flags
        'color': span.get('color', 0)
    }
```

### Smart Section Detection
```python
# Use formatting cues to identify headers
is_potential_header = (
    block['is_bold'] or 
    block['font_size'] > 12 or
    line.isupper() or
    line.endswith(':')
)
```

### Pattern-based Extraction
```python
# Enhanced regex patterns for better data extraction
linkedin_patterns = {
    'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    'phone': r'[\+]?[\d\s\-\(\)]{10,}',
    'date_range': r'(\w+\s+\d{4}|\d{4})\s*[-–]\s*(\w+\s+\d{4}|\d{4}|Present|Current)',
    'linkedin_url': r'linkedin\.com/in/[^\s]+',
}
```

## Future Enhancements

### AI-Powered Extraction (Planned)
Based on OpenAI recommendations, future versions could integrate:

```python
# Potential LangChain integration for AI-powered parsing
from langchain.document_loaders import PyMuPDFLoader
from langchain.llms import OpenAI
from langchain.chains import create_extraction_chain

# AI-enhanced extraction for complex layouts
llm = OpenAI(api_key="your_api_key")
chain = create_extraction_chain(schema, llm)
enhanced_data = chain.run(pdf_content)
```

## Docker Support

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "api_server.py"]
```

## Integration

The frontend automatically sends PDF files to this enhanced service and falls back to client-side parsing if the service is unavailable. The improved parsing logic provides significantly better extraction accuracy for LinkedIn-exported PDFs.