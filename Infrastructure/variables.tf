# Basic Project Information
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "realestate-crm"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}
