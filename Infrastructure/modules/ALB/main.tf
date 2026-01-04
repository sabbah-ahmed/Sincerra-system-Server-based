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
    target_group_arn = aws_lb_target_group.presentation_alb_target_group.arn
  }
}

#######################alb target group ##########################
resource "aws_lb_target_group" "presentation_alb_target_group" {  
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





############### still under work #######################






# ####################################### Launch Template #######################################
# # Launch Template using the dynamically fetched image_id
# resource "aws_launch_template" "presentation_launch_template" {
#   name_prefix            = "presentation-launch-template" # Prefix for the launch template name
#   image_id               = var.image_id                   # Use the dynamically fetched Amazon Linux 2 AMI ID
#   vpc_security_group_ids = [var.presentation_sg_id]       # Security group for instances launched from this template
#   instance_type          = var.instance_type              # Instance type for the presentation app (can be changed as needed)
#   key_name               = var.key_name                   # Replace with your key pair name 
#   user_data              = filebase64(("${path.module}/frontend.sh"))
#   iam_instance_profile {
#     name = aws_iam_instance_profile.presentation_instance_profile.name
#   }
# }

# ####################################### Auto Scaling Group #######################################
# # Auto Scaling Group for the Web App, using the launch template
# resource "aws_autoscaling_group" "presentation_asg" {
#   name                = "presentation_asg"
#   desired_capacity    = 1 # Desired number of instances
#   max_size            = 2 # Maximum number of instances
#   min_size            = 1 # Minimum number of instances
#   health_check_type   = "EC2"
#   vpc_zone_identifier = var.public_subnet_ids                               # Use available AZs dynamically fetched 
#   target_group_arns   = [aws_lb_target_group.presentation_target_group.arn] # Add the target group ARN
#   depends_on = [aws_lb.presentation_alb]
#   launch_template {
#     id      = aws_launch_template.presentation_launch_template.id # Reference the launch template ID
#     version = "$Latest"                                           # Use the latest version of the launch template
#   }

#   # Tag all instances with the same name
#   tag {
#     key                 = "Name"                  # Tag key for the instance's name
#     value               = "presentation-instance" # Name of the instances 
#     propagate_at_launch = true                    # Ensure the tag is applied to instances when they are launched
#   }
#   tag {
#     key                 = "Title"
#     value               = "prometheus"
#     propagate_at_launch = true
#   }
# }

# ####################################### IAM Roles and Policies #######################################
# # IAM Role for EC2 instances
# resource "aws_iam_role" "presentation_role" {
#   name = "presentation-role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Action = "sts:AssumeRole",
#         Effect = "Allow",
#         Principal = {
#           Service = "ec2.amazonaws.com"
#         }
#       }
#     ]
#   })
# }

# # Attach IAM policy to the role
# resource "aws_iam_role_policy_attachment" "presentation_role_policy" {
#   role       = aws_iam_role.presentation_role.name
#   policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"
# }

# # IAM Instance Profile
# resource "aws_iam_instance_profile" "presentation_instance_profile" {
#   name = "presentation-instance-profile"
#   role = aws_iam_role.presentation_role.name
# }
