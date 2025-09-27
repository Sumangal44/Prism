# Prism Backend Development Guide

A comprehensive guide to building the backend for the Prism Multimodal Retrieval-Augmented Generation (RAG) System.

## Table of Contents

1. [Overview](#overview)
2. [Learning Prerequisites](#learning-prerequisites)
3. [Technical Requirements](#technical-requirements)
4. [Architecture](#architecture)
5. [Prerequisites](#prerequisites)
6. [Project Setup](#project-setup)
7. [Core Components](#core-components)
8. [Implementation Guide](#implementation-guide)
9. [API Endpoints](#api-endpoints)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Performance Optimization](#performance-optimization)

## Overview

The Prism backend is an offline-first multimodal RAG system that processes documents (PDF, DOCX), images, and audio files to enable semantic search across all content types. The system extracts text from various formats, creates embeddings, stores them in a vector database, and provides LLM-powered responses with citations.

### Key Features to Implement

- **Multimodal Ingestion**: PDF/DOCX parsing, OCR for images, speech-to-text for audio
- **Semantic Indexing**: Convert all content into embeddings in a shared vector space
- **Cross-Modal Retrieval**: Search across text, images, and audio seamlessly
- **Grounded LLM Responses**: Generate answers with numbered citations
- **Offline Operation**: No cloud dependencies, complete privacy
- **Real-time Processing**: Live updates during file processing

## Learning Prerequisites

### 🎓 **Essential Knowledge Areas**

To successfully build the Prism backend, you need to master several key areas. Here's a structured learning path:

#### **1. Python Programming (Intermediate to Advanced)**

**Core Python Concepts:**
- **Object-Oriented Programming**: Classes, inheritance, polymorphism
- **Async Programming**: `async/await`, `asyncio`, coroutines
- **Error Handling**: Exception handling, custom exceptions
- **File I/O**: Working with files, paths, binary data
- **Data Structures**: Lists, dictionaries, sets, tuples
- **Decorators and Context Managers**: For middleware and resource management

**Learning Resources:**
- [Python Official Tutorial](https://docs.python.org/3/tutorial/)
- [Async/Await in Python](https://realpython.com/async-io-python/)
- [Python OOP Concepts](https://realpython.com/python3-object-oriented-programming/)

**Time Investment:** 2-3 weeks if new to Python, 1 week for review

#### **2. Web Development with FastAPI**

**FastAPI Fundamentals:**
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Request/Response Models**: Pydantic schemas
- **Dependency Injection**: Database sessions, authentication
- **Middleware**: CORS, rate limiting, logging
- **WebSockets**: Real-time communication
- **File Uploads**: Handling multipart/form-data
- **API Documentation**: Automatic OpenAPI/Swagger docs

**Key Topics to Master:**
```python
# Path parameters and query parameters
@app.get("/files/{file_id}")
async def get_file(file_id: int, include_content: bool = False):
    pass

# Request models with validation
class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    limit: int = Field(10, ge=1, le=100)

# Dependency injection
async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Background tasks
from fastapi import BackgroundTasks

@app.post("/process")
async def process_file(background_tasks: BackgroundTasks):
    background_tasks.add_task(process_file_async, file_id)
```

**Learning Resources:**
- [FastAPI Official Documentation](https://fastapi.tiangolo.com/)
- [FastAPI Tutorial Series](https://testdriven.io/blog/fastapi-crud/)
- [Building APIs with FastAPI](https://realpython.com/fastapi-python-web-apis/)

**Time Investment:** 1-2 weeks

#### **3. Database Management**

**SQLAlchemy ORM:**
- **Models and Relationships**: Defining database schemas
- **Queries**: SELECT, INSERT, UPDATE, DELETE operations
- **Migrations**: Using Alembic for schema changes
- **Connection Pooling**: Managing database connections
- **Transactions**: ACID properties and rollbacks

**Essential Concepts:**
```python
# Model definition
class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    chunks = relationship("DocumentChunk", back_populates="document")

# Queries
def get_documents_by_user(db: Session, user_id: int):
    return db.query(Document).filter(Document.user_id == user_id).all()

# Transactions
def create_document_with_chunks(db: Session, doc_data: dict, chunks: list):
    try:
        doc = Document(**doc_data)
        db.add(doc)
        db.commit()
        
        for chunk_data in chunks:
            chunk = DocumentChunk(document_id=doc.id, **chunk_data)
            db.add(chunk)
        
        db.commit()
        return doc
    except Exception:
        db.rollback()
        raise
```

**Learning Resources:**
- [SQLAlchemy Tutorial](https://docs.sqlalchemy.org/en/14/tutorial/)
- [FastAPI with SQLAlchemy](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [Database Design Principles](https://www.freecodecamp.org/news/database-design-course-for-beginners/)

**Time Investment:** 1-2 weeks

#### **4. Machine Learning and AI**

**Natural Language Processing (NLP):**
- **Text Preprocessing**: Tokenization, normalization, cleaning
- **Embeddings**: Word embeddings, sentence embeddings, transformers
- **Semantic Similarity**: Cosine similarity, vector operations
- **Text Chunking**: Semantic vs. fixed-size chunking strategies

**Computer Vision:**
- **Image Processing**: PIL/Pillow, OpenCV basics
- **OCR (Optical Character Recognition)**: Tesseract, preprocessing techniques
- **Image Embeddings**: CLIP models for image-text alignment

**Audio Processing:**
- **Speech Recognition**: Whisper, wav2vec2
- **Audio Features**: MFCC, spectrograms, audio preprocessing
- **Audio Segmentation**: Voice activity detection, silence removal

**Vector Databases:**
- **FAISS**: Similarity search, indexing strategies
- **Vector Operations**: Dot product, cosine similarity, L2 distance
- **Approximate Nearest Neighbors**: Performance vs. accuracy tradeoffs

**Key Libraries to Learn:**
```python
# Embeddings
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(texts)

# Image processing
from PIL import Image
import pytesseract
text = pytesseract.image_to_string(image)

# Audio processing
import whisper
model = whisper.load_model("base")
result = model.transcribe("audio.mp3")

# Vector search
import faiss
index = faiss.IndexFlatL2(384)  # 384-dimensional vectors
index.add(embeddings)
distances, indices = index.search(query_embedding, k=10)
```

**Learning Resources:**
- [Hugging Face Transformers Course](https://huggingface.co/course/chapter1/1)
- [Sentence Transformers Documentation](https://www.sbert.net/)
- [OpenCV Python Tutorial](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)
- [FAISS Wiki](https://github.com/facebookresearch/faiss/wiki)
- [Speech Recognition with Python](https://realpython.com/python-speech-recognition/)

**Time Investment:** 3-4 weeks (most complex area)

#### **5. DevOps and System Administration**

**Containerization:**
- **Docker**: Creating containers, Dockerfile, docker-compose
- **Container Orchestration**: Basic Kubernetes (optional)

**Process Management:**
- **Background Tasks**: Celery, async tasks
- **Process Monitoring**: systemd, supervisor
- **Resource Management**: Memory limits, CPU allocation

**Security:**
- **Input Validation**: Preventing injection attacks
- **File Security**: Validating uploads, sandboxing
- **Rate Limiting**: Preventing abuse
- **Authentication**: JWT tokens, API keys (if needed)

**Learning Resources:**
- [Docker Official Tutorial](https://docs.docker.com/get-started/)
- [Linux System Administration](https://linuxjourney.com/)
- [Web Security Fundamentals](https://developer.mozilla.org/en-US/docs/Web/Security)

**Time Investment:** 2-3 weeks

### 📚 **Recommended Learning Order**

**Phase 1 (Weeks 1-2): Foundation**
1. **Python fundamentals** (if needed)
2. **FastAPI basics** - Build simple REST APIs
3. **SQLAlchemy basics** - Create models and simple queries

**Phase 2 (Weeks 3-4): Core Skills**
1. **Advanced FastAPI** - File uploads, WebSockets, middleware
2. **Database design** - Complex relationships, migrations
3. **Basic ML concepts** - Embeddings, similarity search

**Phase 3 (Weeks 5-7): Specialized Knowledge**
1. **Document processing** - PDF parsing, text extraction
2. **Image processing** - OCR, computer vision basics
3. **Audio processing** - Speech recognition, audio features
4. **Vector databases** - FAISS, similarity search optimization

**Phase 4 (Weeks 8-9): Integration & Deployment**
1. **System integration** - Connecting all components
2. **Testing strategies** - Unit tests, integration tests
3. **Deployment** - Docker, production setup
4. **Monitoring** - Logging, performance metrics

### 🛠 **Hands-on Practice Projects**

**Before building Prism, practice with these smaller projects:**

**1. Simple Document API (Week 2)**
```python
# Build a basic API that can:
# - Upload PDF files
# - Extract text content
# - Store in database
# - Search by keywords
```

**2. Image OCR Service (Week 4)**
```python
# Create a service that:
# - Accepts image uploads
# - Extracts text using OCR
# - Returns structured results
# - Handles different image formats
```

**3. Audio Transcription API (Week 6)**
```python
# Build an API that:
# - Processes audio files
# - Generates transcriptions
# - Provides timestamp alignment
# - Supports multiple audio formats
```

**4. Simple RAG System (Week 7)**
```python
# Combine everything into:
# - Multi-format file processing
# - Vector embeddings and search
# - Basic question answering
# - Citation generation
```

### 📖 **Essential Reading List**

**Books:**
1. **"Effective Python" by Brett Slatkin** - Advanced Python techniques
2. **"Building Machine Learning Powered Applications" by Emmanuel Ameisen** - ML system design
3. **"Designing Data-Intensive Applications" by Martin Kleppmann** - System architecture
4. **"Speech and Language Processing" by Jurafsky & Martin** - NLP fundamentals

**Research Papers:**
1. **"Attention Is All You Need"** - Understanding Transformers
2. **"CLIP: Learning Transferable Visual Representations"** - Multimodal embeddings
3. **"Retrieval-Augmented Generation"** - RAG methodology
4. **"Dense Passage Retrieval"** - Semantic search techniques

### 🎯 **Success Criteria**

**By the end of your learning journey, you should be able to:**

✅ **Backend Development:**
- Build REST APIs with FastAPI
- Handle file uploads and processing
- Implement database operations
- Create async processing pipelines

✅ **Machine Learning Integration:**
- Generate text embeddings
- Perform similarity searches
- Process images with OCR
- Transcribe audio to text

✅ **System Design:**
- Design scalable architectures
- Implement error handling
- Set up monitoring and logging
- Deploy production systems

✅ **Troubleshooting:**
- Debug performance issues
- Handle memory management
- Optimize database queries
- Monitor system health

## Technical Requirements

### 💻 **Hardware Requirements**

**Minimum Requirements:**
- **CPU**: 4 cores, 2.0 GHz+
- **RAM**: 8GB (16GB recommended)
- **Storage**: 20GB free space (SSD preferred)
- **Network**: Stable internet for model downloads

**Recommended Requirements:**
- **CPU**: 8+ cores, 3.0 GHz+
- **RAM**: 16GB+ (32GB for large datasets)
- **Storage**: 50GB+ free space (NVMe SSD)
- **GPU**: NVIDIA GPU with 6GB+ VRAM (optional, for faster inference)

**Development Environment:**
- **Operating System**: Linux (Ubuntu 20.04+), macOS 11+, or Windows 10/11
- **Python**: 3.9+ (3.10 recommended)
- **Package Manager**: pip, conda (optional)
- **Version Control**: Git
- **IDE**: VS Code, PyCharm, or similar

### 🌐 **Software Dependencies**

**System-level Dependencies:**
```bash
# Ubuntu/Debian
sudo apt-get install tesseract-ocr ffmpeg build-essential python3-dev

# macOS
brew install tesseract ffmpeg

# Windows
# Download and install:
# - Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
# - FFmpeg: https://ffmpeg.org/download.html
# - Visual Studio Build Tools
```

**Python Libraries (Production):**
```txt
# Web Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
websockets==12.0

# Machine Learning
torch==2.1.1
transformers==4.35.2
sentence-transformers==2.2.2
faiss-cpu==1.7.4
numpy==1.24.3

# Document Processing
PyMuPDF==1.23.8
python-docx==1.1.0
pytesseract==0.3.10

# Audio Processing
openai-whisper==20231117
librosa==0.10.1
pydub==0.25.1

# Image Processing
Pillow==10.1.0
opencv-python==4.8.1.78

# Database
sqlalchemy==2.0.23
alembic==1.12.1
sqlite3  # Built into Python
```

**Development Dependencies:**
```txt
# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2  # For testing FastAPI

# Code Quality
black==23.11.0
flake8==6.1.0
mypy==1.7.1
pre-commit==3.6.0

# Documentation
mkdocs==1.5.3
mkdocs-material==9.4.8

# Monitoring
prometheus-client==0.19.0
structlog==23.2.0
```

### ⏱️ **Time Investment Breakdown**

**Total Learning Time: 8-12 weeks** (depending on prior experience)

| Phase | Duration | Focus Areas | Deliverables |
|-------|----------|-------------|--------------|
| **Foundation** | 2-3 weeks | Python, FastAPI, SQLAlchemy | Simple REST API with database |
| **Core ML** | 2-3 weeks | Embeddings, Vector Search, NLP basics | Document search API |
| **Multimodal** | 3-4 weeks | OCR, Speech Recognition, Image Processing | Multi-format processing pipeline |
| **Integration** | 2-3 weeks | System design, Testing, Deployment | Full RAG system |

**Daily Time Commitment:**
- **Part-time**: 2-3 hours/day (12-16 weeks total)
- **Full-time**: 6-8 hours/day (6-8 weeks total)
- **Weekend warrior**: 8-12 hours/weekend (16-20 weeks total)

### 🎓 **Skill Level Assessment**

**Beginner (No prior experience):**
- Start with Python fundamentals
- Focus on basic web development
- Allow 12-16 weeks for completion
- Consider taking online courses

**Intermediate (Some Python/Web experience):**
- Jump to FastAPI and databases
- Focus on ML concepts and libraries
- Allow 8-12 weeks for completion
- Build practice projects

**Advanced (ML/Backend experience):**
- Focus on multimodal processing
- Emphasize system design and optimization
- Allow 6-8 weeks for completion
- Contribute to open source projects

### 🔧 **Development Setup Checklist**

**Before You Start:**

✅ **Environment Setup:**
- [ ] Install Python 3.9+
- [ ] Set up virtual environment
- [ ] Install system dependencies (Tesseract, FFmpeg)
- [ ] Configure IDE with Python extensions
- [ ] Set up Git repository

✅ **Learning Resources:**
- [ ] Bookmark documentation links
- [ ] Set up practice environment
- [ ] Join relevant communities (Reddit, Discord, Stack Overflow)
- [ ] Follow ML/AI newsletters and blogs

✅ **Hardware Check:**
- [ ] Verify RAM requirements (8GB minimum)
- [ ] Check available storage (20GB+)
- [ ] Test GPU setup (if available)
- [ ] Ensure stable internet for downloads

✅ **Knowledge Validation:**
- [ ] Complete Python basics assessment
- [ ] Build a simple FastAPI application
- [ ] Test database operations
- [ ] Experiment with ML libraries

### 💡 **Pro Tips for Success**

**1. Start Small, Build Up:**
```python
# Week 1: Simple file upload
@app.post("/upload")
async def upload_file(file: UploadFile):
    return {"filename": file.filename}

# Week 4: With processing
@app.post("/upload")
async def upload_file(file: UploadFile, background_tasks: BackgroundTasks):
    background_tasks.add_task(process_file, file)
    return {"status": "processing"}

# Week 8: Full pipeline
@app.post("/upload")
async def upload_file(file: UploadFile, db: Session = Depends(get_db)):
    # Validation, processing, embedding, storage
    return ProcessingResult(...)
```

**2. Learn by Doing:**
- Build each component separately first
- Test with small datasets
- Add complexity gradually
- Document your learning process

**3. Use Existing Tools:**
- Don't reinvent the wheel
- Leverage pre-trained models
- Use established libraries
- Learn from open source projects

**4. Community Learning:**
- Join ML/AI Discord servers
- Participate in hackathons
- Contribute to open source
- Ask questions on Stack Overflow

**5. Practical Experience:**
- Work with real data
- Handle edge cases
- Optimize for performance
- Deploy to production environment

This comprehensive learning plan will prepare you to successfully build the Prism multimodal RAG system. Take your time with each phase, and don't hesitate to revisit concepts as needed!

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Processing    │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Pipeline      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Vector DB     │    │   File Storage  │
                       │   (FAISS)       │    │   (Local FS)    │
                       └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Local LLM     │
                       │   (Llama/Mistral)│
                       └─────────────────┘
```

## Prerequisites

### Required Software

- **Python 3.9+** - Core runtime
- **Tesseract OCR** - Image text extraction
- **FFmpeg** - Audio processing (optional)
- **Git** - Version control

### Hardware Recommendations

- **Minimum**: 8GB RAM, 4GB free disk space
- **Recommended**: 16GB+ RAM, 10GB+ free disk space, GPU (optional for faster inference)
- **Storage**: SSD recommended for better performance

## Project Setup

### 1. Initialize Project Structure

```bash
# Create project structure
mkdir prism-backend
cd prism-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Create directory structure
mkdir -p {src/{api,core,models,utils},data/{uploads,processed,vectors},config,tests,docs}
```

### 2. Install Dependencies

Create `requirements.txt`:

```txt
# Web Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
websockets==12.0

# Document Processing
PyMuPDF==1.23.8          # PDF processing
python-docx==1.1.0       # DOCX processing
Pillow==10.1.0           # Image processing
pytesseract==0.3.10      # OCR

# Audio Processing
openai-whisper==20231117  # Speech-to-text
pydub==0.25.1            # Audio manipulation
librosa==0.10.1          # Audio analysis

# ML/AI Libraries
sentence-transformers==2.2.2  # Text embeddings
transformers==4.35.2          # LLM models
torch==2.1.1                  # PyTorch
faiss-cpu==1.7.4             # Vector database
clip-by-openai==1.0          # Image-text embeddings

# Database & Storage
sqlite3                       # Metadata storage
sqlalchemy==2.0.23           # ORM
alembic==1.12.1              # Database migrations

# Utilities
python-dotenv==1.0.0         # Environment variables
pydantic==2.5.0              # Data validation
click==8.1.7                 # CLI tools
tqdm==4.66.1                 # Progress bars
numpy==1.24.3                # Numerical computing
pandas==2.1.3               # Data manipulation

# Development
pytest==7.4.3               # Testing
black==23.11.0               # Code formatting
flake8==6.1.0                # Linting
pre-commit==3.6.0            # Git hooks
```

### 3. Install System Dependencies

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr ffmpeg
```

#### macOS:
```bash
brew install tesseract ffmpeg
```

#### Windows:
```bash
# Install Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
# Install FFmpeg from: https://ffmpeg.org/download.html
```

### 4. Install Python Dependencies

```bash
pip install -r requirements.txt
```

## Core Components

### 1. Configuration Management (`config/settings.py`)

```python
from pydantic_settings import BaseSettings
from pathlib import Path
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Prism RAG System"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Paths
    BASE_DIR: Path = Path(__file__).parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    UPLOAD_DIR: Path = DATA_DIR / "uploads"
    PROCESSED_DIR: Path = DATA_DIR / "processed"
    VECTOR_DIR: Path = DATA_DIR / "vectors"
    
    # Database
    DATABASE_URL: str = f"sqlite:///{DATA_DIR}/prism.db"
    
    # Processing
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 50
    
    # Models
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    LLM_MODEL: str = "microsoft/DialoGPT-medium"
    OCR_LANGUAGE: str = "eng"
    
    # Vector Database
    VECTOR_DIM: int = 384
    FAISS_INDEX_TYPE: str = "Flat"
    
    # API
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000
    CORS_ORIGINS: list = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 2. Database Models (`src/models/database.py`)

```python
from sqlalchemy import Column, Integer, String, DateTime, Float, Text, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime
from config.settings import settings

Base = declarative_base()

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    original_name = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    upload_time = Column(DateTime, default=datetime.utcnow)
    processed = Column(Integer, default=0)  # 0=pending, 1=processing, 2=completed, 3=failed
    file_path = Column(String)
    checksum = Column(String, index=True)

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, index=True)
    chunk_text = Column(Text)
    chunk_index = Column(Integer)
    page_number = Column(Integer, nullable=True)
    start_char = Column(Integer, nullable=True)
    end_char = Column(Integer, nullable=True)
    embedding_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ImageChunk(Base):
    __tablename__ = "image_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, index=True)
    ocr_text = Column(Text)
    bounding_boxes = Column(Text)  # JSON string
    image_embedding = Column(LargeBinary)
    embedding_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AudioChunk(Base):
    __tablename__ = "audio_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, index=True)
    transcript_text = Column(Text)
    start_timestamp = Column(Float)
    end_timestamp = Column(Float)
    confidence_score = Column(Float)
    embedding_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SearchHistory(Base):
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text)
    results_count = Column(Integer)
    search_time = Column(DateTime, default=datetime.utcnow)
    response_time_ms = Column(Float)

# Database setup
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 3. File Processing Pipeline (`src/core/processors/`)

#### Document Processor (`document_processor.py`)

```python
import PyMuPDF  # fitz
from docx import Document
from pathlib import Path
from typing import List, Dict, Any
import hashlib
import json

class DocumentProcessor:
    def __init__(self):
        self.supported_formats = ['.pdf', '.docx']
    
    def process_file(self, file_path: Path) -> Dict[str, Any]:
        """Process document and extract text with metadata."""
        if file_path.suffix.lower() == '.pdf':
            return self._process_pdf(file_path)
        elif file_path.suffix.lower() == '.docx':
            return self._process_docx(file_path)
        else:
            raise ValueError(f"Unsupported format: {file_path.suffix}")
    
    def _process_pdf(self, file_path: Path) -> Dict[str, Any]:
        """Extract text from PDF with page information."""
        doc = PyMuPDF.open(file_path)
        pages = []
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text()
            
            # Get text blocks with positions
            blocks = page.get_text("dict")["blocks"]
            text_blocks = []
            
            for block in blocks:
                if "lines" in block:
                    block_text = ""
                    for line in block["lines"]:
                        for span in line["spans"]:
                            block_text += span["text"]
                    
                    if block_text.strip():
                        text_blocks.append({
                            "text": block_text,
                            "bbox": block["bbox"],
                            "page": page_num + 1
                        })
            
            pages.append({
                "page_number": page_num + 1,
                "text": text,
                "blocks": text_blocks
            })
        
        doc.close()
        
        return {
            "type": "document",
            "format": "pdf",
            "pages": pages,
            "total_pages": len(pages),
            "metadata": {
                "title": doc.metadata.get("title", ""),
                "author": doc.metadata.get("author", ""),
                "subject": doc.metadata.get("subject", "")
            }
        }
    
    def _process_docx(self, file_path: Path) -> Dict[str, Any]:
        """Extract text from DOCX with structure information."""
        doc = Document(file_path)
        paragraphs = []
        
        for i, para in enumerate(doc.paragraphs):
            if para.text.strip():
                paragraphs.append({
                    "index": i,
                    "text": para.text,
                    "style": para.style.name if para.style else "Normal"
                })
        
        return {
            "type": "document",
            "format": "docx",
            "paragraphs": paragraphs,
            "total_paragraphs": len(paragraphs),
            "metadata": {
                "title": doc.core_properties.title or "",
                "author": doc.core_properties.author or "",
                "subject": doc.core_properties.subject or ""
            }
        }
```

#### Image Processor (`image_processor.py`)

```python
import pytesseract
from PIL import Image
import cv2
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple
import json

class ImageProcessor:
    def __init__(self, ocr_lang: str = "eng"):
        self.ocr_lang = ocr_lang
        self.supported_formats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    
    def process_file(self, file_path: Path) -> Dict[str, Any]:
        """Process image and extract text with bounding boxes."""
        image = Image.open(file_path)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Extract text with bounding boxes
        ocr_data = pytesseract.image_to_data(
            image, 
            lang=self.ocr_lang,
            output_type=pytesseract.Output.DICT
        )
        
        # Process OCR results
        text_blocks = []
        full_text = ""
        
        for i in range(len(ocr_data['text'])):
            text = ocr_data['text'][i].strip()
            confidence = ocr_data['conf'][i]
            
            if text and confidence > 30:  # Filter low confidence text
                bbox = {
                    'x': ocr_data['left'][i],
                    'y': ocr_data['top'][i],
                    'width': ocr_data['width'][i],
                    'height': ocr_data['height'][i]
                }
                
                text_blocks.append({
                    'text': text,
                    'confidence': confidence,
                    'bbox': bbox,
                    'word_num': i
                })
                
                full_text += text + " "
        
        # Generate image embeddings (placeholder for CLIP model)
        image_features = self._extract_image_features(image)
        
        return {
            "type": "image",
            "format": file_path.suffix.lower()[1:],
            "ocr_text": full_text.strip(),
            "text_blocks": text_blocks,
            "image_features": image_features.tolist() if image_features is not None else None,
            "metadata": {
                "width": image.width,
                "height": image.height,
                "mode": image.mode,
                "total_text_blocks": len(text_blocks)
            }
        }
    
    def _extract_image_features(self, image: Image.Image) -> np.ndarray:
        """Extract image features using CLIP or similar model."""
        # Placeholder - implement CLIP model loading and feature extraction
        # For now, return dummy features
        return np.random.rand(512).astype(np.float32)
    
    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """Preprocess image for better OCR results."""
        # Convert PIL to OpenCV
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Apply preprocessing
        gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        
        # Noise removal
        denoised = cv2.medianBlur(gray, 5)
        
        # Thresholding
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Convert back to PIL
        return Image.fromarray(thresh)
```

#### Audio Processor (`audio_processor.py`)

```python
import whisper
import librosa
from pydub import AudioSegment
from pathlib import Path
from typing import List, Dict, Any
import numpy as np
import json

class AudioProcessor:
    def __init__(self, model_size: str = "base"):
        self.model = whisper.load_model(model_size)
        self.supported_formats = ['.mp3', '.wav', '.m4a', '.aac', '.ogg']
    
    def process_file(self, file_path: Path) -> Dict[str, Any]:
        """Process audio file and extract transcript with timestamps."""
        
        # Convert audio to WAV if needed
        wav_path = self._convert_to_wav(file_path)
        
        # Transcribe with Whisper
        result = self.model.transcribe(str(wav_path), word_timestamps=True)
        
        # Process segments
        segments = []
        full_transcript = ""
        
        for segment in result["segments"]:
            segment_data = {
                "start": segment["start"],
                "end": segment["end"],
                "text": segment["text"].strip(),
                "confidence": segment.get("avg_logprob", 0.0),
                "words": []
            }
            
            # Process word-level timestamps if available
            if "words" in segment:
                for word in segment["words"]:
                    segment_data["words"].append({
                        "word": word["word"],
                        "start": word["start"],
                        "end": word["end"],
                        "probability": word.get("probability", 0.0)
                    })
            
            segments.append(segment_data)
            full_transcript += segment["text"] + " "
        
        # Extract audio features
        audio_features = self._extract_audio_features(wav_path)
        
        # Clean up temporary WAV file if created
        if wav_path != file_path:
            wav_path.unlink()
        
        return {
            "type": "audio",
            "format": file_path.suffix.lower()[1:],
            "transcript": full_transcript.strip(),
            "segments": segments,
            "audio_features": audio_features.tolist() if audio_features is not None else None,
            "metadata": {
                "duration": result["segments"][-1]["end"] if result["segments"] else 0,
                "language": result.get("language", "unknown"),
                "total_segments": len(segments)
            }
        }
    
    def _convert_to_wav(self, file_path: Path) -> Path:
        """Convert audio file to WAV format if needed."""
        if file_path.suffix.lower() == '.wav':
            return file_path
        
        # Convert using pydub
        audio = AudioSegment.from_file(file_path)
        wav_path = file_path.with_suffix('.wav')
        audio.export(wav_path, format="wav")
        
        return wav_path
    
    def _extract_audio_features(self, audio_path: Path) -> np.ndarray:
        """Extract audio features for similarity search."""
        try:
            # Load audio with librosa
            y, sr = librosa.load(audio_path, sr=22050)
            
            # Extract MFCC features
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            
            # Take mean across time dimension
            features = np.mean(mfccs, axis=1)
            
            return features
        except Exception as e:
            print(f"Error extracting audio features: {e}")
            return None
```

### 4. Embedding and Vector Storage (`src/core/embeddings/`)

#### Embedding Manager (`embedding_manager.py`)

```python
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import pickle
import json
import uuid

class EmbeddingManager:
    def __init__(
        self, 
        model_name: str = "all-MiniLM-L6-v2",
        vector_dir: Path = None,
        dimension: int = 384
    ):
        self.model = SentenceTransformer(model_name)
        self.vector_dir = vector_dir or Path("data/vectors")
        self.vector_dir.mkdir(parents=True, exist_ok=True)
        self.dimension = dimension
        
        # Initialize FAISS index
        self.index = faiss.IndexFlatL2(dimension)
        self.metadata = {}  # Store chunk metadata
        
        # Load existing index if available
        self._load_index()
    
    def create_embeddings(self, texts: List[str]) -> np.ndarray:
        """Create embeddings for a list of texts."""
        embeddings = self.model.encode(texts)
        return embeddings
    
    def add_chunks(
        self, 
        chunks: List[Dict[str, Any]], 
        file_id: int,
        chunk_type: str = "text"
    ) -> List[str]:
        """Add chunks to the vector index."""
        texts = [chunk.get("text", "") for chunk in chunks]
        embeddings = self.create_embeddings(texts)
        
        # Generate unique IDs for chunks
        chunk_ids = [str(uuid.uuid4()) for _ in chunks]
        
        # Add to FAISS index
        self.index.add(embeddings)
        
        # Store metadata
        for i, (chunk, chunk_id) in enumerate(zip(chunks, chunk_ids)):
            self.metadata[chunk_id] = {
                "file_id": file_id,
                "chunk_index": i,
                "chunk_type": chunk_type,
                "text": chunk.get("text", ""),
                **chunk  # Include all chunk data
            }
        
        # Save updated index
        self._save_index()
        
        return chunk_ids
    
    def search(
        self, 
        query: str, 
        k: int = 10,
        filter_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Search for similar chunks."""
        # Create query embedding
        query_embedding = self.create_embeddings([query])
        
        # Search FAISS index
        distances, indices = self.index.search(query_embedding, k * 2)  # Get more results for filtering
        
        results = []
        for distance, idx in zip(distances[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for empty slots
                continue
            
            # Get chunk metadata
            chunk_ids = list(self.metadata.keys())
            if idx < len(chunk_ids):
                chunk_id = chunk_ids[idx]
                chunk_meta = self.metadata[chunk_id]
                
                # Apply type filter if specified
                if filter_type and chunk_meta.get("chunk_type") != filter_type:
                    continue
                
                results.append({
                    "chunk_id": chunk_id,
                    "distance": float(distance),
                    "similarity": 1.0 / (1.0 + distance),  # Convert distance to similarity
                    "metadata": chunk_meta
                })
        
        # Sort by similarity and return top k
        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:k]
    
    def _save_index(self):
        """Save FAISS index and metadata to disk."""
        index_path = self.vector_dir / "faiss_index.bin"
        metadata_path = self.vector_dir / "metadata.pkl"
        
        faiss.write_index(self.index, str(index_path))
        
        with open(metadata_path, 'wb') as f:
            pickle.dump(self.metadata, f)
    
    def _load_index(self):
        """Load FAISS index and metadata from disk."""
        index_path = self.vector_dir / "faiss_index.bin"
        metadata_path = self.vector_dir / "metadata.pkl"
        
        if index_path.exists() and metadata_path.exists():
            try:
                self.index = faiss.read_index(str(index_path))
                
                with open(metadata_path, 'rb') as f:
                    self.metadata = pickle.load(f)
                    
                print(f"Loaded index with {self.index.ntotal} vectors")
            except Exception as e:
                print(f"Error loading index: {e}")
                # Initialize empty index
                self.index = faiss.IndexFlatL2(self.dimension)
                self.metadata = {}
```

### 5. Text Processing and Chunking (`src/core/text_processing.py`)

```python
from typing import List, Dict, Any
import re
from collections import namedtuple

Chunk = namedtuple('Chunk', ['text', 'start_char', 'end_char', 'metadata'])

class TextChunker:
    def __init__(
        self, 
        chunk_size: int = 512, 
        chunk_overlap: int = 50,
        min_chunk_size: int = 100
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.min_chunk_size = min_chunk_size
    
    def chunk_text(self, text: str, metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Split text into overlapping chunks."""
        if not text.strip():
            return []
        
        # Clean text
        text = self._clean_text(text)
        
        # Try semantic chunking first (by sentences/paragraphs)
        chunks = self._semantic_chunking(text)
        
        # If chunks are too large, apply size-based chunking
        final_chunks = []
        for chunk in chunks:
            if len(chunk) > self.chunk_size:
                size_chunks = self._size_based_chunking(chunk)
                final_chunks.extend(size_chunks)
            else:
                final_chunks.append(chunk)
        
        # Create chunk objects with metadata
        result_chunks = []
        for i, chunk_text in enumerate(final_chunks):
            if len(chunk_text.strip()) >= self.min_chunk_size:
                result_chunks.append({
                    'text': chunk_text.strip(),
                    'chunk_index': i,
                    'char_count': len(chunk_text),
                    'word_count': len(chunk_text.split()),
                    'metadata': metadata or {}
                })
        
        return result_chunks
    
    def _semantic_chunking(self, text: str) -> List[str]:
        """Split text by semantic boundaries (paragraphs, sentences)."""
        # Split by double newlines (paragraphs)
        paragraphs = re.split(r'\n\s*\n', text)
        
        chunks = []
        current_chunk = ""
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue
            
            # If adding this paragraph would exceed chunk size, start new chunk
            if current_chunk and len(current_chunk + paragraph) > self.chunk_size:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = paragraph
            else:
                current_chunk = current_chunk + "\n\n" + paragraph if current_chunk else paragraph
        
        # Add the last chunk
        if current_chunk:
            chunks.append(current_chunk)
        
        return chunks
    
    def _size_based_chunking(self, text: str) -> List[str]:
        """Split text by character count with overlap."""
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.chunk_size
            
            # If this is not the last chunk, try to break at word boundary
            if end < len(text):
                # Look for the last space before the end position
                while end > start and text[end] != ' ':
                    end -= 1
                
                # If no space found, just use the original end position
                if end == start:
                    end = start + self.chunk_size
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            # Move start position (with overlap)
            start = end - self.chunk_overlap
            if start < 0:
                start = 0
        
        return chunks
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text."""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove control characters
        text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
        
        # Normalize quotes
        text = text.replace('"', '"').replace('"', '"')
        text = text.replace(''', "'").replace(''', "'")
        
        return text.strip()
```

### 6. LLM Integration (`src/core/llm/`)

#### Local LLM Manager (`llm_manager.py`)

```python
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from typing import List, Dict, Any, Optional
from pathlib import Path
import json

class LocalLLMManager:
    def __init__(
        self, 
        model_name: str = "microsoft/DialoGPT-medium",
        device: str = "auto",
        max_length: int = 512
    ):
        self.model_name = model_name
        self.max_length = max_length
        
        # Determine device
        if device == "auto":
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
        
        # Load model and tokenizer
        print(f"Loading LLM model: {model_name}")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            low_cpu_mem_usage=True
        )
        self.model.to(self.device)
        
        # Create text generation pipeline
        self.generator = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            device=0 if self.device == "cuda" else -1,
            max_length=max_length,
            do_sample=True,
            temperature=0.7,
            pad_token_id=self.tokenizer.eos_token_id
        )
        
    def generate_response(
        self, 
        query: str, 
        context_chunks: List[Dict[str, Any]],
        max_context_length: int = 2000
    ) -> Dict[str, Any]:
        """Generate response with citations based on retrieved context."""
        
        # Prepare context with citations
        context_with_citations = self._prepare_context_with_citations(
            context_chunks, 
            max_context_length
        )
        
        # Create prompt
        prompt = self._create_prompt(query, context_with_citations)
        
        # Generate response
        try:
            response = self.generator(
                prompt,
                max_new_tokens=200,
                num_return_sequences=1,
                temperature=0.7,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )[0]
            
            generated_text = response['generated_text']
            
            # Extract just the new part (response)
            response_text = generated_text[len(prompt):].strip()
            
            # Process citations
            citations = self._extract_citations(response_text, context_chunks)
            
            return {
                "response": response_text,
                "citations": citations,
                "context_used": len(context_chunks),
                "prompt_length": len(prompt),
                "model": self.model_name
            }
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return {
                "response": "I apologize, but I encountered an error while generating a response.",
                "citations": [],
                "context_used": 0,
                "error": str(e)
            }
    
    def _prepare_context_with_citations(
        self, 
        chunks: List[Dict[str, Any]], 
        max_length: int
    ) -> str:
        """Prepare context text with citation markers."""
        context_parts = []
        current_length = 0
        
        for i, chunk in enumerate(chunks):
            citation_num = i + 1
            chunk_text = chunk.get("metadata", {}).get("text", "")
            
            # Add citation marker
            cited_text = f"[{citation_num}] {chunk_text}"
            
            if current_length + len(cited_text) > max_length:
                break
            
            context_parts.append(cited_text)
            current_length += len(cited_text)
        
        return "\n\n".join(context_parts)
    
    def _create_prompt(self, query: str, context: str) -> str:
        """Create prompt for the LLM."""
        prompt = f"""Based on the following context, please answer the question. Use citation numbers [1], [2], etc. to reference the sources.

Context:
{context}

Question: {query}

Answer:"""
        
        return prompt
    
    def _extract_citations(
        self, 
        response: str, 
        context_chunks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Extract citation information from response."""
        citations = []
        
        # Find citation numbers in response [1], [2], etc.
        import re
        citation_pattern = r'\[(\d+)\]'
        found_citations = re.findall(citation_pattern, response)
        
        for citation_num in set(found_citations):
            citation_idx = int(citation_num) - 1
            
            if 0 <= citation_idx < len(context_chunks):
                chunk = context_chunks[citation_idx]
                metadata = chunk.get("metadata", {})
                
                citation_info = {
                    "citation_number": int(citation_num),
                    "chunk_id": chunk.get("chunk_id"),
                    "file_id": metadata.get("file_id"),
                    "chunk_type": metadata.get("chunk_type"),
                    "text_preview": metadata.get("text", "")[:100] + "...",
                    "source_info": self._get_source_info(metadata)
                }
                
                citations.append(citation_info)
        
        return citations
    
    def _get_source_info(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Extract source information from chunk metadata."""
        source_info = {
            "type": metadata.get("chunk_type", "unknown")
        }
        
        # Add type-specific information
        if metadata.get("page_number"):
            source_info["page"] = metadata["page_number"]
        
        if metadata.get("start_timestamp") is not None:
            source_info["timestamp"] = f"{metadata['start_timestamp']:.2f}s"
        
        if metadata.get("bbox"):
            source_info["image_region"] = metadata["bbox"]
        
        return source_info
```

## Implementation Guide

### Phase 1: Basic Setup (Week 1-2)

1. **Project Initialization**
   ```bash
   # Set up project structure
   mkdir prism-backend && cd prism-backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Basic API Structure**
   ```python
   # src/api/main.py
   from fastapi import FastAPI, UploadFile, File, HTTPException
   from fastapi.middleware.cors import CORSMiddleware
   from config.settings import settings
   
   app = FastAPI(title=settings.APP_NAME, version=settings.VERSION)
   
   # CORS middleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=settings.CORS_ORIGINS,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   
   @app.get("/")
   async def root():
       return {"message": "Prism RAG API is running"}
   
   @app.get("/health")
   async def health_check():
       return {"status": "healthy", "version": settings.VERSION}
   ```

3. **Database Setup**
   ```bash
   # Create database tables
   python -c "
   from src.models.database import engine, Base
   Base.metadata.create_all(bind=engine)
   print('Database tables created successfully')
   "
   ```

### Phase 2: File Processing (Week 3-4)

1. **Implement File Upload Endpoint**
   ```python
   # src/api/routes/upload.py
   from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
   from sqlalchemy.orm import Session
   from src.models.database import get_db, UploadedFile
   from src.core.processors.document_processor import DocumentProcessor
   from src.core.processors.image_processor import ImageProcessor
   from src.core.processors.audio_processor import AudioProcessor
   import hashlib
   import uuid
   from pathlib import Path
   
   router = APIRouter()
   
   @router.post("/upload")
   async def upload_file(
       file: UploadFile = File(...),
       db: Session = Depends(get_db)
   ):
       # Validate file size
       if file.size > settings.MAX_FILE_SIZE:
           raise HTTPException(400, "File too large")
       
       # Save file
       file_id = str(uuid.uuid4())
       file_path = settings.UPLOAD_DIR / f"{file_id}_{file.filename}"
       
       # Calculate checksum
       content = await file.read()
       checksum = hashlib.sha256(content).hexdigest()
       
       # Check for duplicates
       existing = db.query(UploadedFile).filter(
           UploadedFile.checksum == checksum
       ).first()
       
       if existing:
           return {"message": "File already exists", "file_id": existing.id}
       
       # Save to disk
       with open(file_path, "wb") as f:
           f.write(content)
       
       # Save to database
       db_file = UploadedFile(
           filename=file_id,
           original_name=file.filename,
           file_type=file.content_type,
           file_size=file.size,
           file_path=str(file_path),
           checksum=checksum
       )
       db.add(db_file)
       db.commit()
       
       # Start processing (async)
       from src.core.processing_pipeline import ProcessingPipeline
       pipeline = ProcessingPipeline()
       await pipeline.process_file_async(db_file.id, file_path)
       
       return {"message": "File uploaded successfully", "file_id": db_file.id}
   ```

2. **Create Processing Pipeline**
   ```python
   # src/core/processing_pipeline.py
   from pathlib import Path
   from typing import Dict, Any
   import asyncio
   from src.core.processors.document_processor import DocumentProcessor
   from src.core.processors.image_processor import ImageProcessor  
   from src.core.processors.audio_processor import AudioProcessor
   from src.core.embeddings.embedding_manager import EmbeddingManager
   from src.core.text_processing import TextChunker
   
   class ProcessingPipeline:
       def __init__(self):
           self.doc_processor = DocumentProcessor()
           self.img_processor = ImageProcessor()
           self.audio_processor = AudioProcessor()
           self.embedding_manager = EmbeddingManager()
           self.text_chunker = TextChunker()
       
       async def process_file_async(self, file_id: int, file_path: Path):
           """Process file asynchronously."""
           try:
               # Update status to processing
               # ... database update logic
               
               # Determine file type and process
               if file_path.suffix.lower() in ['.pdf', '.docx']:
                   await self._process_document(file_id, file_path)
               elif file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif']:
                   await self._process_image(file_id, file_path)
               elif file_path.suffix.lower() in ['.mp3', '.wav', '.m4a']:
                   await self._process_audio(file_id, file_path)
               
               # Update status to completed
               # ... database update logic
               
           except Exception as e:
               print(f"Processing error: {e}")
               # Update status to failed
   ```

### Phase 3: Search and Retrieval (Week 5-6)

1. **Implement Search Endpoint**
   ```python
   # src/api/routes/search.py
   from fastapi import APIRouter, Depends, HTTPException
   from pydantic import BaseModel
   from src.core.embeddings.embedding_manager import EmbeddingManager
   from src.core.llm.llm_manager import LocalLLMManager
   
   router = APIRouter()
   
   class SearchRequest(BaseModel):
       query: str
       limit: int = 10
       filter_type: str = None
   
   class SearchResponse(BaseModel):
       results: list
       response: str
       citations: list
       query_time: float
   
   @router.post("/search", response_model=SearchResponse)
   async def search(request: SearchRequest):
       import time
       start_time = time.time()
       
       # Initialize managers
       embedding_manager = EmbeddingManager()
       llm_manager = LocalLLMManager()
       
       # Search for relevant chunks
       search_results = embedding_manager.search(
           request.query,
           k=request.limit,
           filter_type=request.filter_type
       )
       
       # Generate LLM response
       llm_response = llm_manager.generate_response(
           request.query,
           search_results
       )
       
       query_time = time.time() - start_time
       
       return SearchResponse(
           results=search_results,
           response=llm_response["response"],
           citations=llm_response["citations"],
           query_time=query_time
       )
   ```

### Phase 4: Frontend Integration (Week 7-8)

1. **WebSocket Support for Real-time Updates**
   ```python
   # src/api/websocket.py
   from fastapi import WebSocket, WebSocketDisconnect
   from typing import List
   import json
   
   class ConnectionManager:
       def __init__(self):
           self.active_connections: List[WebSocket] = []
       
       async def connect(self, websocket: WebSocket):
           await websocket.accept()
           self.active_connections.append(websocket)
       
       def disconnect(self, websocket: WebSocket):
           self.active_connections.remove(websocket)
       
       async def send_personal_message(self, message: str, websocket: WebSocket):
           await websocket.send_text(message)
       
       async def broadcast_progress(self, file_id: int, progress: dict):
           message = json.dumps({"file_id": file_id, "progress": progress})
           for connection in self.active_connections:
               try:
                   await connection.send_text(message)
               except:
                   pass
   
   manager = ConnectionManager()
   
   @app.websocket("/ws")
   async def websocket_endpoint(websocket: WebSocket):
       await manager.connect(websocket)
       try:
           while True:
               data = await websocket.receive_text()
               # Handle incoming messages
       except WebSocketDisconnect:
           manager.disconnect(websocket)
   ```

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API root |
| GET | `/health` | Health check |
| POST | `/upload` | Upload file |
| POST | `/search` | Search query |
| GET | `/files` | List files |
| GET | `/files/{file_id}` | Get file details |
| DELETE | `/files/{file_id}` | Delete file |
| GET | `/search/history` | Search history |
| WebSocket | `/ws` | Real-time updates |

### Upload Endpoint Details

```python
POST /upload
Content-Type: multipart/form-data

Request:
- file: UploadFile

Response:
{
    "file_id": 123,
    "filename": "document.pdf",
    "status": "processing",
    "message": "File uploaded successfully"
}
```

### Search Endpoint Details

```python
POST /search
Content-Type: application/json

Request:
{
    "query": "What are the budget allocations for 2024?",
    "limit": 10,
    "filter_type": "document"  // optional: "document", "image", "audio"
}

Response:
{
    "results": [
        {
            "chunk_id": "uuid",
            "similarity": 0.95,
            "metadata": {
                "file_id": 123,
                "text": "Budget allocation text...",
                "source_info": {
                    "type": "document",
                    "page": 5
                }
            }
        }
    ],
    "response": "Based on the documents, the budget allocations for 2024 are... [1]",
    "citations": [
        {
            "citation_number": 1,
            "source_info": {
                "type": "document",
                "page": 5
            },
            "text_preview": "Budget allocation text..."
        }
    ],
    "query_time": 1.23
}
```

## Testing

### Unit Tests

```python
# tests/test_processors.py
import pytest
from src.core.processors.document_processor import DocumentProcessor
from pathlib import Path

class TestDocumentProcessor:
    def setup_method(self):
        self.processor = DocumentProcessor()
    
    def test_pdf_processing(self):
        # Test PDF processing
        result = self.processor.process_file(Path("test_files/sample.pdf"))
        assert result["type"] == "document"
        assert result["format"] == "pdf"
        assert len(result["pages"]) > 0
    
    def test_docx_processing(self):
        # Test DOCX processing
        result = self.processor.process_file(Path("test_files/sample.docx"))
        assert result["type"] == "document"
        assert result["format"] == "docx"
        assert len(result["paragraphs"]) > 0
```

### Integration Tests

```python
# tests/test_api.py
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_file_upload():
    with open("test_files/sample.pdf", "rb") as f:
        response = client.post(
            "/upload",
            files={"file": ("sample.pdf", f, "application/pdf")}
        )
    assert response.status_code == 200
    assert "file_id" in response.json()

def test_search():
    response = client.post(
        "/search",
        json={"query": "test query", "limit": 5}
    )
    assert response.status_code == 200
    assert "results" in response.json()
```

### Performance Tests

```python
# tests/test_performance.py
import time
import pytest
from src.core.embeddings.embedding_manager import EmbeddingManager

def test_embedding_performance():
    manager = EmbeddingManager()
    texts = ["Sample text"] * 1000
    
    start_time = time.time()
    embeddings = manager.create_embeddings(texts)
    end_time = time.time()
    
    # Should process 1000 texts in under 5 seconds
    assert (end_time - start_time) < 5.0
    assert embeddings.shape[0] == 1000
```

## Deployment

### Local Development

```bash
# Start development server
cd prism-backend
source venv/bin/activate
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  prism-backend:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data
      - ./config:/app/config
    environment:
      - DEBUG=false
      - DATABASE_URL=sqlite:///data/prism.db
    restart: unless-stopped
```

### Production Setup

```bash
# Install production dependencies
pip install gunicorn

# Create systemd service
sudo nano /etc/systemd/system/prism.service
```

```ini
# /etc/systemd/system/prism.service
[Unit]
Description=Prism RAG API
After=network.target

[Service]
User=prism
WorkingDirectory=/opt/prism-backend
Environment=PATH=/opt/prism-backend/venv/bin
ExecStart=/opt/prism-backend/venv/bin/gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## Performance Optimization

### 1. Async Processing

```python
# Use async/await for I/O operations
import asyncio
from concurrent.futures import ThreadPoolExecutor

class AsyncProcessor:
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=4)
    
    async def process_multiple_files(self, file_paths: List[Path]):
        tasks = []
        for file_path in file_paths:
            task = asyncio.create_task(
                asyncio.get_event_loop().run_in_executor(
                    self.executor,
                    self.process_file,
                    file_path
                )
            )
            tasks.append(task)
        
        return await asyncio.gather(*tasks)
```

### 2. Caching

```python
# Add Redis caching for embeddings
import redis
import pickle

class CachedEmbeddingManager(EmbeddingManager):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
    
    def create_embeddings(self, texts: List[str]) -> np.ndarray:
        # Check cache first
        cache_key = hashlib.sha256(str(texts).encode()).hexdigest()
        cached = self.redis_client.get(cache_key)
        
        if cached:
            return pickle.loads(cached)
        
        # Generate embeddings
        embeddings = super().create_embeddings(texts)
        
        # Cache results
        self.redis_client.setex(
            cache_key, 
            3600,  # 1 hour TTL
            pickle.dumps(embeddings)
        )
        
        return embeddings
```

### 3. Database Optimization

```python
# Add database indexes
from sqlalchemy import Index

# Add to models
Index('idx_file_checksum', UploadedFile.checksum)
Index('idx_chunk_file_id', DocumentChunk.file_id)
Index('idx_chunk_embedding_id', DocumentChunk.embedding_id)

# Use database connection pooling
from sqlalchemy.pool import QueuePool

engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=0
)
```

### 4. Model Optimization

```python
# Use quantized models for better performance
from transformers import AutoModelForCausalLM
import torch

# Load quantized model
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto",
    load_in_8bit=True  # 8-bit quantization
)

# Use ONNX for faster inference
from optimum.onnxruntime import ORTModelForCausalLM

model = ORTModelForCausalLM.from_pretrained(
    model_name,
    provider="CPUExecutionProvider"  # or CUDAExecutionProvider
)
```

## Monitoring and Logging

### Logging Setup

```python
# src/utils/logging.py
import logging
import sys
from pathlib import Path

def setup_logging():
    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_dir / "prism.log"),
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    return logging.getLogger(__name__)
```

### Metrics Collection

```python
# src/utils/metrics.py
from prometheus_client import Counter, Histogram, Gauge
import time

# Define metrics
UPLOAD_COUNTER = Counter('prism_uploads_total', 'Total file uploads')
PROCESSING_TIME = Histogram('prism_processing_seconds', 'File processing time')
SEARCH_COUNTER = Counter('prism_searches_total', 'Total searches')
ACTIVE_FILES = Gauge('prism_active_files', 'Number of active files')

class MetricsMiddleware:
    def __init__(self):
        self.start_time = time.time()
    
    def record_upload(self):
        UPLOAD_COUNTER.inc()
    
    def record_processing_time(self, duration: float):
        PROCESSING_TIME.observe(duration)
    
    def record_search(self):
        SEARCH_COUNTER.inc()
```

## Security Considerations

### 1. File Validation

```python
# src/utils/security.py
import magic
from pathlib import Path

ALLOWED_MIME_TYPES = {
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'audio/mpeg',
    'audio/wav'
}

def validate_file(file_path: Path) -> bool:
    """Validate file type and content."""
    # Check file extension
    if file_path.suffix.lower() not in ALLOWED_EXTENSIONS:
        return False
    
    # Check MIME type
    mime_type = magic.from_file(str(file_path), mime=True)
    if mime_type not in ALLOWED_MIME_TYPES:
        return False
    
    # Additional checks for file size, malware scanning, etc.
    return True
```

### 2. Rate Limiting

```python
# src/utils/rate_limiting.py
from fastapi import HTTPException
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, max_requests: int = 100, window: int = 3600):
        self.max_requests = max_requests
        self.window = window
        self.requests = defaultdict(list)
    
    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        
        # Clean old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if now - req_time < self.window
        ]
        
        # Check limit
        if len(self.requests[client_ip]) >= self.max_requests:
            return False
        
        # Add current request
        self.requests[client_ip].append(now)
        return True
```

### 3. Data Encryption

```python
# src/utils/encryption.py
from cryptography.fernet import Fernet
import base64

class FileEncryption:
    def __init__(self, key: bytes = None):
        if key is None:
            key = Fernet.generate_key()
        self.cipher = Fernet(key)
    
    def encrypt_file(self, file_path: Path) -> Path:
        """Encrypt file and return encrypted file path."""
        with open(file_path, 'rb') as f:
            data = f.read()
        
        encrypted_data = self.cipher.encrypt(data)
        encrypted_path = file_path.with_suffix(file_path.suffix + '.enc')
        
        with open(encrypted_path, 'wb') as f:
            f.write(encrypted_data)
        
        return encrypted_path
    
    def decrypt_file(self, encrypted_path: Path) -> bytes:
        """Decrypt file and return content."""
        with open(encrypted_path, 'rb') as f:
            encrypted_data = f.read()
        
        return self.cipher.decrypt(encrypted_data)
```

## Troubleshooting

### Common Issues

1. **Memory Issues with Large Files**
   ```python
   # Process files in chunks
   def process_large_file(file_path: Path):
       chunk_size = 1024 * 1024  # 1MB chunks
       with open(file_path, 'rb') as f:
           while True:
               chunk = f.read(chunk_size)
               if not chunk:
                   break
               # Process chunk
   ```

2. **CUDA Out of Memory**
   ```python
   # Clear GPU cache
   import torch
   
   def clear_gpu_cache():
       if torch.cuda.is_available():
           torch.cuda.empty_cache()
   
   # Use gradient checkpointing
   model.gradient_checkpointing_enable()
   ```

3. **Slow Inference**
   ```python
   # Use model quantization
   from torch.quantization import quantize_dynamic
   
   quantized_model = quantize_dynamic(
       model, {torch.nn.Linear}, dtype=torch.qint8
   )
   ```

### Debug Mode

```python
# Enable debug logging
import os
os.environ['PRISM_DEBUG'] = '1'

# Add debug endpoints
@app.get("/debug/stats")
async def debug_stats():
    return {
        "total_files": get_file_count(),
        "total_chunks": get_chunk_count(),
        "index_size": get_index_size(),
        "memory_usage": get_memory_usage()
    }
```

## Conclusion

This comprehensive guide provides everything you need to build a production-ready backend for your Prism multimodal RAG system. The architecture is designed to be:

- **Scalable**: Handle growing datasets and user loads
- **Maintainable**: Clean code structure and comprehensive testing
- **Secure**: File validation, rate limiting, and encryption
- **Performance-oriented**: Async processing, caching, and optimization
- **Observable**: Logging, metrics, and monitoring

Start with Phase 1 for basic functionality, then gradually add features as you move through the phases. Remember to test each component thoroughly and monitor performance as you scale.

For specific implementation questions or advanced features, refer to the detailed code examples and adapt them to your specific requirements.