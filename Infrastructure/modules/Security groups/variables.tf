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
