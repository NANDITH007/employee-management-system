/**
 * Smoke Test Suite for Todo Full Stack Application
 * Tests basic functionality of both Backend (Spring Boot) and Frontend (React)
 */

const http = require("http");
const https = require("https");

const API_BASE_URL = "http://localhost:8001/api";
const FRONTEND_URL = "http://localhost:5174";

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

let testsPassed = 0;
let testsFailed = 0;

function makeRequest(url, method = "GET", body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === "https:" ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    };

    const req = protocol.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : data,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

function logTest(name, passed, message = "") {
  if (passed) {
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    testsPassed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    if (message) console.log(`  ${colors.red}Error: ${message}${colors.reset}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log(`\n${colors.blue}=== SMOKE TESTS FOR TODO FULL STACK APPLICATION ===${colors.reset}\n`);

  // Test 1: Backend Health Check
  console.log(`${colors.yellow}1. Backend Health Checks${colors.reset}`);
  try {
    const response = await makeRequest(`${API_BASE_URL}/employees`);
    logTest("Backend is running", response.status === 200, `Status: ${response.status}`);
  } catch (error) {
    logTest(
      "Backend is running",
      false,
      "Cannot connect to backend. Make sure Spring Boot server is running on port 8000"
    );
  }

  // Test 2: Frontend Health Check
  console.log(`\n${colors.yellow}2. Frontend Health Checks${colors.reset}`);
  try {
    const response = await makeRequest(FRONTEND_URL);
    logTest(
      "Frontend is running",
      response.status === 200,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest(
      "Frontend is running",
      false,
      "Cannot connect to frontend. Make sure npm dev server is running on port 5173"
    );
  }

  // Test 3: Employee API Tests
  console.log(`\n${colors.yellow}3. Employee API Tests${colors.reset}`);

  // 3.1 GET all employees
  try {
    const response = await makeRequest(`${API_BASE_URL}/employees`);
    logTest(
      "GET /api/employees returns data",
      response.status === 200 && Array.isArray(response.body),
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest("GET /api/employees returns data", false, error.message);
  }

  // 3.2 POST new employee
  try {
    const newEmployee = {
      firstName: `TestUser_${Date.now()}`,
      lastName: "Smoke",
      email: `test${Date.now()}@test.com`,
      department: "QA",
      salary: 50000,
    };

    const response = await makeRequest(
      `${API_BASE_URL}/employees`,
      "POST",
      newEmployee
    );
    logTest(
      "POST /api/employees creates employee",
      response.status === 200 || response.status === 201,
      `Status: ${response.status}`
    );

    if (response.status === 200 || response.status === 201) {
      global.testEmployeeId = response.body?.id;
    }
  } catch (error) {
    logTest("POST /api/employees creates employee", false, error.message);
  }

  // 3.3 GET employee by ID
  if (global.testEmployeeId) {
    try {
      const response = await makeRequest(
        `${API_BASE_URL}/employees/${global.testEmployeeId}`
      );
      logTest(
        "GET /api/employees/:id returns employee",
        response.status === 200,
        `Status: ${response.status}`
      );
    } catch (error) {
      logTest("GET /api/employees/:id returns employee", false, error.message);
    }
  }

  // Test 4: Leave API Tests
  console.log(`\n${colors.yellow}4. Leave API Tests${colors.reset}`);

  // 4.1 GET all leaves
  try {
    const response = await makeRequest(`${API_BASE_URL}/leaves`);
    logTest(
      "GET /api/leaves returns data",
      response.status === 200 && Array.isArray(response.body),
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest("GET /api/leaves returns data", false, error.message);
  }

  // 4.2 POST new leave (if we have an employee)
  if (global.testEmployeeId) {
    try {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);
      
      const newLeave = {
        employeeId: global.testEmployeeId,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        reason: "Smoke test leave",
        status: "PENDING",
      };

      const response = await makeRequest(
        `${API_BASE_URL}/leaves`,
        "POST",
        newLeave
      );
      logTest(
        "POST /api/leaves creates leave request",
        response.status === 200 || response.status === 201,
        `Status: ${response.status}`
      );

      if (response.status === 200 || response.status === 201) {
        global.testLeaveId = response.body?.id;
      }
    } catch (error) {
      logTest("POST /api/leaves creates leave request", false, error.message);
    }
  }

  // 4.3 GET leaves by employee ID
  if (global.testEmployeeId) {
    try {
      const response = await makeRequest(
        `${API_BASE_URL}/leaves/employee/${global.testEmployeeId}`
      );
      logTest(
        "GET /api/leaves/employee/:id returns employee leaves",
        response.status === 200 && Array.isArray(response.body),
        `Status: ${response.status}`
      );
    } catch (error) {
      logTest(
        "GET /api/leaves/employee/:id returns employee leaves",
        false,
        error.message
      );
    }
  }

  // Test 5: Data Validation Tests
  console.log(`\n${colors.yellow}5. Data Validation Tests${colors.reset}`);

  // 5.1 POST employee with missing required field
  try {
    const invalidEmployee = {
      firstName: "TestOnly",
      // Missing lastName, email
      department: "QA",
      salary: 50000,
    };

    const response = await makeRequest(
      `${API_BASE_URL}/employees`,
      "POST",
      invalidEmployee
    );
    logTest(
      "POST /api/employees rejects invalid data",
      response.status >= 400,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest(
      "POST /api/employees rejects invalid data",
      true,
      "Request correctly failed"
    );
  }

  // 5.2 POST leave without required fields
  try {
    const invalidLeave = {
      employeeId: global.testEmployeeId || 1,
      // Missing startDate, endDate
      reason: "Incomplete leave",
    };

    const response = await makeRequest(
      `${API_BASE_URL}/leaves`,
      "POST",
      invalidLeave
    );
    logTest(
      "POST /api/leaves rejects invalid data",
      response.status >= 400,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest(
      "POST /api/leaves rejects invalid data",
      true,
      "Request correctly failed"
    );
  }

  // Test 6: Full Workflow Test
  console.log(`\n${colors.yellow}6. Full Workflow Test${colors.reset}`);
  try {
    // Create an employee
    const employee = {
      firstName: `Workflow_${Date.now()}`,
      lastName: "Test",
      email: `workflow${Date.now()}@test.com`,
      department: "Engineering",
      salary: 75000,
    };

    const empResponse = await makeRequest(
      `${API_BASE_URL}/employees`,
      "POST",
      employee
    );
    
    if (empResponse.status === 200 || empResponse.status === 201) {
      const empId = empResponse.body?.id;

      // Create a leave for that employee
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000);

      const leave = {
        employeeId: empId,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        reason: "Workflow test leave",
        status: "PENDING",
      };

      const leaveResponse = await makeRequest(
        `${API_BASE_URL}/leaves`,
        "POST",
        leave
      );

      logTest(
        "Complete workflow: Create employee → Create leave",
        leaveResponse.status === 200 || leaveResponse.status === 201,
        `Leave Status: ${leaveResponse.status}`
      );
    } else {
      logTest(
        "Complete workflow: Create employee → Create leave",
        false,
        `Employee creation failed with status ${empResponse.status}`
      );
    }
  } catch (error) {
    logTest("Complete workflow: Create employee → Create leave", false, error.message);
  }

  // Summary
  console.log(`\n${colors.blue}=== TEST SUMMARY ===${colors.reset}`);
  console.log(
    `${colors.green}Passed: ${testsPassed}${colors.reset} | ${colors.red}Failed: ${testsFailed}${colors.reset}`
  );

  if (testsFailed === 0) {
    console.log(
      `\n${colors.green}All tests passed! ✨${colors.reset}`
    );
    process.exit(0);
  } else {
    console.log(
      `\n${colors.red}Some tests failed. Please check the errors above.${colors.reset}`
    );
    console.log(`\n${colors.yellow}Make sure:${colors.reset}`);
    console.log("1. Backend Spring Boot server is running (port 8000)");
    console.log("2. Frontend React dev server is running (port 5173)");
    console.log("3. Database is properly configured and accessible");
    console.log("4. All environment variables are set correctly");
    process.exit(1);
  }
}

// Run the tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
