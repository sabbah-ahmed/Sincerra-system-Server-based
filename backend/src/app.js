const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { testConnection } = require('./services/database');

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow embedding for development
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
      query: req.query,
      body: Object.keys(req.body).length > 0 ? req.body : undefined
    });
    next();
  });
}

// Test database connection on startup
app.use(async (req, res, next) => {
  // Only test connection once per app lifecycle
  if (!app.locals.dbTested) {
    try {
      console.log('🔄 Testing database connection...');
      await testConnection();
      app.locals.dbTested = true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
    }
  }
  next();
});

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Real Estate CRM API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      clients: '/api/clients',
      docs: '/api/docs'
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler for non-API routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
