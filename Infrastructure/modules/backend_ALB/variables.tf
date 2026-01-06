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
  description = "List of Private Subnet IDs"
  type        = list(string) # A list of strings to hold multiple subnet IDs
}

# Security group ID for the presentation application load balancer (ALB)
variable "alb_sg_id" {
  description = "Security group ID for the presentation application load balancer"
  type        = string # A string type to hold the ID of the security group associated with the ALB
}

