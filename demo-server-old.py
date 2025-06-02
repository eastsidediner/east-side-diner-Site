#!/usr/bin/env python3
"""
East Side Diner Demo Server
Simple demo tool for client presentations - serves each theme on different ports.

Usage: python3 demo-server.py
URLs:  http://localhost:8000 (Original) | 8001 (Checkerboard) | 8002 (Drive-In)
Stop:  Ctrl+C
"""

import http.server
import socketserver
import threading
import time
import os
import shutil
from pathlib import Path

class DemoHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, theme_css=None, **kwargs):
        self.theme_css = theme_css
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        # If requesting index.html, modify it to use the correct CSS
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            # Read the original index.html
            with open('index.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace the CSS link if we have a theme
            if self.theme_css:
                print(f"Replacing CSS with: {self.theme_css}")
                content = content.replace(
                    '<link rel="stylesheet" href="styles.css">',
                    f'<link rel="stylesheet" href="{self.theme_css}">'
                )
            
            self.wfile.write(content.encode('utf-8'))
        else:
            # For all other requests, serve normally
            super().do_GET()

def create_handler(theme_css):
    """Create a request handler with a specific theme CSS"""
    def handler(*args, **kwargs):
        return DemoHTTPRequestHandler(*args, theme_css=theme_css, **kwargs)
    return handler

def start_server(port, theme_name, theme_css=None):
    """Start a server on the specified port with the given theme"""
    try:
        handler = create_handler(theme_css)
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"✅ {theme_name} server running at http://localhost:{port}")
            httpd.serve_forever()
    except OSError as e:
        print(f"❌ Could not start {theme_name} server on port {port}: {e}")

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
        print("✅ Demo complete!")

if __name__ == "__main__":
    main()
