from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import shutil
from pathlib import Path
import logging
from typing import Optional

from .services.qa_service import qa_service
from .services.llm_service import mistral_llm

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Prism Document Q&A API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure data directories exist
Path("data/uploads").mkdir(parents=True, exist_ok=True)
Path("data/processed").mkdir(parents=True, exist_ok=True)

# Pydantic models
class QuestionRequest(BaseModel):
    question: str
    file_id: Optional[str] = None

class QuestionResponse(BaseModel):
    success: bool
    answer: Optional[str] = None
    sources: Optional[list] = None
    chunks_used: Optional[int] = None
    error: Optional[str] = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Prism Document Q&A API",
        "version": "1.0.0",
        "llm_ready": mistral_llm.is_ready()
    }

@app.post("/api/upload", response_model=dict)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and process a document (PDF or DOCX)
    """
    try:
        # Validate file type
        allowed_extensions = {'.pdf', '.docx'}
        file_extension = Path(file.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Save uploaded file
        file_id = Path(file.filename).stem
        upload_path = Path("data/uploads") / file.filename
        
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"File uploaded: {file.filename}")
        
        # Process document
        result = qa_service.process_document(str(upload_path), file_id)
        
        if result["success"]:
            return {
                "success": True,
                "message": f"Document '{file.filename}' processed successfully",
                "file_id": file_id,
                "metadata": result["metadata"]
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/question", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    """
    Ask a question about uploaded documents
    """
    try:
        if not request.question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        # Get answer from Q&A service
        result = qa_service.answer_question(
            question=request.question,
            file_id=request.file_id
        )
        
        if result["success"]:
            return QuestionResponse(
                success=True,
                answer=result["answer"],
                sources=result["sources"],
                chunks_used=result["chunks_used"]
            )
        else:
            return QuestionResponse(
                success=False,
                error=result["error"]
            )
            
    except Exception as e:
        logger.error(f"Question error: {e}")
        return QuestionResponse(
            success=False,
            error=str(e)
        )

@app.get("/api/documents")
async def list_documents():
    """
    List all processed documents
    """
    try:
        documents = qa_service.list_documents()
        return {
            "success": True,
            "documents": documents,
            "count": len(documents)
        }
    except Exception as e:
        logger.error(f"List documents error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/{file_id}")
async def get_document_info(file_id: str):
    """
    Get information about a specific document
    """
    try:
        doc_info = qa_service.get_document_info(file_id)
        if doc_info:
            return {
                "success": True,
                "document": doc_info
            }
        else:
            raise HTTPException(status_code=404, detail="Document not found")
    except Exception as e:
        logger.error(f"Get document info error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model/status")
async def model_status():
    """
    Check LLM model status
    """
    return {
        "model_loaded": mistral_llm.is_ready(),
        "model_path": mistral_llm.model_path,
        "context_size": mistral_llm.n_ctx
    }

@app.delete("/api/documents/{file_id}")
async def delete_document(file_id: str):
    """
    Delete a processed document
    """
    try:
        # Remove from memory
        if file_id in qa_service.document_chunks:
            del qa_service.document_chunks[file_id]
        if file_id in qa_service.document_metadata:
            del qa_service.document_metadata[file_id]
        
        # Remove processed file
        processed_file = Path("data/processed") / f"{file_id}.json"
        if processed_file.exists():
            processed_file.unlink()
        
        return {
            "success": True,
            "message": f"Document '{file_id}' deleted successfully"
        }
    except Exception as e:
        logger.error(f"Delete document error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
