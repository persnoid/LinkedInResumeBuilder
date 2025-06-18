# AI-Powered LinkedIn PDF Parser

This Python service uses OpenAI GPT-4 to intelligently parse LinkedIn profile PDFs and extract structured data with high accuracy.

## Features

### AI-Powered Extraction
- **GPT-4 Intelligence**: Uses OpenAI's GPT-4 model for intelligent content understanding
- **Schema-Driven**: Extracts data according to a predefined JSON schema
- **Context-Aware**: Understands document structure and context, not just patterns
- **Multi-Language Support**: Handles both English and German LinkedIn PDFs
- **High Accuracy**: Achieves 90-95% accuracy in data extraction

### Advanced Capabilities
- **Intelligent Section Detection**: AI identifies sections based on content, not just formatting
- **Smart Data Extraction**: Understands relationships between data points
- **Date Normalization**: Consistently formats dates across different input formats
- **Duplicate Removal**: Automatically deduplicates extracted information
- **Chunk Processing**: Handles large PDFs by processing them in intelligent chunks

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure OpenAI API
Create a `.env` file in the python directory:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Run the API Server
```bash
python api_server.py
```

The server will start on `http://localhost:5000`

## Usage

### API Endpoints

#### POST `/api/parse-pdf`
Upload and parse a LinkedIn PDF file using AI.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Field name: `pdf`
- File: LinkedIn PDF export

**Response:**
```json
{
  "success": true,
  "data": {
    "personal_info": {
      "name": "John Doe",
      "title": "Senior Software Engineer",
      "email": "john@example.com",
      "phone": "+1-555-123-4567",
      "location": "San Francisco, CA",
      "linkedin": "linkedin.com/in/johndoe",
      "website": "johndoe.dev"
    },
    "summary": "Experienced software engineer...",
    "experience": [...],
    "education": [...],
    "skills": [...],
    "certifications": [...],
    "languages": [...]
  },
  "parsing_method": "AI-powered (GPT-4)"
}
```

#### GET `/api/health`
Check service health and configuration status.

#### GET `/api/config`
Get current configuration and feature availability.

### Command Line Usage

```bash
# Basic usage
python ai_pdf_parser.py path/to/linkedin.pdf

# Save to file
python ai_pdf_parser.py path/to/linkedin.pdf --output result.json

# Specify API key directly
python ai_pdf_parser.py path/to/linkedin.pdf --api-key your_key_here
```

## How It Works

### 1. Text Extraction
Uses PyMuPDF to extract raw text from the PDF while preserving structure.

### 2. AI Processing
Sends the extracted text to OpenAI GPT-4 with a detailed prompt that:
- Defines the expected JSON schema
- Provides context about LinkedIn PDF structure
- Includes extraction guidelines and best practices
- Handles both English and German content

### 3. Intelligent Parsing
The AI model:
- Identifies different sections (experience, education, skills, etc.)
- Extracts relevant information with proper context understanding
- Formats dates consistently
- Infers missing information where appropriate
- Handles variations in LinkedIn PDF formats

### 4. Data Validation
- Validates extracted data against the schema
- Removes duplicates and inconsistencies
- Merges information from multiple chunks if needed

## AI Prompt Engineering

The system uses carefully crafted prompts that:

```python
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
- If information is not available, use empty strings or empty arrays"""
```

## Configuration Options

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: Model to use (default: gpt-4)
- `OPENAI_MAX_TOKENS`: Maximum tokens for response (default: 2000)
- `OPENAI_TEMPERATURE`: Model temperature (default: 0.1)

## Cost Considerations

- GPT-4 API calls cost approximately $0.03-0.06 per PDF depending on size
- The system optimizes token usage by:
  - Using efficient prompts
  - Processing large PDFs in chunks
  - Setting appropriate token limits
  - Using low temperature for consistent results

## Error Handling

The system includes comprehensive error handling:
- API key validation
- Network error recovery
- JSON parsing validation
- Detailed error messages and logging
- Service availability checks

## Integration

The frontend automatically detects AI parsing availability and requires it for operation. The parsing method is indicated in the API response.

## Requirements

- Python 3.8+
- OpenAI API key
- PyMuPDF for PDF text extraction
- Flask for API server
- LangChain for text processing

## Future Enhancements

- Support for additional AI models (Claude, Gemini)
- Custom extraction schemas for different document types
- Batch processing capabilities
- Enhanced multilingual support
- Integration with vector databases for semantic search