import os

path = r'c:\Users\WESOLVE\Desktop\For.Ever Cosmetics\lp\script.js'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixed_lines = []
for line in lines:
    # Remove excessive empty lines if we want, but let's just fix the characters first
    # Many lines are JUST whitespace or empty.
    
    new_line = line
    # Fix the corruption: '-' instead of '?'
    # 1. Pattern like " - " for ternary
    new_line = new_line.replace(' - products', ' ? products')
    new_line = new_line.replace(' - \'Page\'', ' ? \'Page\'')
    new_line = new_line.replace(' - Math.max', ' ? Math.max')
    new_line = new_line.replace(' - activeFilter', ' ? activeFilter')
    
    # 2. Pattern "-." for "?."
    new_line = new_line.replace('-.', '?.')
    
    # 3. Regex patterns
    new_line = new_line.replace('(-=', '(?=')
    new_line = new_line.replace('(-!', '(?!')
    
    # 4. Strings/Confirmation
    new_line = new_line.replace('-\'', '?\'')
    new_line = new_line.replace('-"', '?"')
    
    fixed_lines.append(new_line)

# Also remove the every-other-line-is-empty if possible
# It seems every even line is empty.
actually_fixed = []
for i in range(len(fixed_lines)):
    if fixed_lines[i].strip() == "" and i > 0 and fixed_lines[i-1].strip() != "":
         # Skip redundant empty lines
         continue
    actually_fixed.append(fixed_lines[i])

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines) # Keeping redundant lines for now to be safe, but fixing characters
