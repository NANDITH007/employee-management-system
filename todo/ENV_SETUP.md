# Backend Environment Configuration Guide

## Overview

The backend uses environment variables stored in a `.env` file for secure configuration. This prevents sensitive information (database credentials, API keys, etc.) from being committed to version control.

## Setup Instructions

### Step 1: Create the `.env` File

1. Navigate to the backend directory:
   ```bash
   cd todo
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env
   ```

3. Or create a new `.env` file with your own values (see Configuration Options below)

### Step 2: Configure Environment Variables

Edit the `.env` file and update the following variables with your actual values:

```env
# Database Configuration
DB_URL=your_database_url
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# Server Port
SERVER_PORT=8001

# Other configurations...
```

### Step 3: Run the Application

The `.env` file will be automatically loaded when the Spring Boot application starts.

```bash
# Using Maven
mvn spring-boot:run

# Or with Java directly
java -jar target/todo-0.0.1-SNAPSHOT.jar
```

## Configuration Options

### Database Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_URL` | PostgreSQL connection URL | `jdbc:postgresql://host:5432/dbname?sslmode=require` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `secure_password` |

### Server Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `SERVER_PORT` | Server port | `8001` |

### Hibernate/JPA Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `JPA_HIBERNATE_DDL_AUTO` | DDL auto strategy | `update` (create-drop, validate, update) |
| `JPA_DATABASE_PLATFORM` | Database dialect | `org.hibernate.dialect.PostgreSQLDialect` |
| `JPA_SHOW_SQL` | Show SQL in logs | `true` |
| `JPA_FORMAT_SQL` | Format SQL output | `true` |

### Connection Pool Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `DATASOURCE_HIKARI_MAX_POOL_SIZE` | Max connections | `5` |
| `DATASOURCE_HIKARI_MIN_IDLE` | Min idle connections | `1` |
| `DATASOURCE_HIKARI_CONNECTION_TIMEOUT` | Connection timeout (ms) | `30000` |
| `DATASOURCE_HIKARI_IDLE_TIMEOUT` | Idle timeout (ms) | `600000` |
| `DATASOURCE_HIKARI_MAX_LIFETIME` | Max lifetime (ms) | `1800000` |

### Logging Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `LOGGING_LEVEL_HIBERNATE_SQL` | Hibernate SQL log level | `DEBUG` |
| `LOGGING_LEVEL_HIBERNATE_BINDER` | Hibernate binder log level | `TRACE` |

### CORS Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:5174,http://localhost:5173` |

### Application Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_NAME` | Application name | `todo-fullstack` |
| `APP_ENV` | Environment | `development` (development, staging, production) |

## Security Best Practices

⚠️ **IMPORTANT**: Never commit the `.env` file to version control!

1. **Keep `.env` out of Git**: The `.env` file is already listed in `.gitignore` to prevent accidental commits

2. **Use `.env.example`**: Share `.env.example` with the team, showing the structure but not actual values

3. **Rotate Credentials**: Change database passwords and API keys regularly

4. **Use Environment Variables**: In production, set environment variables directly instead of using a `.env` file

5. **Restrict File Permissions**: Ensure `.env` has restricted permissions:
   ```bash
   chmod 600 .env
   ```

6. **Different Values for Different Environments**:
   - Development: Use local database
   - Staging: Use staging database with test credentials
   - Production: Use production database with robust encryption

## Using Different Environment Configurations

### Local Development (with .env)
```bash
mvn spring-boot:run
```

### Production (with system environment variables)
Set environment variables directly in your deployment system:
```bash
export DB_URL="your_production_db_url"
export DB_USERNAME="prod_username"
export DB_PASSWORD="prod_password"
java -jar todo-0.0.1-SNAPSHOT.jar
```

### Docker (recommended for consistency)
```dockerfile
ENV DB_URL=jdbc:postgresql://db:5432/neondb
ENV DB_USERNAME=neondb_owner
ENV DB_PASSWORD=${DB_PASSWORD}
```

## Troubleshooting

### `.env` file not being loaded
- Ensure `.env` is in the project root directory (`todo/`)
- Check that the `EnvConfig` class is being recognized by Spring
- Look for error messages in the application startup logs

### Database connection fails
- Verify `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` are correct
- Test the connection manually with a database client
- Check network connectivity to the database server
- Ensure SSL/TLS settings match your database configuration

### Port already in use
- Change the `SERVER_PORT` value in `.env`
- Or kill the process using the current port:
  ```bash
  # Windows
  netstat -ano | findstr :8001
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -i :8001
  kill -9 <PID>
  ```

## Additional Resources

- [Spring Boot Configuration](https://spring.io/blog/2008/10/06/spring-support-for-externalizing-configuration/)
- [Environment Variables Best Practices](https://12factor.net/config)
- [Java Dotenv Library](https://github.com/cdimascio/java-dotenv)
