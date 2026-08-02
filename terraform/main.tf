# Terraform configuration for Civitas infrastructure

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "civitas" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "civitas-vpc"
  }
}

# Subnets
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.civitas.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "civitas-public-${count.index}"
  }
}

# EKS Cluster
resource "aws_eks_cluster" "civitas" {
  name     = "civitas-eks"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = aws_subnet.public[*].id
  }
}

# EKS Node Group
resource "aws_eks_node_group" "civitas" {
  cluster_name    = aws_eks_cluster.civitas.name
  node_group_name = "civitas-nodes"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.public[*].id

  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 1
  }

  instance_types = ["t3.medium"]
}

# RDS PostgreSQL
resource "aws_db_instance" "civitas" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.t3.micro"
  db_name              = "civitas"
  username             = "admin"
  password             = var.db_password
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = true

  vpc_security_group_ids = [aws_security_group.database.id]
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "civitas" {
  cluster_id           = "civitas-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}
