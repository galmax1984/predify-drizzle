#!/bin/bash

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec predify_postgres pg_isready -U predify_user -d predify; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready!"

# Run migrations
echo "Running database migrations..."
docker exec predify_app pnpm drizzle-kit push

echo "Migrations completed!" 