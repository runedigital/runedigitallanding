import os
import json
import re

# CONFIGURATION
ARTIFACTS_DIR = "_artifacts"
OUTPUT_FILE = "nexus_manifest.json"

def get_title(filepath):
    """Extracts <title> from HTML without external dependencies."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Regex to find title tag
            match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1).strip()
    except Exception as e:
        print(f"Warning reading {filepath}: {e}")
    return os.path.basename(filepath)

def scan_artifacts():
    inventory = []
    print(f"// RUNE SYSTEM: SCANNING SECTOR [{ARTIFACTS_DIR}]...")

    # Create directory if it doesn't exist to prevent build errors
    if not os.path.exists(ARTIFACTS_DIR):
        print(f"!! NOTICE: Directory {ARTIFACTS_DIR} not found. Creating empty manifest.")
        # Write empty JSON so the site still loads
        with open(OUTPUT_FILE, 'w') as f:
            json.dump([], f)
        return

    for filename in os.listdir(ARTIFACTS_DIR):
        if filename.endswith(".html"):
            filepath = os.path.join(ARTIFACTS_DIR, filename)
            title = get_title(filepath)
            
            inventory.append({
                "id": filename.split('.')[0],
                "title": title,
                "path": f"{ARTIFACTS_DIR}/{filename}"
            })
            print(f"   -> LINKED: {title}")

    # Write the JSON Manifest
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(inventory, f, indent=2)
        
    print(f"// SYSTEM UPDATED. {len(inventory)} ARTIFACTS INDEXED.")

if __name__ == "__main__":
    scan_artifacts()
