# ====================================================================
# Environment Configuration
# ====================================================================

variable "environment" {
  description = "The environment name (e.g., development, staging, production)"
  type        = string
  default     = "development"
}

# ====================================================================
# Network Module Variables
# ====================================================================

variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
  default     = "sincerra-vpc-serverbased-dev"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "Map of public subnet CIDR blocks"
  type        = map(string)
  default = {
    "us-east-1a" = "10.0.1.0/24"
    "us-east-1b" = "10.0.2.0/24"
  }
}

variable "private_subnets" {
  description = "Map of private subnet CIDR blocks"
  type        = map(string)
  default = {
    "us-east-1a" = "10.0.100.0/24"
    "us-east-1b" = "10.0.200.0/24"
  }
}

# ====================================================================
# EC2 Instance Configuration Variables
# ====================================================================

variable "image_id" {
  description = "The AMI ID to use for the EC2 instances"
  type        = string
  # You'll need to provide the actual AMI ID for your region
  # Example: "ami-0c55b159cbfafe1f0" (Amazon Linux 2)
}

variable "instance_type" {
  description = "EC2 instance type for frontend instances"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "The name of the key pair to use for EC2 instances"
  type        = string
  # You'll need to provide your key pair name
}

# ====================================================================
# Tags and Naming
# ====================================================================

variable "project_name" {
  description = "The name of the project (used for resource naming and tagging)"
  type        = string
  default     = "sincerra"
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "Sincerra"
    Environment = "development"
    ManagedBy   = "Terraform"
  }
}

# ====================================================================
# Optional: Additional Configuration
# ====================================================================

variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}
