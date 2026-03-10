import os

file_path = r'c:\Users\WESOLVE\Desktop\For.Ever Cosmetics\lp\styles.css'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    # Remove all entirely blank lines to be sure, then we can add them back if needed
    if line.strip():
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.writelines(new_lines)
