####################################### ALB Security Group (presentation_alb_sg) #######################################
resource "aws_security_group" "alb_sg" {
  name   = "${var.vpc_name}-alb-sg"
  vpc_id = var.vpc_id

  # HTTP Ingress (Port 80) – Allow incoming HTTP traffic to the ALB
  ingress {
  description = "HTTP from Internet"
  from_port   = 80
  to_port     = 80
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

  egress {
  description     = "To Frontend"
  from_port       = 80
  to_port         = 80
  protocol        = "tcp"
  security_groups = [aws_security_group.frontend_sg.id]
}
  tags = {
    Name = "${var.vpc_name}-alb-sg"
    environment = var.environment
    terraform = "true"

  }
}


####################################### Frontend Security Group (frontend_sg) #######################################
resource "aws_security_group" "frontend_sg" { 
  name   = "${var.vpc_name}-frontend-sg"
  vpc_id = var.vpc_id

  # HTTP Ingress (Port 80) – Allow incoming HTTP traffic from the ALB
  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  # # Application Egress (Port 8080) – Allow outgoing traffic to the backend application servers
  # egress {
  #   description     = "To Backend"
  #   from_port       = 8080
  #   to_port         = 8080
  #   protocol        = "tcp"
  #   security_groups = [aws_security_group.backend_sg.id]
  # }

  tags = {
    Name = "${var.vpc_name}-frontend-sg"
    environment = var.environment
    terraform = "true"

  }
}
