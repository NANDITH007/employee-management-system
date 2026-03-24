# Environment Configuration - Quick Reference

## 🔐 What Was Set Up

Your backend now has a secure environment configuration system with the following components:

### Files Created:

1. **`.env`** - Contains sensitive configuration values (NEVER commit to Git)
2. **`.env.example`** - Template showing the configuration structure
3. **`ENV_SETUP.md`** - Complete setup and configuration guide
4. **`EnvConfig.java`** - Automatic loader that reads .env at application startup
5. **Updated `application.properties`** - Now uses `${ENV_VAR}` syntax

### Files Updated:

- **`.gitignore`** - Excludes `.env`, `.env.local`, and credential files
- **`pom.xml`** - Added necessary configuration

---

## 🚀 Quick Start

### 1. Verify `.env` File Exists
```bash
cd todo
ls .env  # or dir .env on Windows
```

### 2. Check Configuration
```bash
# View current environment settings (without credentials)
grep "=" .env | head -10
```

### 3. Run the Application
```bash
# The .env file is automatically loaded on startup
mvn spring-boot:run
```

### 4. Verify Correct Port
```bash
# Backend will now run on port from .env (currently 8001)
curl http://localhost:8001/api/employees
```

---

## 📋 Current Configuration

| Setting | Value | Location |
|---------|-------|----------|
| **Database URL** | Neon PostgreSQL | `.env` → `DB_URL` |
| **Database User** | neondb_owner | `.env` → `DB_USERNAME` |
| **Database Password** | (stored safely) | `.env` → `DB_PASSWORD` |
| **Server Port** | 8001 | `.env` → `SERVER_PORT` |
| **Hibernate DDL** | update | `.env` → `JPA_HIBERNATE_DDL_AUTO` |

---

## 🔍 Environment Variables Supported

### Database
- `DB_URL` - PostgreSQL connection string
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

### Server
- `SERVER_PORT` - Application port (default: 8000)

### Connection Pool
- `DATASOURCE_HIKARI_MAX_POOL_SIZE` - Max connections
- `DATASOURCE_HIKARI_MIN_IDLE` - Min idle connections
- `DATASOURCE_HIKARI_CONNECTION_TIMEOUT` - Timeout (ms)
- `DATASOURCE_HIKARI_IDLE_TIMEOUT` - Idle timeout (ms)
- `DATASOURCE_HIKARI_MAX_LIFETIME` - Max lifetime (ms)

### Hibernate/JPA
- `JPA_HIBERNATE_DDL_AUTO` - DDL strategy (create-drop, validate, update)
- `JPA_DATABASE_PLATFORM` - Database dialect
- `JPA_SHOW_SQL` - Show SQL in logs
- `JPA_FORMAT_SQL` - Format SQL output

### Logging
- `LOGGING_LEVEL_HIBERNATE_SQL` - SQL log level
- `LOGGING_LEVEL_HIBERNATE_BINDER` - Parameter binding log level

### CORS
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins (comma-separated)

### Application
- `APP_NAME` - Application name
- `APP_ENV` - Environment (development, staging, production)

---

## ✅ How It Works

1. **Application Start**: Spring Boot starts your application
2. **EnvConfig Loaded**: `EnvConfig.java` is instantiated by Spring
3. **.env File Read**: EnvConfig reads the `.env` file line by line
4. **System Properties Set**: Each `KEY=VALUE` is set as a system property
5. **Properties Resolved**: `application.properties` uses `${KEY}` to get values
6. **Application Created**: Spring Boot creates beans with resolved values

---

## 🛡️ Security Checklist

- ✅ `.env` is in `.gitignore` (won't be committed)
- ✅ `.env.example` shows structure (you can share this)
- ✅ Credentials are only in `.env` (local machine)
- ✅ `EnvConfig.java` loads from `.env` automatically
- ✅ No sensitive data in `application.properties`
- ✅ No sensitive data in `pom.xml`

---

## 📝 For Team Members

When a new developer joins your team:

1. They clone the repository
2. They see `.env.example` (structure example)
3. They create their own `.env` file from `.env.example`
4. They fill in their own credentials
5. They run the application (`.env` loads automatically)

**Share this file with them:**
```bash
cat .env.example
# → They copy this structure
# → They create .env locally
# → They add their credentials
```

---

## 🔄 Changing Configuration

### To Update Settings:

**Option 1: Edit `.env` file**
```bash
# Edit the .env file
nano .env
# Change values like:
# SERVER_PORT=8002
# DB_URL=your_new_url

# Restart application - changes load automatically
mvn spring-boot:run
```

**Option 2: System Environment Variables (Production)**
```bash
# Export environment variables
export DB_URL="your_production_url"
export DB_USERNAME="prod_user"
export DB_PASSWORD="prod_password"

# Start application
java -jar target/todo-0.0.1-SNAPSHOT.jar
```

---

## 🐛 Troubleshooting

### `.env` not being loaded?
- Check `.env` exists in `todo/` directory
- Check it has correct `KEY=VALUE` format
- Check for spaces: `KEY = VALUE` (spaces are kept in value)
- Look for log messages starting with "✓" or "⚠"

### Wrong values being used?
- Environment variables override `.env` values
- Check: `echo %DB_URL%` (Windows) or `echo $DB_URL` (Linux)
- Remove env vars: `unset DB_URL` then restart

### Port already in use?
- Change `SERVER_PORT` in `.env` to a free port
- Or kill process: `lsof -i :8001` then `kill -9 <PID>`

### Database connection fails?
- Verify `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` are correct
- Test connection manually with a database client
- Check network connectivity to database

---

## 📚 Additional Resources

- **Complete Setup Guide**: `ENV_SETUP.md`
- **12 Factor App Config Guidelines**: https://12factor.net/config
- **Spring Boot Externalized Configuration**: https://spring.io/blog/2008/10/06/spring-support-for-externalizing-configuration/

---

## 🎯 Best Practices

1. ✅ Never commit `.env` to Git
2. ✅ Use `.env.example` for structure documentation
3. ✅ Use different `.env` files for different environments
4. ✅ Rotate credentials regularly
5. ✅ Keep database passwords secure
6. ✅ Don't share `.env` via email/chat
7. ✅ Use production env variables for production (not `.env` files)

---

**Last Updated**: March 24, 2026
**Status**: ✅ Fully Configured
