# Leave Calendar Feature - Implementation Guide

## Overview
A complete leave management system has been added to your todo-fullstack application. This feature allows employees to request leaves and managers to approve/reject them with a visual calendar interface.

## Backend Implementation

### New Database Models

#### Leave Entity (`Leave.java`)
- **Model Location**: `todo/src/main/java/com/example/todo/model/Leave.java`
- **Fields**:
  - `id` (Long) - Auto-generated primary key
  - `employeeId` (Long) - Reference to the employee requesting leave
  - `startDate` (LocalDate) - Leave start date
  - `endDate` (LocalDate) - Leave end date
  - `reason` (String) - Reason for leave request
  - `status` (String) - Leave status (PENDING, APPROVED, REJECTED)
  - `createdAt` (LocalDateTime) - Auto-set creation timestamp

### API Endpoints

#### LeaveController (`/api/leaves`)

**GET Endpoints:**
- `GET /api/leaves` - Get all leave requests
- `GET /api/leaves/{id}` - Get a specific leave request
- `GET /api/leaves/employee/{employeeId}` - Get leaves for a specific employee
- `GET /api/leaves/employee/{employeeId}/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get leaves within a date range
- `GET /api/leaves/status/{status}` - Get leaves by status (PENDING, APPROVED, REJECTED)

**POST Endpoint:**
- `POST /api/leaves` - Create a new leave request
  ```json
  {
    "employeeId": 1,
    "startDate": "2026-04-01",
    "endDate": "2026-04-05",
    "reason": "Vacation",
    "status": "PENDING"
  }
  ```

**PUT Endpoint:**
- `PUT /api/leaves/{id}` - Update a leave request (e.g., approve/reject)
  ```json
  {
    "status": "APPROVED"
  }
  ```

**DELETE Endpoint:**
- `DELETE /api/leaves/{id}` - Delete a leave request

## Frontend Implementation

### New Components

#### LeaveCalendar Component (`LeaveCalendar.jsx`)
- **Location**: `client/src/LeaveCalendar.jsx`
- **Features**:
  - Interactive calendar view with leave highlighting
  - Employee selection dropdown
  - Leave request form
  - Leave list with status badges
  - Approve/Reject/Delete functionality
  - Date range selection for leave requests

#### Styling
- **CSS File**: `client/src/LeaveCalendar.css`
- Responsive calendar styles
- Color-coded leave indicators

### Updated App Component
- **Location**: `client/src/App.jsx`
- **Changes**:
  - Added tab navigation for switching between "Employees" and "Leave Management"
  - Integrated LeaveCalendar component
  - Maintained existing employee management functionality

## Installation & Setup

### Backend Setup
1. The new Leave model and LeaveController are already created
2. Build the backend:
   ```bash
   cd todo
   mvn clean install -DskipTests
   ```
3. Ensure Spring Boot is running on `http://localhost:8000`

### Frontend Setup
1. Install calendar libraries:
   ```bash
   cd client
   npm install react-calendar date-fns
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Usage Guide

### For Employees
1. Navigate to the **"Leave Management"** tab
2. Select your name from the employee dropdown
3. Click **"+ Request New Leave"**
4. Enter leave dates and reason
5. Click **"Submit Request"**
6. Your leave will appear in the list with **PENDING** status

### For Managers
1. Go to **"Leave Management"** tab
2. Select an employee from the dropdown
3. View their leave requests in the list
4. Use **Approve** button to approve pending leaves
5. Use **Reject** button to reject leave requests
6. Leave status will update accordingly

### Calendar View
- Orange highlighted dates indicate days with approved or pending leaves
- Hover over dates to see leave details
- The calendar updates in real-time

## Project Structure

```
todo-fullstack/
├── client/
│   ├── src/
│   │   ├── App.jsx (Updated with navigation)
│   │   ├── LeaveCalendar.jsx (New component)
│   │   ├── LeaveCalendar.css (New styles)
│   │   ├── App.css
│   │   ├── main.jsx
│   └── package.json (Updated with calendar libraries)
├── todo/
│   └── src/main/
│       ├── java/com/example/todo/
│       │   ├── model/
│       │   │   ├── Employee.java
│       │   │   └── Leave.java (New)
│       │   ├── controller/
│       │   │   ├── EmployeeController.java
│       │   │   └── LeaveController.java (New)
│       │   ├── repository/
│       │   │   ├── EmployeeRepository.java
│       │   │   └── LeaveRepository.java (New)
│       └── resources/
│           └── application.properties
```

## Database

The Leave data is automatically persisted using JPA/Hibernate configured in your Spring Boot application. No manual database schema creation is needed.

## Key Features

✅ **Leave Calendar**: Interactive calendar showing all leave dates
✅ **Leave Requests**: Employees can request leaves with dates and reasons
✅ **Approval Workflow**: Managers can approve/reject leave requests
✅ **Status Tracking**: Track leave status (PENDING, APPROVED, REJECTED)
✅ **Employee Selection**: Filter leaves by employee
✅ **Date Range Queries**: Search leaves by specific date ranges
✅ **Responsive Design**: Works on desktop and mobile devices
✅ **Real-time Updates**: Calendar and lists update immediately after changes

## Future Enhancements

- Add authentication and authorization
- Implement leave balance tracking
- Add email notifications for leave requests
- Create leave reports and analytics
- Add recurring leave patterns
- Implement leave cancellation
- Add comments/notes to leave requests
- Create holiday management system

## API Examples

### Creating a Leave Request
```bash
curl -X POST http://localhost:8000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": 1,
    "startDate": "2026-04-01",
    "endDate": "2026-04-05",
    "reason": "Vacation",
    "status": "PENDING"
  }'
```

### Getting Employee's Leave Requests
```bash
curl http://localhost:8000/api/leaves/employee/1
```

### Approving a Leave Request
```bash
curl -X PUT http://localhost:8000/api/leaves/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED"}'
```

### Getting Leaves in Date Range
```bash
curl "http://localhost:8000/api/leaves/employee/1/range?startDate=2026-04-01&endDate=2026-04-30"
```

## Troubleshooting

**Issue**: Calendar not showing leave dates
- **Solution**: Check browser console for API errors, ensure backend is running on port 8000

**Issue**: Changes not persisting
- **Solution**: Verify database connection in `application.properties`

**Issue**: Missing calendar styling
- **Solution**: Ensure `react-calendar` CSS is imported in LeaveCalendar.jsx

**Issue**: Date format errors
- **Solution**: Use ISO format (YYYY-MM-DD) for all date inputs

## Support

For issues or questions, check:
1. Backend logs in terminal running Spring Boot
2. Browser devtools Network tab for API calls
3. Ensure all dependencies are installed with `npm install`
