# Parse PDF 
from PyPDF2 import PdfReader
from docx import Document
import os

def parse_document(path, file_id=1):
    """
    Parse either PDF or DOCX files based on file extension
    """
    file_extension = os.path.splitext(path)[1].lower()
    chunks = []
    
    if file_extension == '.pdf':
        chunks = parse_pdf(path, file_id)
    elif file_extension == '.docx':
        chunks = parse_docx(path, file_id)
    else:
        raise ValueError(f"Unsupported file format: {file_extension}. Only PDF and DOCX files are supported.")
    
    return chunks

def parse_pdf(path, file_id=1):
    """Parse PDF files using PyPDF2"""
    reader = PdfReader(path)
    chunks = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        chunks.append({"file_id": file_id, "page": i, "text": text})
    return chunks

def parse_docx(path, file_id=1):
    """Parse DOCX files using python-docx"""
    doc = Document(path)
    chunks = []
    
    # Extract text from all paragraphs
    full_text = []
    for paragraph in doc.paragraphs:
        if paragraph.text.strip():  # Only add non-empty paragraphs
            full_text.append(paragraph.text)
    
    # Combine all text and create a single chunk (or you can split by paragraphs)
    combined_text = '\n'.join(full_text)
    chunks.append({"file_id": file_id, "page": 0, "text": combined_text})
    
    return chunks
