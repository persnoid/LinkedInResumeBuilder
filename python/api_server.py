#!/usr/bin/env python3
"""
Flask API server for PDF parsing using PyMuPDF
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os
from pdf_parser import LinkedInPDFParser
from dataclasses import asdict

app = Flask(__name__)
CORS(app)

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
            # Parse the PDF
            parser = LinkedInPDFParser()
            resume_data = parser.parse_pdf(tmp_path)
            
            # Convert to dict for JSON response
            result = asdict(resume_data)
            
            return jsonify({
                'success': True,
                'data': result
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
    return jsonify({'status': 'healthy', 'service': 'PDF Parser API'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)