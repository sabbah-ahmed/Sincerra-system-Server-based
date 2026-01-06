####################################### ALB Security Group (presentation_alb_sg) #######################################
resource "aws_security_group" "alb_sg" {
  name   = "${var.vpc_name}-alb-sg"
  vpc_id = var.vpc_id

  tags = {
    Name = "${var.vpc_name}-alb-sg"
    environment = var.environment
    terraform = "true"
  }
}

# ALB Security Group Ingress Rule
resource "aws_security_group_rule" "alb_ingress_http" {
  type              = "ingress"
  description       = "HTTP from Internet"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_sg.id
}

# ALB Security Group Egress Rule
resource "aws_security_group_rule" "alb_egress_to_frontend" {
  type                     = "egress"
  description              = "To Frontend"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.frontend_sg.id
  security_group_id        = aws_security_group.alb_sg.id
}


####################################### Frontend Security Group (frontend_sg) #######################################
resource "aws_security_group" "frontend_sg" { 
  name   = "${var.vpc_name}-frontend-sg"
  vpc_id = var.vpc_id

  tags = {
    Name = "${var.vpc_name}-frontend-sg"
    environment = var.environment
    terraform = "true"
  }
}

# Frontend Security Group Ingress Rule
resource "aws_security_group_rule" "frontend_ingress_from_alb" {
  type                     = "ingress"
  description              = "HTTP from ALB"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb_sg.id
  security_group_id        = aws_security_group.frontend_sg.id
}

# Frontend needs egress to access internet for updates, etc
resource "aws_security_group_rule" "frontend_egress_all" {
  type              = "egress"
  description       = "Allow all outbound traffic"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.frontend_sg.id
}
