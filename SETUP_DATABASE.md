# 🗄️ Database Migration Setup Guide

## ⚠️ Current Status

MySQL is **not installed** on your system. You have two options:

---

## Option 1: Install MySQL Community Server (Recommended for Production)

### Step 1: Download MySQL
- Go to: https://dev.mysql.com/downloads/mysql/
- Download **MySQL Community Server 8.0** (Windows x86, 64-bit MSI Installer)

### Step 2: Install MySQL
1. Run the installer
2. Click "Next" through the setup wizard
3. When asked for "MySQL Server", choose "Server only"
4. Use default configuration
5. **⚠️ Important:** When prompted for "MySQL Root Password", **leave it empty** (just click Next)
6. Complete the installation
7. MySQL will be added to Windows Service and start automatically

### Step 3: Add MySQL to PATH
After installation, add MySQL to your system PATH:
1. Right-click "This PC" → "Properties"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", click "Path" → "Edit"
5. Click "New" and add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
6. Click OK and restart your terminal

### Step 4: Verify Installation
```powershell
mysql --version
```

### Step 5: Run Migration
```powershell
cd c:\Users\MoHG\Downloads\Ai-Career-Hub
python migrate.py
```

---

## Option 2: Use MariaDB (MySQL-Compatible Alternative)

MariaDB is a drop-in replacement for MySQL and easier to install.

### Step 1: Download MariaDB
- Go to: https://mariadb.org/download/
- Download **MariaDB 10.6** (MSI Installer for Windows)

### Step 2: Install MariaDB
1. Run the installer
2. Click "Next" through setup
3. When prompted for password, **leave it empty**
4. Complete installation
5. MariaDB will start automatically

### Step 3: Add to PATH
1. Right-click "This PC" → "Properties"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find "Path" → "Edit"
5. Click "New" and add: `C:\Program Files\MariaDB 10.6\bin`
6. Click OK and restart terminal

### Step 4: Run Migration
```powershell
cd c:\Users\MoHG\Downloads\Ai-Career-Hub
python migrate.py
```

---

## Option 3: Use Docker (Easiest if Docker Desktop is Running)

### Prerequisites
- Docker Desktop must be installed and **running**

### Step 1: Start Docker Desktop
- Click the Docker Desktop icon on your taskbar
- Wait for it to fully start (check system tray)

### Step 2: Start MySQL Container
```powershell
docker run --name ai_career_hub_mysql `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=ai_career_hub `
  -p 3306:3306 `
  -d mysql:8.0
```

### Step 3: Wait for Container to Start
```powershell
docker ps
```
Look for `ai_career_hub_mysql` in the list (takes 10-15 seconds)

### Step 4: Run Migration
```powershell
cd c:\Users\MoHG\Downloads\Ai-Career-Hub
python migrate.py
```

### Step 5: Stop Container (When Done)
```powershell
docker stop ai_career_hub_mysql
```

### Remove Container (When Completely Done)
```powershell
docker rm ai_career_hub_mysql
```

---

## Database Configuration

The `.env` file is already configured:
```env
DATABASE_URL=mysql+aiomysql://root:@localhost:3306/ai_career_hub
```

This expects:
- **Host:** localhost
- **Port:** 3306
- **Username:** root
- **Password:** (empty)
- **Database:** ai_career_hub

---

## Troubleshooting

### "mysql: command not found"
- MySQL/MariaDB is not in PATH
- Restart PowerShell/Terminal after adding to PATH
- Or use full path: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`

### "Access denied for user 'root'@'localhost'"
- Root password may have been set
- Update `backend/.env`:
  ```env
  DATABASE_URL=mysql+aiomysql://root:your_password@localhost:3306/ai_career_hub
  ```

### "Can't connect to MySQL server on 'localhost'"
- MySQL is not running
- Windows: Services → Look for "MySQL80" → Start it
- Docker: Start Docker Desktop and run the container

### Docker: "open //./pipe/dockerDesktopLinuxEngine"
- Docker Desktop is not running
- Start Docker Desktop from taskbar
- Wait 30 seconds for it to fully initialize

---

## Next Steps

Once MySQL is installed and running:

1. **Run the migration**
   ```powershell
   cd c:\Users\MoHG\Downloads\Ai-Career-Hub
   python migrate.py
   ```

2. **You should see:**
   ```
   ✅ Database migration completed!
      Executed: 36 statements
   
   📊 Database contains 19 tables:
      ✓ users
      ✓ profiles
      ... (and 17 more)
   
   👥 Sample data: 3 users found
   ```

3. **Start the backend**
   ```powershell
   cd backend
   uvicorn main:app --reload
   ```

4. **In another terminal, start the frontend**
   ```powershell
   npm run dev
   ```

5. **Access the application**
   - App: http://localhost:3000
   - API Docs: http://localhost:8000/docs

---

## Help

If you get stuck:
1. Check [MYSQL_SETUP.md](MYSQL_SETUP.md) for detailed MySQL setup
2. Check [DB_MIGRATION_SUMMARY.md](DB_MIGRATION_SUMMARY.md) for database info
3. Check the database schema: [database.sql](database.sql)

---

**Estimated Setup Time:**
- Option 1 (MySQL): 10-15 minutes
- Option 2 (MariaDB): 5-10 minutes
- Option 3 (Docker): 2-3 minutes (if Docker is already running)
