# Use this script to start a docker container for a local development database

# Load .env file
Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]*)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path "Env:$name" -Value $value
    }
}

# Parse DATABASE_URL
$databaseUrl = $Env:DATABASE_URL

if (-not $databaseUrl) {
    Write-Host "DATABASE_URL not found in .env"
    exit 1
}

# Extract values using regex
if ($databaseUrl -match ":(.+?)@") {
    $DB_PASSWORD = $matches[1]
}
if ($databaseUrl -match ":(\d+)/") {
    $DB_PORT = $matches[1]
}
if ($databaseUrl -match "/([^/]+)$") {
    $DB_NAME = $matches[1]
}

$DB_CONTAINER_NAME = "$DB_NAME-postgres"

# Check for docker or podman
$DOCKER_CMD = $null
if (Get-Command docker -ErrorAction SilentlyContinue) {
    $DOCKER_CMD = "docker"
} elseif (Get-Command podman -ErrorAction SilentlyContinue) {
    $DOCKER_CMD = "podman"
} else {
    Write-Host "Docker or Podman is not installed."
    exit 1
}

# Check if daemon is running
try {
    & $DOCKER_CMD info | Out-Null
} catch {
    Write-Host "$DOCKER_CMD daemon is not running. Please start it and try again."
    exit 1
}

# Check if port is in use
$portInUse = Get-NetTCPConnection -LocalPort $DB_PORT -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Port $DB_PORT is already in use."
    exit 1
}

# Check if container is running
$running = & $DOCKER_CMD ps -q -f "name=$DB_CONTAINER_NAME"
if ($running) {
    Write-Host "Database container '$DB_CONTAINER_NAME' already running"
    exit 0
}

# Check if container exists but stopped
$existing = & $DOCKER_CMD ps -q -a -f "name=$DB_CONTAINER_NAME"
if ($existing) {
    & $DOCKER_CMD start $DB_CONTAINER_NAME
    Write-Host "Existing database container '$DB_CONTAINER_NAME' started"
    exit 0
}

# Handle default password
if ($DB_PASSWORD -eq "password") {
    Write-Host "You are using the default database password"
    $reply = Read-Host "Should we generate a random password for you? [y/N]"
    if ($reply -notmatch "^[Yy]$") {
        Write-Host "Please change the default password in the .env file and try again"
        exit 1
    }

    # Generate random password
    $bytes = New-Object byte[] 12
    (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
    $DB_PASSWORD = [Convert]::ToBase64String($bytes).Replace('+','-').Replace('/','_')

    # Update .env file
    (Get-Content .env) -replace ":password@", ":$DB_PASSWORD@" | Set-Content .env
}

# Run container
& $DOCKER_CMD run -d `
    --name $DB_CONTAINER_NAME `
    -e POSTGRES_USER="postgres" `
    -e POSTGRES_PASSWORD="$DB_PASSWORD" `
    -e POSTGRES_DB="$DB_NAME" `
    -p "$DB_PORT`:5432" `
    docker.io/postgres

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database container '$DB_CONTAINER_NAME' was successfully created"
}