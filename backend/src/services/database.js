const simpleDatabase = require('./simpleDatabase');

// Test database connection
const testConnection = async () => {
  return await simpleDatabase.testConnection();
};

module.exports = {
  testConnection
};
