import os
import pypdf

def dump_pdfs():
    pdf_paths = [
        r"c:\Users\Sanjay Gowda\Downloads\dataset kgf.pdf",
        r"c:\Users\Sanjay Gowda\Downloads\dataset kgf-2.pdf"
    ]
    
    for path in pdf_paths:
        if not os.path.exists(path):
            print(f"File not found: {path}")
            continue
        
        base_name = os.path.splitext(os.path.basename(path))[0]
        out_path = f"{base_name}.txt"
        print(f"\nDumping {path} to {out_path}...")
        
        reader = pypdf.PdfReader(path)
        all_text = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                all_text.append(f"--- PAGE {i+1} ---")
                all_text.append(text)
        
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n\n".join(all_text))
        print(f"Finished dumping. Saved to {out_path}.")

if __name__ == "__main__":
    dump_pdfs()
