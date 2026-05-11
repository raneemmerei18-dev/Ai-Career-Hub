# MySQL Setup Guide for AI Career Hub

## Quick Start

### 1. Install MySQL/MariaDB

**On Windows:**
- Download [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- Or use [MariaDB](https://mariadb.org/download/)
- Run the installer and follow setup wizard

**On macOS:**
```bash
# Using Homebrew
brew install mysql
# or
brew install mariadb
```

**On Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mysql-server
# or
sudo apt-get install mariadb-server
```

### 2. Start MySQL/MariaDB Service

**Windows:**
```bash
# MySQL service should start automatically
# Or start via Services panel
```

**macOS:**
```bash
brew services start mysql
# or
mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
# or
sudo systemctl start mariadb
```

### 3. Import Database Schema

**Option A: Using Command Line**

```bash
# Log in to MySQL
mysql -u root -p

# Enter password when prompted (default: empty or your set password)
# Then run:
CREATE DATABASE IF NOT EXISTS ai_career_hub;
USE ai_career_hub;
SOURCE /path/to/database.sql;
```

**Option B: Using phpMyAdmin**

1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Log in with credentials (default: root / no password)
3. Go to "Import" tab
4. Select `database.sql` file from your project
5. Click "Go" to import

**Option C: Using MySQL Workbench**

1. Open MySQL Workbench
2. Create new connection to localhost
3. Open the `database.sql` file
4. Execute the query

### 4. Verify Database Setup

```bash
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use the new database
USE ai_career_hub;

# Show tables
SHOW TABLES;

# Check sample data
SELECT COUNT(*) FROM users;
```

### 5. Configure Backend

Update `backend/.env` with your MySQL credentials:

```env
DATABASE_URL=mysql+aiomysql://root:your_password@localhost:3306/ai_career_hub
```

### 6. Install Python Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies (now includes aiomysql)
pip install -e .
```

### 7. Start Backend Server

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Database Connection Details

### Default Configuration

| Setting | Value |
|---------|-------|
| **Host** | localhost |
| **Port** | 3306 |
| **Username** | root |
| **Password** | root (or empty) |
| **Database** | ai_career_hub |
| **Driver** | aiomysql (async) |

### Connection String Formats

```python
# Python/SQLAlchemy (Async)
DATABASE_URL=mysql+aiomysql://root:password@localhost:3306/ai_career_hub

# Python/SQLAlchemy (Sync)
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/ai_career_hub

# phpMyAdmin
http://localhost/phpmyadmin
Username: root
Password: (your password)

# MySQL Command Line
mysql -u root -p ai_career_hub
```

## Database Architecture

### Core Tables

| Table | Purpose | Records |
|-------|---------|---------|
| **users** | User accounts and authentication | - |
| **profiles** | Extended profile information | - |
| **skills** | Skill catalog and user skills | 5 sample |
| **experiences** | Work experience history | 2 sample |
| **education** | Educational background | 2 sample |
| **resumes** | Resume documents | - |
| **cover_letters** | Cover letters | - |
| **jobs** | Job listings | - |
| **interviews** | Interview sessions | - |
| **learning_paths** | Learning recommendations | - |
| **notifications** | User notifications | - |
| **subscriptions** | Premium subscriptions | 3 sample |

**Total Tables: 19**
**Total Sample Records: 15+**

## Sample Data

The `database.sql` file includes sample data:

### Users
- john.doe@example.com (Full Stack Developer)
- jane.smith@example.com (Product Manager)
- admin@aicareerhub.com (Admin)

### Skills
- Python (Technical, Expert)
- JavaScript (Technical, Advanced)
- React (Framework, Advanced)
- Leadership (Soft, Expert)
- Communication (Soft, Advanced)

### Experiences & Education
- 2 work experiences
- 2 educational records

### Subscriptions
- 3 subscription plans (Free, Pro, Enterprise)

## Troubleshooting

### Issue: "Access denied for user 'root'@'localhost'"

**Solution:**
```bash
# Reset MySQL root password
# Windows:
mysql -u root

# If prompted for password:
# Try empty password or your set password
```

### Issue: "No database selected"

**Solution:**
```bash
# Specify database in command
mysql -u root -p ai_career_hub

# Or inside MySQL:
USE ai_career_hub;
```

### Issue: "Module 'aiomysql' not found"

**Solution:**
```bash
# Reinstall dependencies
cd backend
pip install -e .
# or
pip install aiomysql pymysql
```

### Issue: Connection timeout

**Solution:**
- Check MySQL service is running
- Verify host/port in .env
- Check firewall settings
- Try localhost vs 127.0.0.1

### Issue: "Charset" errors

**Solution:**
The database is configured with UTF8MB4. Make sure your MySQL client supports it:
```bash
mysql --default-character-set=utf8mb4 -u root -p
```

## Performance Optimization

### Recommended MySQL Configuration

Add to `my.cnf` or `my.ini`:

```ini
[mysqld]
# Performance
max_connections=100
innodb_buffer_pool_size=256M
query_cache_size=32M

# Character Set
character_set_server=utf8mb4
collation_server=utf8mb4_unicode_ci

# Logging
log-error=error.log
slow_query_log=1
long_query_time=2
```

### Enable Query Logging

```sql
SET GLOBAL log_output = 'TABLE';
SET GLOBAL general_log = 'ON';

-- View logs
SELECT * FROM mysql.general_log;

-- Disable when done
SET GLOBAL general_log = 'OFF';
```

## Backup & Restore

### Backup Database

```bash
# Backup entire database
mysqldump -u root -p ai_career_hub > backup.sql

# Backup all databases
mysqldump -u root -p --all-databases > backup_all.sql

# With structure only
mysqldump -u root -p --no-data ai_career_hub > structure.sql
```

### Restore Database

```bash
# From backup
mysql -u root -p ai_career_hub < backup.sql

# Restore all databases
mysql -u root -p < backup_all.sql
```

## Remote Connection

### Allow Remote Connections

```sql
-- Create remote user
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON ai_career_hub.* TO 'remote_user'@'%';
FLUSH PRIVILEGES;

-- Or for specific IP
CREATE USER 'remote_user'@'192.168.1.100' IDENTIFIED BY 'strong_password';
```

### Update .env for Remote

```env
DATABASE_URL=mysql+aiomysql://remote_user:strong_password@remote_host:3306/ai_career_hub
```

## Next Steps

1. ✅ Database is set up
2. ✅ Sample data is imported
3. → Run backend: `uvicorn main:app --reload`
4. → Run frontend: `npm run dev`
5. → Test API at `http://localhost:8000/docs`

## Support

For issues, check:
- MySQL/MariaDB documentation
- Backend logs in terminal
- Database error logs in MySQL
- phpMyAdmin for visual inspection
