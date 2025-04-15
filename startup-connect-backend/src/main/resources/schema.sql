-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS pitch_decks;
DROP TABLE IF EXISTS startup_profiles;

-- Create startup_profiles table first
CREATE TABLE startup_profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    founded_date DATE,
    industry VARCHAR(100),
    stage VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pitch_decks table with the correct schema
CREATE TABLE pitch_decks (
    id SERIAL PRIMARY KEY,
    startup_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    version INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startup_profiles(id) ON DELETE CASCADE
);

-- Create index on startup_id for faster lookups
CREATE INDEX idx_pitch_decks_startup_id ON pitch_decks(startup_id); 