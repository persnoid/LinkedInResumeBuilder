#!/usr/bin/env python3
"""
Flask API server for AI-powered PDF parsing using OpenAI GPT
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os
from ai_pdf_parser import AILinkedInPDFParser
from dataclasses import asdict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize AI parser (will check for API key)
try:
    ai_parser = AILinkedInPDFParser()
    AI_AVAILABLE = True
except ValueError as e:
    print(f"Warning: AI parsing not available - {e}")
    AI_AVAILABLE = False
    # Fallback to regex-based parser
    from pdf_parser import LinkedInPDFParser
    fallback_parser = LinkedInPDFParser()

@app.route('/api/parse-pdf', methods=['POST'])
def parse_pdf():
    try:
        # Check if file was uploaded
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        file = request.files['pdf']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'File must be a PDF'}), 400
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            tmp_path = tmp_file.name
        
        try:
            # Try AI parsing first if available
            if AI_AVAILABLE:
                try:
                    resume_data = ai_parser.parse_pdf(tmp_path)
                    parsing_method = "AI-powered"
                except Exception as ai_error:
                    print(f"AI parsing failed, falling back to regex: {ai_error}")
                    # Fallback to regex-based parsing
                    resume_data = fallback_parser.parse_pdf(tmp_path)
                    parsing_method = "Regex-based (AI fallback)"
            else:
                # Use regex-based parsing
                resume_data = fallback_parser.parse_pdf(tmp_path)
                parsing_method = "Regex-based"
            
            # Convert to dict for JSON response
            result = asdict(resume_data)
            
            return jsonify({
                'success': True,
                'data': result,
                'parsing_method': parsing_method
            })
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
                
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'service': 'AI-Powered PDF Parser API',
        'ai_available': AI_AVAILABLE,
        'openai_configured': bool(os.getenv('OPENAI_API_KEY'))
    })

@app.route('/api/config', methods=['GET'])
def get_config():
    """Get current configuration status"""
    return jsonify({
        'ai_parsing_available': AI_AVAILABLE,
        'openai_api_key_configured': bool(os.getenv('OPENAI_API_KEY')),
        'fallback_available': True
    })

if __name__ == '__main__':
    print(f"Starting PDF Parser API...")
    print(f"AI Parsing Available: {AI_AVAILABLE}")
    print(f"OpenAI API Key Configured: {bool(os.getenv('OPENAI_API_KEY'))}")
    
    if not AI_AVAILABLE:
        print("Note: Set OPENAI_API_KEY environment variable to enable AI-powered parsing")
    
    app.run(host='0.0.0.0', port=5000, debug=True)