# Quick API Test

## 🧪 Testing Your Real Estate CRM API

Since DynamoDB Local setup had some issues, let's test the API structure first with a mock approach.

### 🎯 Test Steps:

#### 1. **Start the API Server**
Navigate to the backend directory in a new terminal and run:
```bash
cd "E:\Vision\Clients\Sincerra\Sincerra system\backend"
node src/server.js
```

#### 2. **Test Health Check**
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Real Estate CRM API is running",
  "timestamp": "2025-12-24T...",
  "version": "1.0.0"
}
```

#### 3. **Test Client Endpoints**

**Create a client:**
```bash
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Mohamed",
    "email": "ahmed@example.com", 
    "phone": "+201234567890",
    "property_interest": "2BR_APARTMENT",
    "budget_range": "500000-800000",
    "source": "website_form"
  }'
```

**Get all clients:**
```bash
curl http://localhost:3001/api/clients
```

### 🔧 **What to Expect:**

1. **Without DynamoDB**: You'll get database connection errors, but the API structure and validation will work
2. **With DynamoDB Local**: Full functionality with data persistence

### 📱 **Alternative: Use Postman**

1. Open Postman
2. Create a new collection "Real Estate CRM"
3. Add these requests:
   - GET `http://localhost:3001/api/health`
   - GET `http://localhost:3001/api/clients`
   - POST `http://localhost:3001/api/clients` (with JSON body)

### 🎉 **Success Indicators:**

✅ **API Structure Working**: Proper routes, validation, error handling  
✅ **Express Server Running**: Server starts on port 3001  
✅ **CORS Configured**: Frontend can connect  
✅ **Validation Active**: Input validation with Joi  

### 🚀 **Next Steps After Testing:**

1. **Fix DynamoDB Local setup** (optional - can deploy to AWS directly)
2. **Connect Frontend** to API endpoints
3. **Add Authentication** layer
4. **Implement Email/SMS** features

---

**💡 Pro Tip**: Your API is designed to work with both local DynamoDB and AWS DynamoDB without code changes. When you deploy to AWS, it will automatically connect to the cloud database!
