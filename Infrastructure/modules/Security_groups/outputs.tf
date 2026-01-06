output "alb_sg_id" {
  description = "Security Group ID for the Application Load Balancer"
  value       = aws_security_group.alb_sg.id
  
}

output "frontend_sg_id" {
  description = "Security Group ID for the Frontend"
  value       = aws_security_group.frontend_sg.id
}

output "backend_alb_sg_id" {
  description = "Security Group ID for the Backend Application Load Balancer"
  value       = aws_security_group.backend_alb_sg.id
}

output "backend_sg_id" {
  description = "Security Group ID for the Backend instances"
  value       = aws_security_group.backend_sg.id
}
