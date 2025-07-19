-- Create the database if it doesn't exist
-- This is handled by the POSTGRES_DB environment variable in docker-compose

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE predify TO predify_user;

-- Connect to the predify database
\c predify;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO predify_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO predify_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO predify_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO predify_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO predify_user; 