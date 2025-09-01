-- Quick AYINEL Database Setup
-- Run this in pgAdmin4 Query Tool

-- Create user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ayineluser') THEN
        CREATE USER ayineluser WITH PASSWORD 'ayinelpass';
    END IF;
END
$$;

-- Create databases if not exist
SELECT 'CREATE DATABASE ayinel_db OWNER ayineluser'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ayinel_db')\gexec

SELECT 'CREATE DATABASE ayinel_db_shadow OWNER ayineluser'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ayinel_db_shadow')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ayinel_db TO ayineluser;
GRANT ALL PRIVILEGES ON DATABASE ayinel_db_shadow TO ayineluser;

SELECT 'Database setup completed!' as status;
