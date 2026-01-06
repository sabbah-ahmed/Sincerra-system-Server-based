#!/bin/bash

# Update system
echo "Updating system..."
yum update -y

# Install required tools
echo "Installing curl, git, unzip..."
yum install -y curl git unzip

# Install AWS CLI (for fetching ALB DNS)
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    ./aws/install
    rm -rf aws awscliv2.zip
fi

# Install Node.js 18
echo "Installing Node.js 18..."
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Clone repository
echo "Cloning backend repository..."
git clone https://github.com/sabbah-ahmed/Sincerra-system-Server-based.git /opt/sincerra
cd /opt/sincerra/backend

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Get frontend ALB DNS for CORS
FRONTEND_ALB_DNS=$(aws elbv2 describe-load-balancers \
    --names "presentation-alb" \
    --region us-east-1 \
    --query "LoadBalancers[0].DNSName" \
    --output text)

# Create environment file
cat > /opt/sincerra/backend/.env <<EOF
PORT=3001
NODE_ENV=production
AWS_REGION=us-east-1
FRONTEND_URL=http://${FRONTEND_ALB_DNS}
EOF

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Start application with PM2
echo "Starting backend with PM2..."
cd /opt/sincerra/backend
pm2 start src/server.js --name sincerra-backend --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root

echo "✅ Backend deployed successfully!"
echo "Backend running on port 3001"
