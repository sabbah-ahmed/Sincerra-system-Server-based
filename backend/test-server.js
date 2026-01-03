const express = require('express');
const path = require('path');

const testApp = express();
const PORT = 3002;

// Serve static files
testApp.use(express.static(__dirname));

// Serve the test page
testApp.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'api-test.html'));
});

testApp.listen(PORT, () => {
  console.log(`🧪 Test server running at http://localhost:${PORT}`);
  console.log(`Open this URL to test your API!`);
});

module.exports = testApp;
