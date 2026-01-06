output "presentation_alb_dns_name" {
  description = "DNS name of the Application Load Balancer - Use this URL to access your frontend"
  value       = module.alb.presentation_alb_dns
}


output "backend_alb_dns_name" {
  description = "DNS name of the Application Load Balancer - Use this URL to access your frontend"
  value       = module.backend_alb.backend_alb_dns
}

