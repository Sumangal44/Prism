#!/usr/bin/env python3
"""
Startup script for Prism backend server
"""
import os
import sys
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

if __name__ == "__main__":
    import uvicorn
    
    # Use import string format for proper reload functionality
    uvicorn.run(
        "app.main:app",  # Import string instead of importing the app object
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        reload_dirs=[str(current_dir)]
    )