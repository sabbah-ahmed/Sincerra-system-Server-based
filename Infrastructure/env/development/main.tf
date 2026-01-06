# ====================================================================
# Network Module - Creates VPC, Subnets, IGW, NAT Gateway, Route Tables
# ====================================================================

module "network" {
  source = "../../modules/network"

  environment     = var.environment
  vpc_name        = var.vpc_name
  vpc_cidr        = var.vpc_cidr
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
}

# ====================================================================
# Security Groups Module - Creates ALB and Frontend Security Groups
# ====================================================================

module "security_groups" {
  source = "../../modules/Security_groups"

  environment = var.environment
  vpc_id      = module.network.vpc_id
  vpc_name    = var.vpc_name
}

# ====================================================================
# Application Load Balancer Module - Creates ALB in Public Subnets
# ====================================================================

module "alb" {
  source = "../../modules/public_ALB"

  environment       = var.environment
  vpc_id            = module.network.vpc_id
  vpc_name          = var.vpc_name
  public_subnet_ids = module.network.public_subnet_ids
  alb_sg_id         = module.security_groups.alb_sg_id
}

# ====================================================================
# Frontend Auto Scaling Group - Creates ASG in Private Subnets
# ====================================================================

module "frontend_asg" {
  source = "../../modules/frontend_asg"

  environment        = var.environment
  vpc_id             = module.network.vpc_id
  vpc_name           = var.vpc_name
  vpc_cidr           = var.vpc_cidr
  private_subnet_ids = module.network.private_subnet_ids
  frontend_sg_id     = module.security_groups.frontend_sg_id
  target_group_arn   = module.alb.target_group_arn
  image_id           = var.image_id
  instance_type      = var.instance_type
  key_name           = var.key_name
}

# ====================================================================
# Backend Application Load Balancer - Creates Internal ALB in Private Subnets
# ====================================================================

module "backend_alb" {
  source = "../../modules/backend_ALB"

  environment        = var.environment
  vpc_id             = module.network.vpc_id
  vpc_name           = var.vpc_name
  private_subnet_ids = module.network.private_subnet_ids
  alb_sg_id          = module.security_groups.backend_alb_sg_id
}

# ====================================================================
# Backend Auto Scaling Group - Creates ASG in Private Subnets
# ====================================================================

module "backend_asg" {
  source = "../../modules/backend_asg"

  environment        = var.environment
  vpc_id             = module.network.vpc_id
  vpc_name           = var.vpc_name
  vpc_cidr           = var.vpc_cidr
  private_subnet_ids = module.network.private_subnet_ids
  backend_sg_id      = module.security_groups.backend_sg_id
  target_group_arn   = module.backend_alb.target_group_arn
  image_id           = var.image_id
  instance_type      = var.instance_type
  key_name           = var.key_name
}
