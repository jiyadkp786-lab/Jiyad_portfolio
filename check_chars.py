import sys

file_path = r"c:\jiyadhkp\public\Real Estate Website UI __ Behance.html"

checks = [
    (1081, 3287),
    (2057, 9915),
    (2057, 16799),
    (2057, 141903),
    (2057, 306141),
    (2057, 306159),
]

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for line_num, col in checks:
        if line_num <= len(lines):
            line = lines[line_num - 1]
            snippet = line[max(0, col - 50):col + 50]
            marker = " " * (min(col, 50) - 1) + "^"
            print(f"Line {line_num}, Col {col}:")
            print(f"Snippet: {snippet}")
            print(f"Marker : {marker}")
        else:
            print(f"Line {line_num} out of range")
