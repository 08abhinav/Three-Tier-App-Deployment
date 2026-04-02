module "network" {
    source = "../network"
}

resource "aws_db_subnet_group" "subnet_group"{
    name = "rds_subnet_group"
    subnet_ids = [
        module.network.private_subnet1_id,
        module.network.private_subnet2_id
    ]

    tags = {
        Name = "RDS_subnet_group"
    }
}

resource "aws_security_group" "rds_sg"{
    name    = "rds_sg"
    vpc_id  = module.network.vpc_id

    ingress{
        protocol                 = "tcp"
        from_port                = 3306
        to_port                  = 3306
        security_groups          = [module.network.security_group_id]
    }

    egress{
        from_port  = 0
        to_port    = 0
        protocol   = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "RDS_security_group"
    } 
}

resource "aws_db_instance" "rds"{
    allocated_storage       = var.db_storage
    db_name                 = var.db_name
    engine                  = var.db_engine
    engine_version          = var.db_engine_version
    instance_class          = var.instance_class
    username                = var.db_user
    password                = var.db_password
    vpc_security_group_ids  = [aws_security_group.rds_sg.id] 
    db_subnet_group_name    = aws_db_subnet_group.subnet_group.name
    skip_final_snapshot     = true
}