-- AYINEL Platform Database Setup Script
-- Run this script in pgAdmin4 or psql to set up the database

-- Create the database user
CREATE USER ayineluser WITH PASSWORD 'ayinelpass';

-- Create the main database
CREATE DATABASE ayinel_db OWNER ayineluser;

-- Create the shadow database for Prisma migrations
CREATE DATABASE ayinel_db_shadow OWNER ayineluser;

-- Grant necessary privileges
GRANT ALL PRIVILEGES ON DATABASE ayinel_db TO ayineluser;
GRANT ALL PRIVILEGES ON DATABASE ayinel_db_shadow TO ayineluser;

-- Connect to the main database
\c ayinel_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO ayineluser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ayineluser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ayineluser;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_handle ON users(handle);
CREATE INDEX IF NOT EXISTS idx_studios_handle ON studios(handle);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_reactions_video_id ON reactions(video_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_videos_title_fts ON videos USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_videos_description_fts ON videos USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_studios_name_fts ON studios USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_studios_description_fts ON studios USING gin(to_tsvector('english', description));

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_videos_studio_status ON videos(studio_id, status);
CREATE INDEX IF NOT EXISTS idx_videos_creator_status ON videos(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_comments_video_created ON comments(video_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reactions_video_user ON reactions(video_id, user_id);

-- Grant all privileges to the user
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ayineluser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ayineluser;

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
