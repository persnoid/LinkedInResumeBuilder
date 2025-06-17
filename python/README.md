# LinkedIn PDF Parser with PyMuPDF

This Python service uses PyMuPDF (fitz) to parse LinkedIn profile PDFs and extract structured data.

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
- Returns structured JSON data

### Command Line

```bash
python pdf_parser.py path/to/linkedin.pdf --output result.json
```

## Features

- **Advanced Text Extraction**: Uses PyMuPDF's precise text positioning
- **Section Detection**: Automatically identifies LinkedIn profile sections
- **Structured Output**: Returns data in consistent JSON format
- **Robust Parsing**: Handles various LinkedIn PDF formats
- **Fallback Support**: Frontend falls back to client-side parsing if service unavailable

## Supported Sections

- Personal Information (name, email, phone, location, LinkedIn URL)
- Professional Summary
- Work Experience (with dates, positions, companies, descriptions)
- Education (degrees, schools, dates)
- Skills (with proficiency levels)
- Certifications
- Languages

## Docker Support (Optional)

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

The frontend automatically sends PDF files to this service and falls back to client-side parsing if the service is unavailable.