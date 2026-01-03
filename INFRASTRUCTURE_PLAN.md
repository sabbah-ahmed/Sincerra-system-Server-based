# Infrastructure Deployment Plan

## Overview
This document outlines the recommended approach for deploying the Sincerra Real Estate CRM system to AWS using a server-based architecture with EC2 and DynamoDB.

## Architecture Summary
```
Public Subnet:
  └─ Application Load Balancer (ALB)

Private Subnet 1 (Frontend Tier):
  └─ EC2 instances (Auto Scaling Group)
      └─ React app served via nginx

Private Subnet 2 (Backend Tier):
  └─ EC2 instances (Auto Scaling Group)
      └─ Node.js Express API

AWS DynamoDB (Managed Service):
  ├─ clients table
  └─ interactions table
```

## Recommended Deployment Sequence

### Phase 1 - Core Infrastructure (Foundation)
1. **VPC** - Virtual Private Cloud
2. **Subnets**
   - 2 Public subnets (for ALB, NAT Gateway)
   - 2 Private subnets (Frontend tier)
   - 2 Private subnets (Backend tier)
3. **Internet Gateway** - For public internet access
4. **NAT Gateway** - For private subnet outbound internet access
5. **Route Tables**
   - Public route table
   - Private route tables

### Phase 2 - Database & IAM (Early Setup - RECOMMENDED)
6. **DynamoDB Tables**
   - `clients` table (partition key: `id`)
   - `interactions` table (partition key: `id`)
7. **IAM Role for EC2**
   - Policy to access DynamoDB (read/write permissions)
   - This role will be attached to backend EC2 instances

**Why do this early?**
- ✅ DynamoDB is independent of VPC (serverless, managed by AWS)
- ✅ Test backend locally with real DynamoDB while building infrastructure
- ✅ EC2 instances need IAM role defined before launch
- ✅ Faster feedback loop - verify database works before EC2 deployment

### Phase 3 - Security Groups
8. **Security Group - ALB**
   - Inbound: HTTP (80), HTTPS (443) from 0.0.0.0/0
   - Outbound: To Frontend EC2 security group

9. **Security Group - Frontend EC2**
   - Inbound: From ALB security group only
   - Outbound: To Backend EC2 security group, internet (for npm packages)

10. **Security Group - Backend EC2**
    - Inbound: From Frontend EC2 security group only
    - Outbound: Internet (for DynamoDB access, npm packages)

### Phase 4 - Load Balancing
11. **Application Load Balancer (ALB)**
    - Deployed in public subnets
    - Listener on port 80 (HTTP) and/or 443 (HTTPS)

12. **Target Groups**
    - Frontend target group (port 80/3000)
    - Backend target group (port 3001)

13. **Listener Rules**
    - Default → Frontend target group
    - `/api/*` → Backend target group

### Phase 5 - Compute Resources
14. **Launch Templates**
    - Frontend launch template
      - AMI: Amazon Linux 2 or Ubuntu
      - User data script: Install nginx, Node.js, deploy React app
      - Security group: Frontend SG
      - No IAM role needed for frontend

    - Backend launch template
      - AMI: Amazon Linux 2 or Ubuntu
      - User data script: Install Node.js, deploy Express API
      - Security group: Backend SG
      - **IAM Instance Profile: DynamoDB access role**
      - Environment variables for DynamoDB

15. **Auto Scaling Groups**
    - Frontend ASG (min: 2, desired: 2, max: 4)
      - Deployed in private frontend subnets
      - Attached to frontend target group
    
    - Backend ASG (min: 2, desired: 2, max: 4)
      - Deployed in private backend subnets
      - Attached to backend target group

16. **Auto Scaling Policies** (Optional but recommended)
    - Scale up: CPU > 70%
    - Scale down: CPU < 30%

## Alternative Approach (Your Original Plan)

If you prefer to build infrastructure first, then database:

1. VPC + Subnets
2. Internet Gateway + NAT Gateway
3. Route Tables
4. Security Groups
5. ALB + Target Groups
6. Launch Templates (without IAM role initially)
7. Auto Scaling Groups
8. EC2 instances
9. **Then** DynamoDB tables
10. **Then** Update IAM role and redeploy backend EC2

**Trade-offs:**
- ❌ Can't fully test backend on EC2 until DynamoDB is ready
- ❌ Need to update and redeploy backend instances after adding DynamoDB
- ✅ More linear infrastructure build (network → compute → data)

## Infrastructure as Code (Terraform Recommended)

### Directory Structure
```
terraform/
  ├── main.tf
  ├── variables.tf
  ├── outputs.tf
  ├── modules/
  │   ├── vpc/
  │   ├── security-groups/
  │   ├── dynamodb/
  │   ├── iam/
  │   ├── alb/
  │   ├── asg-frontend/
  │   └── asg-backend/
```

## Key Configuration Details

### DynamoDB Table Schemas

**clients table:**
- Partition Key: `id` (String)
- Attributes:
  - name, email, phone, status
  - created_at, updated_at, last_contact, next_contact
  - assigned_to

**interactions table:**
- Partition Key: `id` (String)
- Global Secondary Index: `client_id-created_at-index`
- Attributes:
  - client_id, type, description, created_by
  - created_at, metadata

### Environment Variables for Backend EC2

```bash
NODE_ENV=production
PORT=3001
AWS_REGION=us-east-1
DYNAMODB_CLIENTS_TABLE=sincerra-clients
DYNAMODB_INTERACTIONS_TABLE=sincerra-interactions
FRONTEND_URL=http://<ALB-DNS-NAME>
```

### IAM Policy for Backend EC2

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:REGION:ACCOUNT:table/sincerra-clients",
        "arn:aws:dynamodb:REGION:ACCOUNT:table/sincerra-interactions",
        "arn:aws:dynamodb:REGION:ACCOUNT:table/sincerra-interactions/index/*"
      ]
    }
  ]
}
```

## Testing Strategy

1. **Local Testing** (Before AWS deployment)
   - Test backend with DynamoDB Local or AWS DynamoDB
   - Test frontend with local backend

2. **Infrastructure Validation**
   - Verify VPC, subnets, route tables
   - Test ALB health checks
   - Verify security group rules

3. **Application Deployment**
   - Deploy backend to ASG
   - Verify DynamoDB connectivity from EC2
   - Deploy frontend to ASG
   - Test end-to-end flow through ALB

## Cost Optimization Notes

- Use `t3.micro` or `t3.small` for EC2 instances (Free Tier eligible)
- DynamoDB: Use on-demand pricing or provisioned with auto-scaling
- Single NAT Gateway (instead of one per AZ) for cost savings in dev
- Consider Reserved Instances for production (1-year commitment)

## Next Steps

1. ✅ Choose deployment sequence (recommended vs alternative)
2. ✅ Set up Terraform modules
3. ✅ Configure DynamoDB tables
4. ✅ Update backend code to use DynamoDB (replace simpleDatabase.js)
5. ✅ Create user data scripts for EC2 deployment
6. ✅ Deploy infrastructure
7. ✅ Test and validate
