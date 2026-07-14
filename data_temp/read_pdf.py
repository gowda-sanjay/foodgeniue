import os

def extract_pdf_text():
    pdf_paths = [
        r"c:\Users\Sanjay Gowda\Downloads\dataset kgf.pdf",
        r"c:\Users\Sanjay Gowda\Downloads\dataset kgf-2.pdf"
    ]
    
    # Try importing pdf libraries
    try:
        import pypdf
        print("Using pypdf")
        for path in pdf_paths:
            if not os.path.exists(path):
                print(f"File not found: {path}")
                continue
            print(f"\n--- Reading {os.path.basename(path)} ---")
            reader = pypdf.PdfReader(path)
            print(f"Total pages: {len(reader.pages)}")
            # Print first 2000 chars of page 0
            text = reader.pages[0].extract_text()
            print("First page preview:\n", text[:2000])
    except ImportError:
        try:
            import PyPDF2
            print("Using PyPDF2")
            for path in pdf_paths:
                if not os.path.exists(path):
                    continue
                print(f"\n--- Reading {os.path.basename(path)} ---")
                reader = PyPDF2.PdfReader(path)
                print(f"Total pages: {len(reader.pages)}")
                text = reader.pages[0].extract_text()
                print("First page preview:\n", text[:2000])
        except ImportError:
            try:
                import pdfplumber
                print("Using pdfplumber")
                for path in pdf_paths:
                    if not os.path.exists(path):
                        continue
                    print(f"\n--- Reading {os.path.basename(path)} ---")
                    with pdfplumber.open(path) as pdf:
                        print(f"Total pages: {len(pdf.pages)}")
                        text = pdf.pages[0].extract_text()
                        print("First page preview:\n", text[:2000])
            except ImportError:
                print("No PDF library installed. Installing pypdf...")
                import subprocess
                subprocess.check_call(["pip", "install", "pypdf"])
                import pypdf
                print("pypdf installed and imported successfully!")
                for path in pdf_paths:
                    if not os.path.exists(path):
                        continue
                    print(f"\n--- Reading {os.path.basename(path)} ---")
                    reader = pypdf.PdfReader(path)
                    print(f"Total pages: {len(reader.pages)}")
                    text = reader.pages[0].extract_text()
                    print("First page preview:\n", text[:2000])

if __name__ == "__main__":
    extract_pdf_text()
