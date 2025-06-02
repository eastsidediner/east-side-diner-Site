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
from pathlib import Path

def start_server(port, theme_name, theme_css=None):
    """Start a server on the specified port with the given theme"""
    try:
        class ThemeHandler(http.server.SimpleHTTPRequestHandler):
            def do_GET(self):
                # Handle index.html requests
                if self.path == '/' or self.path == '/index.html':
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    
                    # Read and modify the HTML
                    with open('index.html', 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Replace CSS link if needed
                    if theme_css:
                        content = content.replace(
                            '<link rel="stylesheet" href="styles.css">',
                            f'<link rel="stylesheet" href="{theme_css}">'
                        )
                    
                    self.wfile.write(content.encode('utf-8'))
                else:
                    # Serve other files normally
                    super().do_GET()
        
        with socketserver.TCPServer(("", port), ThemeHandler) as httpd:
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
        time.sleep(0.5)
    
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
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping servers...")
        print("✅ Demo complete!")

if __name__ == "__main__":
    main()