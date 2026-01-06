# ====================================================================
# Development Environment Configuration
# ====================================================================

environment = "development"

# ====================================================================
# Network Configuration
# ====================================================================

vpc_name = "sincerra-vpc-serverbased-dev"
vpc_cidr = "10.0.0.0/16"

public_subnets = {
  "us-east-1a" = "10.0.1.0/24"
  "us-east-1b" = "10.0.2.0/24"
}

private_subnets = {
  "us-east-1a" = "10.0.100.0/24"
  "us-east-1b" = "10.0.200.0/24"
}

# ====================================================================
# EC2 Instance Configuration
# ====================================================================

image_id      = "ami-0ecb62995f68bb549"
instance_type = "t3.micro"
key_name      = "sabbah"

# ====================================================================
# Project Configuration
# ====================================================================

project_name = "sincerra"
aws_region   = "us-east-1"

common_tags = {
  Project     = "Sincerra"
  Environment = "development"
  ManagedBy   = "Terraform"
}
