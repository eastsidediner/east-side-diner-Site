#!/usr/bin/env python3
"""
East Side Diner Demo Server - Fixed Version
Creates temporary HTML files with correct CSS links for each theme.
"""

import http.server
import socketserver
import threading
import time
import os
import shutil
from pathlib import Path

def create_themed_html(theme_css=None):
    """Create HTML content with the correct CSS link"""
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if theme_css:
        content = content.replace(
            '<link rel="stylesheet" href="styles.css">',
            f'<link rel="stylesheet" href="{theme_css}">'
        )
    
    return content

def start_server(port, theme_name, theme_css=None):
    """Start a server on the specified port with the given theme"""
    try:
        # Create temporary HTML file for this theme
        temp_html = f"temp-{port}.html"
        html_content = create_themed_html(theme_css)
        
        with open(temp_html, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        class ThemeHandler(http.server.SimpleHTTPRequestHandler):
            def do_GET(self):
                if self.path == '/' or self.path == '/index.html':
                    self.path = f'/{temp_html}'
                super().do_GET()
        
        with socketserver.TCPServer(("", port), ThemeHandler) as httpd:
            print(f"✅ {theme_name} server running at http://localhost:{port}")
            httpd.serve_forever()
    except OSError as e:
        print(f"❌ Could not start {theme_name} server on port {port}: {e}")
    finally:
        # Clean up temp file
        if os.path.exists(temp_html):
            os.remove(temp_html)

def main():
    # Change to the website directory
    website_dir = Path(__file__).parent
    os.chdir(website_dir)
    
    print("🍔 East Side Diner Demo Server")
    print("=" * 40)
    print("Starting demo servers...")
    print()
    
    # Server configurations
    servers = [
        (8000, "Original Retro Theme", None),
        (8001, "Checkerboard Classic", "altstyles/checkerboard-classic.css"),
        (8002, "Drive-In 50's Theme", "altstyles/drive-in-50s.css")
    ]
    
    # Start each server in a separate thread
    threads = []
    for port, name, css in servers:
        thread = threading.Thread(
            target=start_server, 
            args=(port, name, css),
            daemon=True
        )
        thread.start()
        threads.append(thread)
        time.sleep(0.5)  # Small delay between server starts
    
    print()
    print("🌟 All servers running!")
    print("=" * 40)
    print("Demo URLs:")
    print("  📍 Original:     http://localhost:8000")
    print("  📍 Checkerboard: http://localhost:8001") 
    print("  📍 Drive-In 50s: http://localhost:8002")
    print()
    print("Press Ctrl+C to stop")
    print("=" * 40)
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping servers...")
        
        # Clean up any remaining temp files
        for port, _, _ in servers:
            temp_file = f"temp-{port}.html"
            if os.path.exists(temp_file):
                os.remove(temp_file)
        
        print("✅ Demo complete!")

if __name__ == "__main__":
    main()
