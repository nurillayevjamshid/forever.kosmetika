import os

path = r'c:\Users\WESOLVE\Desktop\For.Ever Cosmetics\lp\script.js'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

clean_lines = []
for line in lines:
    # Remove lines that are only whitespace or nothing
    if line.strip() == "":
        # We only keep one empty line if the previous was NOT empty
        if len(clean_lines) > 0 and clean_lines[-1].strip() != "":
            clean_lines.append("\n")
        continue
    clean_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(clean_lines)
