# Real Estate CRM Backend API

## Overview
Backend API for the Real Estate Client Management System built with Node.js, Express.js, and AWS Lambda.

## Project Structure
```
backend/
├── src/
│   ├── functions/          # Lambda functions
│   ├── models/            # Data models
│   ├── utils/             # Helper utilities
│   └── middleware/        # Express middleware
├── tests/                 # Unit tests
├── docs/                  # API documentation
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18.x
- AWS CLI configured
- Serverless Framework

### Installation
```bash
npm install
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your AWS credentials and configuration

### Local Development
```bash
npm run dev
```

### Deployment
```bash
# Deploy to development
npm run deploy:dev

# Deploy to production  
npm run deploy:prod
```

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

## Testing
```bash
npm test
```
