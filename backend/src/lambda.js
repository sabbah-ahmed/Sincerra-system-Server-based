const serverless = require('serverless-http');
const app = require('./app');

// Export the serverless handler for AWS Lambda
module.exports.handler = serverless(app);
