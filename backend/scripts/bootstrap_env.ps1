<#
Bootstrap environment helper (PowerShell)
Usage: Open PowerShell as Administrator (if needed) and run:
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  .\bootstrap_env.ps1
This script will:
 - Search common locations for Python executables
 - Choose the highest Python >= 3.11 if found (fallback to highest found)
 - Remove existing .venv, create a new venv, upgrade pip and install required packages
#>

function Find-PythonExes {
    $results = @()
    # Check PATH
    $cmd = Get-Command python -ErrorAction SilentlyContinue
    if ($cmd) { $results += $cmd.Path }

    # Common install locations
    $candidates = @(
        "$env:LOCALAPPDATA\Programs\Python\*\python.exe",
        "C:\\Program Files\\Python*\\python.exe",
        "C:\\Program Files (x86)\\Python*\\python.exe",
        "C:\\Users\\*\\AppData\\Local\\Programs\\Python\\*\\python.exe"
    )
    foreach ($pat in $candidates) {
        $found = Get-ChildItem -Path $pat -File -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName
        if ($found) { $results += $found }
    }

    # Remove duplicates
    $results = $results | Sort-Object -Unique
    return $results
}

function Choose-Python {
    param($paths)
    $best = $null
    $bestVer = [version]'0.0'
    foreach ($p in $paths) {
        try {
            $verOut = & $p --version 2>&1
            if ($verOut) {
                if ($verOut -match 'Python (\d+\.\d+\.\d+)') {
                    $ver = [version]$Matches[1]
                    if ($ver -ge [version]'3.11.0' -and $ver -gt $bestVer) { $best = $p; $bestVer = $ver }
                    elseif ($best -eq $null -and $ver -gt $bestVer) { $best = $p; $bestVer = $ver }
                }
            }
        } catch {}
    }
    return @{Path=$best;Version=$bestVer}
}

Write-Host "Searching for Python installations..."
$exes = Find-PythonExes
if (-not $exes -or $exes.Count -eq 0) {
    Write-Host "No Python executables found. Please install Python 3.11+ and re-run this script." -ForegroundColor Yellow
    exit 1
}

$choice = Choose-Python -paths $exes
if (-not $choice.Path) {
    Write-Host "Couldn't determine a usable Python. Found: $($exes -join ', ')" -ForegroundColor Yellow
    exit 1
}

Write-Host "Using Python: $($choice.Path) (version $($choice.Version))"

# Remove existing venv if present
if (Test-Path .\.venv) {
    Write-Host "Removing existing .venv..."
    Remove-Item -Recurse -Force .\.venv
}

Write-Host "Creating virtual environment..."
& $choice.Path -m venv .venv
if ($LASTEXITCODE -ne 0) { Write-Host "Failed to create venv" -ForegroundColor Red; exit 1 }

$py = Join-Path -Path (Get-Location) -ChildPath ".\.venv\Scripts\python.exe"
if (-not (Test-Path $py)) { Write-Host "Virtualenv python not found at $py" -ForegroundColor Red; exit 1 }

Write-Host "Upgrading pip and installing packages..."
& $py -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) { Write-Host "pip upgrade failed" -ForegroundColor Yellow }

# Install required packages
& $py -m pip install "asyncpg>=0.27.0" "psycopg[binary]>=3.2"
if ($LASTEXITCODE -ne 0) { Write-Host "Package installation failed. Try running the commands manually:"; Write-Host "$py -m pip install \"asyncpg>=0.27.0\" \"psycopg[binary]>=3.2\""; exit 1 }

Write-Host "Bootstrapping complete. Activate venv with:`".\.venv\Scripts\Activate.ps1`" and run your app." -ForegroundColor Green
