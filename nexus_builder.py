import os
import json
from bs4 import BeautifulSoup # pip install beautifulsoup4

# CONFIG
ARTIFACTS_DIR = "_artifacts"
OUTPUT_FILE = "nexus_manifest.json"

def scan_artifacts():
    inventory = []
    
    print(f"// SCANNING SECTOR: {ARTIFACTS_DIR}...")

    if not os.path.exists(ARTIFACTS_DIR):
        print("!! ERROR: Artifact sector not found.")
        return

    for filename in os.listdir(ARTIFACTS_DIR):
        if filename.endswith(".html"):
            filepath = os.path.join(ARTIFACTS_DIR, filename)
            
            # Open file to extract the <title> for the UI
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    soup = BeautifulSoup(f, 'html.parser')
                    title = soup.title.string if soup.title else filename
                    
                    inventory.append({
                        "id": filename.split('.')[0],
                        "title": title,
                        "path": f"{ARTIFACTS_DIR}/{filename}"
                    })
                    print(f"   -> LINKED: {title}")
            except Exception as e:
                print(f"   !! CORRUPTED: {filename} ({e})")

    # Write the JSON Manifest
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(inventory, f, indent=2)
        
    print(f"// SYSTEM UPDATED. {len(inventory)} ARTIFACTS INDEXED.")

if __name__ == "__main__":
    scan_artifacts()