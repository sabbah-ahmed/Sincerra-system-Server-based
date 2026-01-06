
variable "environment" {
    description = "The environment for the VPC"
    default = "production"
}


variable "vpc_name" {
    description = "The name of the VPC"
    default = "sincerra-vpc-serverbased"
  
}


variable "vpc_cidr" {
    description = "The CIDR block for the VPC"
    default = "10.0.0.0/16"
}

variable "public_subnets"{
    description = "List of public subnet CIDR blocks"
    type = map(string)
    default = {
        "us-east-1a" = "10.0.1.0/24"
        "us-east-1b" = "10.0.2.0/24"
    }
}

variable "private_subnets"{
    description = "list of private subnets"
    type = map(string)
    default = {
      "us-east-1a" = "10.0.100.0/24"
      "us-east-1b" = "10.0.200.0/24"
    }
}

