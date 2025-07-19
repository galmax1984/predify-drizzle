# Docker Setup for Predify

This document explains how to run the Predify application using Docker with PostgreSQL support.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Production Setup

1. **Build and start the application:**
   ```bash
   docker compose up --build
   ```

2. **Run database migrations:**
   ```bash
   ./scripts/docker-migrate.sh
   ```

3. **Access the application:**
   - App: http://localhost:3000
   - Database: localhost:5432

### Development Setup

1. **Start the development environment:**
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

2. **The application will be available at:**
   - App: http://localhost:3000 (with hot reloading)
   - Database: localhost:5432

## Environment Variables

### Production (.env file)
```env
POSTGRES_URL=postgresql://predify_user:predify_password@postgres:5432/predify?sslmode=disable
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### Development
The development environment uses the same variables but with a different database name (`predify_dev`).

## Database

- **Host:** localhost (or `postgres` from within containers)
- **Port:** 5432
- **Database:** `predify` (production) / `predify_dev` (development)
- **Username:** `predify_user`
- **Password:** `predify_password`

## Useful Commands

### Start services
```bash
# Production
docker compose up -d

# Development
docker compose -f docker-compose.dev.yml up -d
```

### Stop services
```bash
# Production
docker compose down

# Development
docker compose -f docker-compose.dev.yml down
```

### View logs
```bash
# Production
docker compose logs -f app

# Development
docker compose -f docker-compose.dev.yml logs -f app
```

### Run migrations
```bash
./scripts/docker-migrate.sh
```

### Access database
```bash
docker exec -it predify_postgres psql -U predify_user -d predify
```

### Rebuild containers
```bash
# Production
docker compose up --build

# Development
docker compose -f docker-compose.dev.yml up --build
```

## Troubleshooting

### Port conflicts
If you get port conflicts, you can modify the ports in the docker-compose files:
- Change `"3000:3000"` to `"3001:3000"` for the app
- Change `"5432:5432"` to `"5433:5432"` for the database

### Database connection issues
1. Ensure the database container is running: `docker ps`
2. Check database logs: `docker compose logs postgres`
3. Verify environment variables are set correctly

### Build issues
1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker compose build --no-cache`

## File Structure

```
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Production orchestration
├── docker-compose.dev.yml  # Development orchestration
├── init-db.sql            # Database initialization
├── scripts/
│   └── docker-migrate.sh  # Migration script
└── .dockerignore          # Docker build exclusions
```

## Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Consider using Docker secrets for production deployments
- The current setup is for development/demo purposes 