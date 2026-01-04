output "alb_id" {
    description = "The ID of the Application Load Balancer"
    value       = aws_lb.presentation_alb.id
}
