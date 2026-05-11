#!/usr/bin/env python
"""Fix MySQL charset syntax for MariaDB compatibility"""
import re

with open('database.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CHARSET= with CHARACTER SET (MariaDB syntax)
content = re.sub(
    r'CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
    'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
    content
)

# Write back
with open('database.sql', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Fixed all charset syntax errors in database.sql')
