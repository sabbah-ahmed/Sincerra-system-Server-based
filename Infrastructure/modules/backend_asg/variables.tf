variable "environment" {
  description = "The environment for the ALB"
  type        = string
}
# The VPC ID to associate the resources with
variable "vpc_id" {
  description = "The VPC ID"
  type        = string # A string type to hold the ID of the VPC
}

variable "vpc_name" {
  description = "vpc name"
  type = string 
  
}

# List of Private Subnet IDs where the Application Load Balancer and other resources will reside
variable "private_subnet_ids" {
  description = "List of Public Subnet IDs"
  type        = list(string) # A list of strings to hold multiple subnet IDs
}



variable "backend_sg_id" {
  description = "The ID of the backend security group for instances"
  type        = string # A string type to hold the security group ID for the EC2 instances
}

variable "image_id" {
  description = "The AMI ID to use for the instances"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "key_name" {
  description = "The name of the key pair to use for EC2 instances"
  type        = string
}

variable "vpc_cidr" {
  description = "the cidr of the vpc"
  type        = string
}


variable "target_group_arn" {
  description = "The ARN of the target group for the ALB"
  type        = string
}
