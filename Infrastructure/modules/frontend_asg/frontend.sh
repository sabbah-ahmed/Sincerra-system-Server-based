#!/bin/bash

# Update the system
echo "Updating system..."
yum update -y

# Install required tools
echo "Installing curl, git, unzip..."
yum install -y curl git unzip

# Install AWS CLI (for future use to fetch ALB DNS)
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

# Install Nginx
echo "Installing Nginx..."
amazon-linux-extras install nginx1 -y

# Clone the full repository
echo "Cloning Sincerra repository..."
git clone https://github.com/sabbah-ahmed/Sincerra-system-serverless-.git /tmp/sincerra

# Navigate to frontend folder
cd /tmp/sincerra/frontend

# Install dependencies
echo "Installing dependencies..."
npm install

# Build React app
echo "Building React app..."
npm run build

# Deploy to Nginx
echo "Deploying to Nginx..."
cp -r build/* /usr/share/nginx/html/

# Set permissions
chown -R nginx:nginx /usr/share/nginx/html

# Configure Nginx for React Router
tee /etc/nginx/conf.d/react.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Start Nginx
systemctl start nginx
systemctl enable nginx

echo "✅ Frontend deployed successfully!"
