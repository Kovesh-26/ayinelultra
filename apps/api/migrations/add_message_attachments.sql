-- Migration: Add image attachment support to messages
-- This migration adds the necessary fields to support image uploads in chat messages

-- Add new columns to the messages table
ALTER TABLE messages 
ADD COLUMN text TEXT,
ADD COLUMN attachment_url TEXT,
ADD COLUMN attachment_type VARCHAR(50),
ADD COLUMN reply_to_id TEXT;

-- Copy existing content to the new text field
UPDATE messages SET text = content WHERE content IS NOT NULL;

-- Add index for better performance on reply lookups
CREATE INDEX idx_messages_reply_to_id ON messages(reply_to_id);

-- Add foreign key constraint for message replies (optional, uncomment if needed)
-- ALTER TABLE messages 
-- ADD CONSTRAINT fk_messages_reply_to 
-- FOREIGN KEY (reply_to_id) REFERENCES messages(id) ON DELETE SET NULL;

-- Create table for AI interactions (if not exists)
CREATE TABLE IF NOT EXISTS ai_interactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    context TEXT DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for better performance on AI interaction queries
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at);

-- Optional: Remove the old content column after migration is complete
-- ALTER TABLE messages DROP COLUMN content;