# Create an Application Load Balancer (ALB) for the Web App
resource "aws_lb" "presentation_alb" {
  name               = "presentation-alb"           # Name of the ALB
  internal           = false                        # Set to false for internet-facing ALB
  load_balancer_type = "application"                # Type of load balancer (Application Load Balancer)
  subnets            = var.public_subnet_ids        # Use the public subnet IDs from variables
  security_groups    = [var.presentation_alb_sg_id] # Use the security group ID from variables

  tags = {
    Name = "Internet-Facing App Load Balancer" # Tag for identifying the ALB
  }
}

###########comment to trigger workflow###############
