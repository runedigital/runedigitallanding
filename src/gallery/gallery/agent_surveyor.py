import os

# --- CONFIGURATION ---
BASE_DIR = os.getcwd()
OUTPUT_FILE = os.path.join(BASE_DIR, "SYSTEM_MAP.txt")

# Folders to collapse in the report (to keep the map readable)
# We don't need to see every file inside node_modules or .git
COLLAPSE_DIRS = [
    "node_modules",
    ".git",
    "dist",
    "build",
    "__pycache__",
    ".vscode"
]

def generate_tree(dir_path, prefix=""):
    """
    Recursive function to generate a visual tree structure string.
    """
    output = ""
    
    try:
        # Get list of files and sort them (directories first, then files)
        entries = os.listdir(dir_path)
        dirs = sorted([d for d in entries if os.path.isdir(os.path.join(dir_path, d))])
        files = sorted([f for f in entries if os.path.isfile(os.path.join(dir_path, f))])
        
        all_entries = dirs + files
        
        for i, entry in enumerate(all_entries):
            is_last = (i == len(all_entries) - 1)
            connector = "└── " if is_last else "├── "
            
            output += f"{prefix}{connector}{entry}"
            
            # Add markers for critical assets
            if entry == "App.jsx": output += "  <-- [MASTER CONTROLLER]"
            if entry == "agent_archivist.py": output += "  <-- [ARCHITECT]"
            if entry == "gallery": output += "  <-- [ASSET VAULT]"
            
            output += "\n"
            
            full_path = os.path.join(dir_path, entry)
            
            if os.path.isdir(full_path):
                # If it's a collapsed directory, just show a summary
                if entry in COLLAPSE_DIRS:
                    extension = "    " if is_last else "│   "
                    output += f"{prefix}{extension}   [...CONTENTS HIDDEN...]\n"
                else:
                    # Recursively map the children
                    extension = "    " if is_last else "│   "
                    output += generate_tree(full_path, prefix + extension)
                    
    except PermissionError:
        output += f"{prefix}   [ACCESS DENIED]\n"
        
    return output

def run_survey():
    print("RUNE // SURVEYOR: MAPPING TERRITORY...")
    print(f"Scanning Root: {BASE_DIR}")
    
    header = f"""
================================================================
RUNE DIGITAL // SYSTEM MAP
GENERATED: {os.path.basename(BASE_DIR)}
================================================================
LEGEND:
[MASTER CONTROLLER] = Critical App Logic
[ASSET VAULT]       = The 3D Assets (Must be preserved)
[ARCHITECT]         = This Script / Archivist
================================================================

"""
    # Generate the tree
    tree_map = generate_tree(BASE_DIR)
    
    # Write to file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(header + tree_map)
        
    print(f">> SURVEY COMPLETE.")
    print(f">> MAP GENERATED AT: {OUTPUT_FILE}")
    print(">> Open this file to verify your folder structure before merging.")

if __name__ == "__main__":
    run_survey()