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

# Initialize AI parser
try:
    ai_parser = AILinkedInPDFParser()
    AI_AVAILABLE = True
    print("✅ AI-powered parsing initialized successfully")
except ValueError as e:
    print(f"❌ AI parsing not available - {e}")
    AI_AVAILABLE = False
    ai_parser = None

@app.route('/api/parse-pdf', methods=['POST'])
def parse_pdf():
    try:
        # Check if AI parsing is available
        if not AI_AVAILABLE:
            return jsonify({
                'success': False,
                'error': 'AI parsing service is not available. Please configure your OpenAI API key.'
            }), 503
        
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
            # Parse using AI
            resume_data = ai_parser.parse_pdf(tmp_path)
            
            # Convert to dict for JSON response
            result = asdict(resume_data)
            
            return jsonify({
                'success': True,
                'data': result,
                'parsing_method': 'AI-powered (GPT-4)'
            })
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
                
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'AI parsing failed: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy' if AI_AVAILABLE else 'degraded', 
        'service': 'AI-Powered PDF Parser API',
        'ai_available': AI_AVAILABLE,
        'openai_configured': bool(os.getenv('OPENAI_API_KEY')),
        'parsing_method': 'AI-powered (GPT-4)' if AI_AVAILABLE else 'Service unavailable'
    })

@app.route('/api/config', methods=['GET'])
def get_config():
    """Get current configuration status"""
    return jsonify({
        'ai_parsing_available': AI_AVAILABLE,
        'openai_api_key_configured': bool(os.getenv('OPENAI_API_KEY')),
        'service_status': 'ready' if AI_AVAILABLE else 'configuration_required',
        'required_setup': [] if AI_AVAILABLE else ['Set OPENAI_API_KEY environment variable']
    })

if __name__ == '__main__':
    print(f"🚀 Starting AI-Powered PDF Parser API...")
    print(f"🤖 AI Parsing Available: {AI_AVAILABLE}")
    print(f"🔑 OpenAI API Key Configured: {bool(os.getenv('OPENAI_API_KEY'))}")
    
    if not AI_AVAILABLE:
        print("⚠️  AI parsing is disabled. Set OPENAI_API_KEY environment variable to enable.")
        print("📝 Create a .env file with: OPENAI_API_KEY=your_api_key_here")
    else:
        print("✨ AI-powered parsing ready! Upload LinkedIn PDFs for intelligent extraction.")
    
    app.run(host='0.0.0.0', port=5000, debug=True)