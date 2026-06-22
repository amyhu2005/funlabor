import os
import glob
import re

nav_content = """    <nav class="floating-sidebar visible">
        <a href="index.html#bio" class="sidebar-item" data-label="home"><i data-lucide="home"></i></a>
        <a href="profile.html" class="sidebar-item" data-label="profile"><i data-lucide="user"></i></a>
        <a href="4am.html" class="sidebar-item" data-label="vibecoding projects"><i data-lucide="terminal"></i></a>
        <a href="woodshop.html" class="sidebar-item" data-label="woodworking"><i data-lucide="hammer"></i></a>
        <a href="thoughts.html" class="sidebar-item" data-label="rants"><i data-lucide="pen-tool"></i></a>
        <a href="contact.html" class="sidebar-item" data-label="contact"><i data-lucide="message-square"></i></a>
    </nav>"""

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Improved regex to find any floating-sidebar and replace it
    new_content = re.sub(r'[ \t]*<nav class="floating-sidebar.*?">.*?</nav>', nav_content, content, flags=re.DOTALL)
    
    # If no sidebar was found, insert it after the side-id or tech-tag
    if nav_content not in new_content:
        # Try to insert after the opening <body> or top tech-tags
        if '</body>' in new_content and '<nav class="floating-sidebar' not in new_content:
            new_content = re.sub(r'(<body.*?>)', r'\1\n' + nav_content, new_content)

    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for filepath in glob.glob("*.html"):
    update_file(filepath)
