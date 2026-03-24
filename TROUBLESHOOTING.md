# Leave Management - Troubleshooting Guide

## Quick Checklist

Before debugging, ensure you've completed these steps:

- [ ] Backend running on `http://localhost:8000` 
- [ ] Frontend running on `http://localhost:5173` (or your Vite port)
- [ ] `.env.local` file created in `client/` directory
- [ ] `npm install` run in `client/` folder for calendar dependencies

---

## Common Issues & Solutions

### 1. ❌ "Failed to load employees" Error

**Symptoms**: Error banner shows when opening Leave Management tab

**Solutions**:

**A. Backend not running**
```bash
# Check backend status
cd todo
mvn clean install -DskipTests
java -jar target/todo-0.0.1-SNAPSHOT.jar

# Should see: "Tomcat initialized with port(s): 8000"
```

**B. Database connection failed**
```bash
# Check application.properties
cat todo/src/main/resources/application.properties

# Test database connection:
# Make sure spring.datasource.url is reachable
# - For Neon PostgreSQL: Ensure internet connection
# - For local DB: Ensure PostgreSQL is running
```

**C. Wrong API URL**
```bash
# Verify .env.local exists and has correct URL
cat client/.env.local

# Should show:
# VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. ❌ Calendar Not Loading / Blank Screen

**Symptoms**: Leave Management tab loads but shows "Loading..." indefinitely

**Solutions**:

**A. Check browser console (F12)**
```
Expected: No errors, only API calls
Look for: 
- CORS errors → Backend CORS misconfigured
- Network errors → API not reachable
- Module errors → react-calendar not installed
```

**B. Reinstall dependencies**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**C. Verify calendar library installed**
```bash
npm list react-calendar date-fns

# Should show:
# react-calendar@4.7.0
# date-fns@3.0.0
```

### 3. ❌ "No leave requests found" (but should have data)

**Symptoms**: Employee dropdown works, calendar shows, but no leaves display

**Solutions**:

**A. Verify database has data**
```bash
# Check if Leave table was created and populated
# Connect to your database and run:
SELECT * FROM leaves;
# Should show leave records if any were created
```

**B. Check employee-leave relationship**
```bash
# Verify employeeId matches employees
SELECT * FROM leaves WHERE employee_id IS NULL;
# NULL employeeId means leave requests weren't saved properly
```

**C. Submit a test leave request**
1. Click "Request New Leave"
2. Select dates and add reason
3. Click "Submit Request"
4. Check browser console (F12) for errors
5. If error shows, see "API Errors" section below

### 4. ❌ Cannot Submit Leave Request

**Symptoms**: "Submit Request" button clicked but nothing happens

**Solutions**:

**A. Browser console check**
```
Open F12 → Console tab
Click "Submit Request"
Look for error messages
```

**B. Validate input fields**
- Start Date must be filled (required)
- End Date must be filled (required)
- Start Date should be before End Date
- Dates should be in format YYYY-MM-DD

**C. Check API endpoint**
```bash
# Test POST request manually using curl:
curl -X POST http://localhost:8000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": 1,
    "startDate": "2026-04-01",
    "endDate": "2026-04-05",
    "reason": "Vacation test",
    "status": "PENDING"
  }'

# Should return 200 with created leave object
```

---

## Detailed API Tests

### Test 1: Are employees being loaded?
```bash
curl http://localhost:8000/api/employees

# Expected output: JSON array of employees
# Example: [{"id":1,"firstName":"John","lastName":"Doe",...}]

# If error:
# - Backend not running
# - Wrong port
# - Employees table is empty
```

### Test 2: Get all leaves
```bash
curl http://localhost:8000/api/leaves

# Expected output: JSON array of leaves
# Example: [{"id":1,"employeeId":1,"startDate":"2026-04-01",...}]

# If empty array: No leaves created yet (normal)
# If error: LeaveRepository not working
```

### Test 3: Get leaves for specific employee
```bash
curl http://localhost:8000/api/leaves/employee/1

