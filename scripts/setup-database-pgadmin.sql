-- AYINEL Platform Database Setup Script for pgAdmin4
-- Run this script in pgAdmin4 Query Tool

-- Create the database user
CREATE USER ayineluser WITH PASSWORD 'ayinelpass';

-- Create the main database
CREATE DATABASE ayinel_db OWNER ayineluser;

-- Create the shadow database for Prisma migrations
CREATE DATABASE ayinel_db_shadow OWNER ayineluser;

-- Grant necessary privileges
GRANT ALL PRIVILEGES ON DATABASE ayinel_db TO ayineluser;
GRANT ALL PRIVILEGES ON DATABASE ayinel_db_shadow TO ayineluser;

-- Connect to the main database (you'll need to run this in a new query window)
-- \c ayinel_db;

-- Grant schema privileges (run this after connecting to ayinel_db)
-- GRANT ALL ON SCHEMA public TO ayineluser;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ayineluser;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ayineluser;

-- Enable necessary extensions (run this after connecting to ayinel_db)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- Set timezone (run this after connecting to ayinel_db)
-- SET timezone = 'UTC';

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
