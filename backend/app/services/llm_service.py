"""
LLM Service for handling Mistral 7B model with llama.cpp
"""
import os
from typing import List, Optional
from llama_cpp import Llama
import logging

logger = logging.getLogger(__name__)

class MistralLLM:
    def __init__(self, model_path: str = None, n_ctx: int = 4096, n_threads: int = 4):
        """
        Initialize Mistral 7B model using llama.cpp
        
        Args:
            model_path: Path to the GGUF model file
            n_ctx: Context window size (default 4096)
            n_threads: Number of threads for inference
        """
        self.model_path = model_path or self._find_model_path()
        self.n_ctx = n_ctx
        self.n_threads = n_threads
        self.llm = None
        
        if self.model_path and os.path.exists(self.model_path):
            self._load_model()
        else:
            logger.warning(f"Model not found at {self.model_path}. Please download mistral-7b-instruct-v0.2.Q4_K_M.gguf")
    
    def _find_model_path(self) -> str:
        """Find the model file in common locations"""
        model_filename = "mistral-7b-instruct-v0.2.Q4_K_M.gguf"
        
        # Get current working directory and script directory
        cwd = os.getcwd()
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
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
        
        # Return default path for first-time setup
        default_path = os.path.join(cwd, "models", "llm", model_filename)
        logger.warning(f"Model not found. Please download {model_filename} to: {default_path}")
        return default_path
    
    def _load_model(self):
        """Load the Mistral model"""
        try:
            logger.info(f"Loading Mistral model from {self.model_path}")
            self.llm = Llama(
                model_path=self.model_path,
                n_ctx=self.n_ctx,
                n_threads=self.n_threads,
                verbose=False
            )
            logger.info("Mistral model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            self.llm = None
    
    def is_ready(self) -> bool:
        """Check if the model is loaded and ready"""
        return self.llm is not None
    
    def generate_response(self, prompt: str, max_tokens: int = 512, temperature: float = 0.7) -> str:
        """
        Generate response from the model
        
        Args:
            prompt: Input prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            
        Returns:
            Generated response text
        """
        if not self.is_ready():
            return "Error: Model not loaded. Please check if the model file exists."
        
        try:
            # Format prompt for Mistral Instruct format
            formatted_prompt = f"[INST] {prompt} [/INST]"
            
            response = self.llm(
                formatted_prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                stop=["[/INST]", "[INST]"],
                echo=False
            )
            
            return response["choices"][0]["text"].strip()
        
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return f"Error generating response: {str(e)}"
    
    def answer_question(self, context: str, question: str) -> str:
        """
        Answer a question based on provided context
        
        Args:
            context: Document text context
            question: User question
            
        Returns:
            Answer based on the context
        """
        prompt = f"""Based on the following document content, please answer the question. If the answer cannot be found in the document, say "I cannot find this information in the provided document."

Document Content:
{context}

Question: {question}

Answer:"""
        
        return self.generate_response(prompt, max_tokens=256, temperature=0.3)

# Global instance
mistral_llm = MistralLLM()