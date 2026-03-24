// Quick test to check Leave API
const http = require('http');

function testAPI(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`GET ${path}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data.substring(0, 200)}`);
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
  await testAPI('/api/employees');
  await testAPI('/api/leaves');
  await testAPI('/api/leaves/employee/1');
}

run();
