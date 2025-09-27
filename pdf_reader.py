import PyPDF2
import pdfplumber
import os
import sys

def read_pdf_pypdf2(file_path):
    """Read PDF using PyPDF2 library"""
    print(f"\n{'='*60}")
    print(f"Reading: {os.path.basename(file_path)} (using PyPDF2)")
    print('='*60)
    
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            print(f"Number of pages: {len(pdf_reader.pages)}")
            print("-" * 60)
            
            full_text = ""
            for page_num, page in enumerate(pdf_reader.pages, 1):
                print(f"\n--- Page {page_num} ---")
                page_text = page.extract_text()
                print(page_text)
                full_text += f"\n--- Page {page_num} ---\n" + page_text + "\n"
            
            return full_text
            
    except Exception as e:
        print(f"Error reading PDF with PyPDF2: {e}")
        return None

def read_pdf_pdfplumber(file_path):
    """Read PDF using pdfplumber library (often better for complex layouts)"""
    print(f"\n{'='*60}")
    print(f"Reading: {os.path.basename(file_path)} (using pdfplumber)")
    print('='*60)
    
    try:
        with pdfplumber.open(file_path) as pdf:
            print(f"Number of pages: {len(pdf.pages)}")
            print("-" * 60)
            
            full_text = ""
            for page_num, page in enumerate(pdf.pages, 1):
                print(f"\n--- Page {page_num} ---")
                page_text = page.extract_text()
                if page_text:
                    print(page_text)
                    full_text += f"\n--- Page {page_num} ---\n" + page_text + "\n"
                else:
                    print("(No text found on this page)")
                    full_text += f"\n--- Page {page_num} ---\n(No text found on this page)\n"
            
            return full_text
            
    except Exception as e:
        print(f"Error reading PDF with pdfplumber: {e}")
        return None

def main():
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # PDF files to read
    pdf_files = [
        os.path.join(script_dir, "sih231conceptnote.pdf"),
        os.path.join(script_dir, "sih25231.pdf")
    ]
    
    for pdf_file in pdf_files:
        if os.path.exists(pdf_file):
            print(f"\n\nProcessing: {pdf_file}")
            
            # Try pdfplumber first (usually better results)
            text_plumber = read_pdf_pdfplumber(pdf_file)
            
            # If pdfplumber fails or returns empty, try PyPDF2
            if not text_plumber or text_plumber.strip() == "":
                print("\nTrying alternative method...")
                text_pypdf2 = read_pdf_pypdf2(pdf_file)
        else:
            print(f"File not found: {pdf_file}")

if __name__ == "__main__":
    main()