# Replace "1" with actual employee ID
# Expected: Leaves for that employee
```

### Test 4: Create a leave request
```bash
curl -X POST http://localhost:8000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": 1,
    "startDate": "2026-04-01",
    "endDate": "2026-04-03",
    "reason": "Test vacation",
    "status": "PENDING"
  }'

# Expected: 200 OK with created leave object
# If 400 Bad Request: Check JSON format
# If 500 Server Error: Check backend logs
```

---

## Browser Console Debugging

Press **F12** → **Console** tab and look for these patterns:

### ✅ Good Signs
```
GET http://localhost:8000/api/employees 200
GET http://localhost:8000/api/leaves 200
```

### ❌ Bad Signs
```
Failed to fetch - CORS error → Backend CORS misconfigured
Cannot find module 'react-calendar' → Dependencies not installed
GET http://localhost:8000/api/employees 404 → Wrong port
GET http://localhost:8000/api/employees net::FAILED_TO_CONNECT → Backend not running
```

---

## Backend Logs

Check Spring Boot startup logs for errors:

```bash
# Terminal running "java -jar" command
# Look for:
✓ "HibernateJpaAutoConfiguration was applied" → JPA configured
✓ "Tomcat initialized with port(s): 8000" → Server running
✓ "Started TodoApplication in X seconds" → App started
✗ "Connection refused" → Database not accessible
✗ "Could not create connection pool" → Bad credentials
```

---

## Environment Files

**Verify `.env.local` exists:**
```bash
# From client directory:
ls -la .env.local

# Should show:
# VITE_API_BASE_URL=http://localhost:8000/api
```

**For production deployment**, create `.env.production`:
```bash
VITE_API_BASE_URL=https://your-api-domain.com/api
```

---

## Port Conflicts

**Check if ports are in use:**

```bash
# Windows - Check port 8000 (backend)
netstat -ano | findstr :8000

# Windows - Check port 5173 (frontend)
netstat -ano | findstr :5173

# If ports in use, kill process or change port in:
# Backend: todo/src/main/resources/application.properties
# Frontend: client/vite.config.js
```

---

## Reset & Restart Guide

If all else fails, do a clean restart:

```bash
# 1. Stop all running services (Ctrl+C in terminals)

# 2. Clean rebuild backend
cd todo
mvn clean install -DskipTests

# 3. Install frontend dependencies fresh
cd ../client
rm -rf node_modules
npm install

# 4. Start backend
cd todo
java -jar target/todo-0.0.1-SNAPSHOT.jar

# 5. In new terminal, start frontend
cd client
npm run dev

# 6. Open http://localhost:5173 in browser
# 7. Press F12 to check console for errors
```

---

## When to Check Each Component

| Error Type | First Check | Second Check |
|-----------|------------|--------------|
| "Failed to load" | Backend running? | Database connection? |
| Blank calendar | react-calendar installed? | API returning data? |
| No leaves show | Employee selected? | Leave dates valid? |
| Submit fails | console.log errors? | API endpoint working? |
| Port errors | Is app already running? | Change port in config? |

---

## Get Detailed Logs

### Backend Debug Mode
```bash
# In application.properties, add:
logging.level.root=DEBUG
# Restart backend to see detailed logs
```

### Frontend Debug Mode
```bash
# In LeaveCalendar.jsx, add before return:
useEffect(() => {
  console.log("API_BASE:", API_BASE);
  console.log("Employees:", employees);
  console.log("Leaves:", leaves);
}, [employees, leaves]);
```

Then check browser console.

---

## Support Checklist

When reporting issues, provide:
- [ ] Backend version (Java version, Spring Boot version)
- [ ] Frontend error from console (F12)
- [ ] Result of `curl http://localhost:8000/api/employees`
- [ ] Result of `curl http://localhost:8000/api/leaves`
- [ ] Contents of `.env.local`
- [ ] Browser type and version
- [ ] Operating system

This will help diagnose issues faster!
