output "presentation_alb_id" {
    description = "The ID of the Application Load Balancer"
    value       = aws_lb.presentation_alb.id
}

output "presentation_alb_dns" {
    description = "The DNS name of the Application Load Balancer"
    value       = aws_lb.presentation_alb.dns_name
}

output "target_group_arn" {
    description = "The ARN of the target group for the ALB"
    value       = aws_lb_target_group.frontend_alb_target_group.arn
}
