<#
psql DB reset helper (PowerShell)
Usage: Set environment variable PGPASSWORD or be ready to enter the postgres password interactively.
  $env:PGPASSWORD = 'postgres_password'
  .\psql_db_reset.ps1 -DbName ai_career_hub -DbOwner app_user -DbOwnerPassword 'raneem12$'

This script will: find psql.exe, terminate connections to the DB, DROP DATABASE IF EXISTS, CREATE USER, CREATE DATABASE.
#>

param(
    [string]$DbName = 'ai_career_hub',
    [string]$DbOwner = 'app_user',
    [string]$DbOwnerPassword = 'raneem12$'
)

function Find-PSQL {
    $cmd = Get-Command psql -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Path }
    $found = Get-ChildItem 'C:\Program Files\PostgreSQL' -Recurse -Filter psql.exe -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($found) { return $found }
    return $null
}

$psql = Find-PSQL
if (-not $psql) {
    Write-Host "psql.exe not found. Install PostgreSQL or add psql to PATH." -ForegroundColor Red
    exit 1
}

Write-Host "Using psql: $psql"

# Create user (if not exists) and set password using PL/pgSQL
& $psql -U postgres -c "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DbOwner') THEN CREATE ROLE $DbOwner LOGIN PASSWORD '$DbOwnerPassword'; END IF; END $$ LANGUAGE plpgsql;"
if ($LASTEXITCODE -ne 0) { Write-Host "Failed to create/set user. You may need to run this manually." -ForegroundColor Yellow }

# Terminate connections and drop/create database
& $psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DbName' AND pid <> pg_backend_pid();"
& $psql -U postgres -c "DROP DATABASE IF EXISTS $DbName;"
& $psql -U postgres -c "CREATE DATABASE $DbName OWNER $DbOwner ENCODING 'UTF8' TEMPLATE template0;"

if ($LASTEXITCODE -eq 0) { Write-Host "Database $DbName recreated and owned by $DbOwner" -ForegroundColor Green } else { Write-Host "One or more commands failed; inspect output above." -ForegroundColor Yellow }
