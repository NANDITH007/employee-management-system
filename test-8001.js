// Test Leave API on port 8001
const http = require('http');

function testAPI(port, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`GET http://localhost:${port}${path}`);
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            console.log(`Count: ${Array.isArray(parsed) ? parsed.length : 'N/A'}`);
          } catch (e) {
            console.log(`Response (truncated): ${data.substring(0, 100)}`);
          }
        }
        console.log('---');
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`Error for ${path}: ${e.message}`);
      resolve();
    });

    req.end();
  });
}

async function run() {
  console.log('Testing Leave APIs on port 8001:\n');
  await testAPI(8001, '/api/employees');
  await testAPI(8001, '/api/leaves');
  await testAPI(8001, '/api/leaves/employee/1');
}

run();
