import shutil
import sys
from pathlib import Path

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    root_dir = Path("d:/Users/alber/Projetos/Qualificacao")
    tea_dir = root_dir / "Estado da arte TEA" / "TEA"
    pose_dir = root_dir / "Estado da arte TEA" / "Detecção de poses"
    main_pdf = root_dir / "Paper_1" / "Computer_Vision-Based_Assessment_of_Autistic_Children_Analyzing_Interactions_Emotions_Human_Pose_and_Life_Skills (2).pdf"
    
    dest_dir = root_dir / "estado-da-arte-portal" / "public" / "papers"
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    print("Copying papers to portal public directory...")
    
    # Copy main PDF
    if main_pdf.exists():
        dest_path = dest_dir / main_pdf.name
        shutil.copy2(main_pdf, dest_path)
        print(f"Copied main paper: {main_pdf.name}")
    else:
        print(f"Warning: Main paper not found at {main_pdf}")
        
    # Copy TEA papers
    if tea_dir.exists():
        for pdf_path in tea_dir.glob("*.pdf"):
            shutil.copy2(pdf_path, dest_dir / pdf_path.name)
            print(f"Copied TEA paper: {pdf_path.name}")
            
    # Copy Pose papers
    if pose_dir.exists():
        for pdf_path in pose_dir.glob("*.pdf"):
            shutil.copy2(pdf_path, dest_dir / pdf_path.name)
            print(f"Copied Pose paper: {pdf_path.name}")
            
    print("Done copying all PDFs.")

if __name__ == "__main__":
    main()
