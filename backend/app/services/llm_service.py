"""
LLM Service for handling Mistral 7B model with llama.cpp - Optimized for Speed
"""
import os
from typing import List, Optional
from llama_cpp import Llama
import logging
import threading

logger = logging.getLogger(__name__)

class MistralLLM:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        """Singleton pattern to ensure model loads only once"""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self, model_path: str = None, n_ctx: int = 2048, n_threads: int = 8):
        """
        Initialize Mistral 7B model using llama.cpp with performance optimizations
        
        Args:
            model_path: Path to the GGUF model file
            n_ctx: Context window size (reduced to 2048 for speed)
            n_threads: Number of threads for inference (increased for speed)
        """
        if hasattr(self, 'initialized'):
            return
            
        self.model_path = model_path or self._find_model_path()
        self.n_ctx = n_ctx
        self.n_threads = n_threads
        self.llm = None
        self.initialized = True
        
        if self.model_path and os.path.exists(self.model_path):
            self._load_model()
        else:
            logger.warning(f"Model not found at {self.model_path}. Please download mistral-7b-instruct-v0.2.Q4_K_M.gguf")
    
    def _find_model_path(self) -> str:
        """Find the model file in common locations"""
        # Try different model files in order of preference
        model_filenames = [
            "mistral-7b-instruct-v0.2.Q2_K_M.gguf",
            # "mistral-7b-instruct-v0.2.Q3_K_M.gguf",  # Working model first
            # "mistral-7b-instruct-v0.2.Q4_K_M.gguf", 
            # "mistral-7b-instruct-v0.2.Q40_K_M.gguf" # May be Qwen2 
        ]
        
        # Get current working directory and script directory
        cwd = os.getcwd()
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Try each model filename
        for model_filename in model_filenames:
            possible_paths = [
                # Relative to current working directory
                os.path.join(cwd, "models", "llm", model_filename),
                
                # Relative to backend directory (parent of app)
                os.path.join(os.path.dirname(os.path.dirname(script_dir)), "models", "llm", model_filename),
                
                # Relative to project root (2 levels up from app/services)
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(script_dir))), "models", "llm", model_filename),
                
                # Legacy paths for compatibility
                "../models/llm/" + model_filename,
                "../../models/llm/" + model_filename,
                "models/llm/" + model_filename,
                model_filename,
                
                # User home directory
                os.path.expanduser(f"~/models/{model_filename}"),
                os.path.expanduser(f"~/.cache/prism/{model_filename}")
            ]
            
            for path in possible_paths:
                abs_path = os.path.abspath(path)
                if os.path.exists(abs_path):
                    logger.info(f"Found model at: {abs_path}")
                    return abs_path
        
        # Return default path for first-time setup (use first preferred model)
        default_model = model_filenames[0]
        default_path = os.path.join(cwd, "models", "llm", default_model)
        logger.warning(f"Model not found. Please download {default_model} to: {default_path}")
        return default_path
    
    def _load_model(self):
        """Load the Mistral model with performance optimizations"""
        try:
            logger.info(f"Loading Mistral model from {self.model_path}")
            logger.info(f"Model file exists: {os.path.exists(self.model_path)}")
            logger.info(f"Model file size: {os.path.getsize(self.model_path) / (1024*1024*1024):.2f} GB")
            
            self.llm = Llama(
                model_path=self.model_path,
                n_ctx=self.n_ctx,           # Reduced context for speed
                n_threads=self.n_threads,   # More threads for speed
                n_batch=512,                # Batch processing
                n_gpu_layers=0,             # CPU only for stability
                use_mmap=True,              # Memory mapping for faster loading
                use_mlock=False,            # Don't lock all memory
                verbose=True,               # Enable verbose for debugging
                f16_kv=True,                # Use half precision for KV cache
                logits_all=False,           # Don't compute logits for all tokens
            )
            logger.info("✅ Mistral model loaded successfully with performance optimizations")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            logger.error(f"Exception type: {type(e).__name__}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            self.llm = None
    
    def is_ready(self) -> bool:
        """Check if the model is loaded and ready"""
        return self.llm is not None
    
    def generate_response(self, prompt: str, max_tokens: int = 256, temperature: float = 0.4) -> str:
        """
        Generate response from the model with speed optimizations
        
        Args:
            prompt: Input prompt
            max_tokens: Maximum tokens to generate (increased for complete responses)
            temperature: Sampling temperature (lower for faster, more focused responses)
            
        Returns:
            Generated response text
        """
        if not self.is_ready():
            return "Error: Model not loaded. Please check if the model file exists."
        
        try:
            # Format prompt for Mistral Instruct format
            formatted_prompt = f"[INST] {prompt} [/INST]"
            
            # Optimized generation parameters for balanced speed and completeness
            response = self.llm(
                formatted_prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=0.95,                 # Slightly higher for better completeness
                top_k=50,                   # Increase vocabulary for better responses
                repeat_penalty=1.15,        # Stronger penalty to avoid repetition
                stop=["[/INST]", "[INST]", "</s>"],  # Remove \n\n stop to allow complete responses
                echo=False,
                stream=False
            )
            
            return response["choices"][0]["text"].strip()
        
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return f"Error generating response: {str(e)}"
    
    def answer_question(self, context: str, question: str) -> str:
        """
        Answer a question based on provided context with optimizations
        
        Args:
            context: Document text context (increased limit for complete responses)
            question: User question
            
        Returns:
            Answer based on the context
        """
        # Increase context length limit for better responses
        max_context_length = 3000
        if len(context) > max_context_length:
            context = context[:max_context_length] + "..."
        
        prompt = f"""Answer the question based on the context below. Provide a complete and comprehensive answer with all relevant details. Do not stop mid-sentence.

Context: {context}

Question: {question}

Answer:"""
        
        return self.generate_response(prompt, max_tokens=400, temperature=0.2)

# Global instance
mistral_llm = MistralLLM()