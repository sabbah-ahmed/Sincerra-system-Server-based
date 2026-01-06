# Create an Application Load Balancer (ALB) for the Web App
resource "aws_lb" "presentation_alb" {
  name               = "presentation-alb"           # Name of the ALB
  internal           = false                        # Set to false for internet-facing ALB
  load_balancer_type = "application"                # Type of load balancer (Application Load Balancer)
  subnets            = var.public_subnet_ids        # Use the public subnet IDs from variables
  security_groups    = [var.alb_sg_id] # Use the security group ID from variables

  tags = {
    Name = "${var.vpc_name}-Internet-Facing App Load Balancer" # Tag for identifying the ALB
    environment = var.environment
    terraform = "true"
  }
}

###########alb listener ##############
resource "aws_lb_listener" "presentation_alb_listener" {  
  load_balancer_arn = aws_lb.presentation_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_alb_target_group.arn
  }
}

#######################alb target group ##########################
resource "aws_lb_target_group" "frontend_alb_target_group" {  
  name     = "presentation-alb-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    interval            = 30
    path                = "/"
    protocol            = "HTTP"
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "${var.vpc_name}-presentation-alb-tg"
    environment = var.environment
    terraform = "true"
  }
}







