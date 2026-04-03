resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.cluster_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

output "ecs_cluster"{
  value = aws_ecs_cluster.ecs_cluster.id
}

