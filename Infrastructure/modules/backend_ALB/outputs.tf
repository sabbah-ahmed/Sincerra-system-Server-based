output "backend_alb_id" {
    description = "The ID of the Backend Application Load Balancer"
    value       = aws_lb.backend_alb.id
}

output "backend_alb_dns" {
    description = "The DNS name of the Backend Application Load Balancer"
    value       = aws_lb.backend_alb.dns_name
}

output "target_group_arn" {
    description = "The ARN of the target group for the Backend ALB"
    value       = aws_lb_target_group.backend_alb_target_group.arn
}
