import re

def process_css():
    with open('styles.css', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Split into our good hero section (lines 1-400 roughly) and the rest
    part1_marker = "/* ================================\n   BUTTONS\n   ================================ */"
    if part1_marker not in content:
        print("Marker not found, please check.")
        return
        
    parts = content.split(part1_marker, 1)
    good_content = parts[0]
    rest_content = parts[1]

    # Regex to find any rule that targets .hero... inside the rest_content
    # This regex matches a CSS rule block like: .hero-title { ... }
    # but we have to be careful not to delete mixed blocks like: .hero-content, .about-content { ... }
    
    # Let's cleanly replace mixed blocks first
    rest_content = rest_content.replace(".hero-content,\n    .about-content,\n    .contact-content {", "    .about-content,\n    .contact-content {")
    
    # Remove standalone .hero- blocks
    # Pattern: \s*\.hero-[^{]+?\{[^}]+?\}
    rest_content = re.sub(r'\s*\.hero(?:-[a-zA-Z0-9_-]+)*\s*\{[^}]*\}', '', rest_content)

    new_content = good_content + part1_marker + rest_content
    
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Done removing rogue .hero CSS rules")

process_css()
