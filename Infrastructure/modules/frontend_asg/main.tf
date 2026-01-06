####################################### Launch Template #######################################
# Launch Template using the dynamically fetched image_id
resource "aws_launch_template" "presentation_launch_template" {
  name_prefix            = "frontend-launch-template" # Prefix for the launch template name
  image_id               = var.image_id                   # Use the dynamically fetched Amazon Linux 2 AMI ID
  vpc_security_group_ids = [var.frontend_sg_id]       # Security group for instances launched from this template
  instance_type          = var.instance_type              # Instance type for the frontend app (can be changed as needed)
  key_name               = var.key_name                   # Replace with your key pair name 
  user_data              = filebase64(("${path.module}/frontend.sh"))
  iam_instance_profile {
    name = aws_iam_instance_profile.frontend_instance_profile.name
  }
}

####################################### Auto Scaling Group #######################################
# Auto Scaling Group for the Web App, using the launch template
resource "aws_autoscaling_group" "frontend_asg" {
  name                = "frontend_asg"
  desired_capacity    = 1 # Desired number of instances
  max_size            = 2 # Maximum number of instances
  min_size            = 1 # Minimum number of instances
  health_check_type   = "EC2"
  vpc_zone_identifier = var.private_subnet_ids                               # Use available AZs dynamically fetched 
  target_group_arns   = [var.target_group_arn] # Add the target group ARN
  launch_template {
    id      = aws_launch_template.presentation_launch_template.id # Reference the launch template ID
    version = "$Latest"                                           # Use the latest version of the launch template
  }

  # Tag all instances with the same name
  tag {
    key                 = "Name"                  # Tag key for the instance's name
    value               = "frontend-instance" # Name of the instances 
    propagate_at_launch = true                    # Ensure the tag is applied to instances when they are launched
  }
}

####################################### IAM Roles and Policies #######################################
# IAM Role for EC2 instances
resource "aws_iam_role" "frontend_role" {
  name = "frontend-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Attach IAM policy to the role
resource "aws_iam_role_policy_attachment" "presentation_role_policy" {
  role       = aws_iam_role.frontend_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "frontend_instance_profile" {
  name = "frontend-instance-profile"
  role = aws_iam_role.frontend_role.name
}
