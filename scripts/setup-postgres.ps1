# AYINEL PostgreSQL Setup Script for Windows
# Run this script as Administrator

Write-Host "🚀 Setting up PostgreSQL for AYINEL Platform..." -ForegroundColor Green

# Check if PostgreSQL is installed
$pgPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgPath) {
    Write-Host "❌ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "📥 Please install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "   Make sure to remember the password you set for the postgres user" -ForegroundColor Yellow
    Write-Host "   After installation, add PostgreSQL bin directory to your PATH" -ForegroundColor Yellow
    Write-Host "   Usually: C:\Program Files\PostgreSQL\[version]\bin" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ PostgreSQL found at: $($pgPath.Source)" -ForegroundColor Green

# Database configuration
$DB_NAME = "ayinel_db"
$DB_USER = "ayineluser"
$DB_PASS = "ayinelpass"
$DB_HOST = "localhost"
$DB_PORT = "5432"

Write-Host "📊 Database Configuration:" -ForegroundColor Cyan
Write-Host "   Database: $DB_NAME" -ForegroundColor White
Write-Host "   User: $DB_USER" -ForegroundColor White
Write-Host "   Host: $DB_HOST" -ForegroundColor White
Write-Host "   Port: $DB_PORT" -ForegroundColor White

# Test connection to PostgreSQL
Write-Host "🔍 Testing PostgreSQL connection..." -ForegroundColor Yellow
try {
    $testConnection = psql -h $DB_HOST -p $DB_PORT -U postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL connection successful" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL connection failed" -ForegroundColor Red
        Write-Host "   Make sure PostgreSQL service is running" -ForegroundColor Yellow
        Write-Host "   You may need to enter the postgres user password" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Error connecting to PostgreSQL: $_" -ForegroundColor Red
    exit 1
}

# Create database user
Write-Host "👤 Creating database user..." -ForegroundColor Yellow
$createUserSQL = "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
try {
    psql -h $DB_HOST -p $DB_PORT -U postgres -c $createUserSQL
    Write-Host "✅ Database user created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  User might already exist, continuing..." -ForegroundColor Yellow
}

# Create database
Write-Host "🗄️  Creating database..." -ForegroundColor Yellow
$createDBSQL = "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
try {
    psql -h $DB_HOST -p $DB_PORT -U postgres -c $createDBSQL
    Write-Host "✅ Database created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Database might already exist, continuing..." -ForegroundColor Yellow
}

# Create shadow database for Prisma
Write-Host "🔄 Creating shadow database..." -ForegroundColor Yellow
$SHADOW_DB_NAME = "${DB_NAME}_shadow"
$createShadowDBSQL = "CREATE DATABASE $SHADOW_DB_NAME OWNER $DB_USER;"
try {
    psql -h $DB_HOST -p $DB_PORT -U postgres -c $createShadowDBSQL
    Write-Host "✅ Shadow database created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Shadow database might already exist, continuing..." -ForegroundColor Yellow
}

# Grant privileges
Write-Host "🔐 Granting privileges..." -ForegroundColor Yellow
$grantPrivilegesSQL = @"
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $SHADOW_DB_NAME TO $DB_USER;
"@

try {
    psql -h $DB_HOST -p $DB_PORT -U postgres -c $grantPrivilegesSQL
    Write-Host "✅ Privileges granted successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Error granting privileges: $_" -ForegroundColor Yellow
}

# Test connection with new user
Write-Host "🔍 Testing connection with new user..." -ForegroundColor Yellow
try {
    $testNewConnection = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 'Connection successful' as status;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ New user connection successful" -ForegroundColor Green
    } else {
        Write-Host "❌ New user connection failed" -ForegroundColor Red
        Write-Host "   You may need to enter the password: $DB_PASS" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error testing new user connection: $_" -ForegroundColor Red
}

Write-Host "`n🎉 PostgreSQL setup completed!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run: pnpm --filter @ayinel/api db:migrate" -ForegroundColor White
Write-Host "   2. Run: pnpm --filter @ayinel/api db:seed" -ForegroundColor White
Write-Host "   3. Run: pnpm dev" -ForegroundColor White
Write-Host "`n🌐 Your AYINEL platform will be available at:" -ForegroundColor Cyan
Write-Host "   Web: http://localhost:3000" -ForegroundColor White
Write-Host "   API: http://localhost:3001" -ForegroundColor White
Write-Host "   API Docs: http://localhost:3001/api/docs" -ForegroundColor White
