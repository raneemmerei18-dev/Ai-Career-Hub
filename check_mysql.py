#!/usr/bin/env python
"""
MySQL Diagnostic Script for AI Career Hub
Checks MySQL installation and provides setup instructions
"""

import os
import subprocess
import sys
from pathlib import Path

def check_mysql_installed():
    """Check if MySQL is installed"""
    common_paths = [
        r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        r"C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
        r"C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe",
        r"C:\Program Files\MariaDB 10.6\bin\mysql.exe",
        r"C:\Program Files\MariaDB 10.5\bin\mysql.exe",
    ]
    
    for path in common_paths:
        if os.path.exists(path):
            return path
    
    return None

def check_mysql_service():
    """Check if MySQL service is running"""
    try:
        result = subprocess.run(
            ["powershell", "-Command", "Get-Service MySQL* -ErrorAction SilentlyContinue"],
            capture_output=True,
            text=True,
            timeout=5
        )
        return "MySQL" in result.stdout or "Running" in result.stdout
    except:
        return False

def main():
    print("=" * 70)
    print("AI Career Hub - MySQL Diagnostic")
    print("=" * 70)
    print()
    
    # Check if MySQL is installed
    print("🔍 Checking MySQL installation...")
    mysql_path = check_mysql_installed()
    
    if mysql_path:
        print(f"✅ MySQL found at: {mysql_path}")
        print()
        
        # Add to PATH for this session
        bin_path = os.path.dirname(mysql_path)
        os.environ['PATH'] = bin_path + os.pathsep + os.environ['PATH']
        
        # Check if service is running
        print("🔍 Checking if MySQL service is running...")
        if check_mysql_service():
            print("✅ MySQL service is running")
        else:
            print("⚠️  MySQL service status unknown (might still be running)")
        
        print()
        print("=" * 70)
        print("✅ MySQL is properly installed!")
        print("=" * 70)
        print()
        print("📝 To complete the database migration:")
        print()
        print("Option 1: Run the migration script")
        print("  $ python migrate.py")
        print()
        print("Option 2: Manual setup via phpMyAdmin")
        print("  1. Open http://localhost/phpmyadmin")
        print("  2. Login with root (no password)")
        print("  3. Go to Import tab")
        print("  4. Select database.sql file")
        print("  5. Click 'Go'")
        print()
        print("Option 3: Manual setup via command line")
        print(f"  $ \"{mysql_path}\" -u root < database.sql")
        print()
        return True
        
    else:
        print("❌ MySQL is not installed!")
        print()
        print("=" * 70)
        print("📥 MySQL Installation Required")
        print("=" * 70)
        print()
        print("Choose one of the following:")
        print()
        print("1️⃣  MySQL Community Server")
        print("   Download: https://dev.mysql.com/downloads/mysql/")
        print("   Windows: Download MSI Installer")
        print("   - Run installer")
        print("   - Choose 'Server only'")
        print("   - Use default settings")
        print("   - When prompted for password, leave it empty (just press Enter)")
        print()
        print("2️⃣  MariaDB (MySQL-compatible)")
        print("   Download: https://mariadb.org/download/")
        print("   Windows: Download MSI Installer")
        print("   - Run installer")
        print("   - Use default settings")
        print()
        print("3️⃣  Docker (Recommended for development)")
        print("   If you have Docker installed:")
        print("   $ docker run --name mysql_ai -e MYSQL_ROOT_PASSWORD=root -d mysql:8.0")
        print("   Then try the migration again")
        print()
        print("After installation, restart your terminal and run:")
        print("  $ python migrate.py")
        print()
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
