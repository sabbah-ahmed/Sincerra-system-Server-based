# Create an Internal Application Load Balancer (ALB) for Backend API
resource "aws_lb" "backend_alb" {
  name               = "backend-alb"           # Name of the ALB
  internal           = true                        # Set to true for internal ALB (private subnets)
  load_balancer_type = "application"                # Type of load balancer (Application Load Balancer)
  subnets            = var.private_subnet_ids        # Use the private subnet IDs
  security_groups    = [var.alb_sg_id] # Use the security group ID from variables

  tags = {
    Name = "${var.vpc_name}-Backend Internal Load Balancer" # Tag for identifying the ALB
    environment = var.environment
    terraform = "true"
  }
}

###########alb listener ##############
resource "aws_lb_listener" "backend_alb_listener" {  
  load_balancer_arn = aws_lb.backend_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_alb_target_group.arn
  }
}

#######################alb target group ##########################
resource "aws_lb_target_group" "backend_alb_target_group" {  
  name     = "backend-alb-tg"
  port     = 3001
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







