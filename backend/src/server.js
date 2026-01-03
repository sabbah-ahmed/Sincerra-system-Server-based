const app = require('./app');

// Set port
const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 Real Estate CRM API Server Started');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗃️  Database: ${process.env.IS_OFFLINE ? 'DynamoDB Local' : 'AWS DynamoDB'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Available endpoints:');
  console.log('   GET    /api/health');
  console.log('   GET    /api/clients');
  console.log('   POST   /api/clients');
  console.log('   GET    /api/clients/:id');
  console.log('   PUT    /api/clients/:id');
  console.log('   DELETE /api/clients/:id');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = server;
