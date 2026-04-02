locals{
    subnet = {
        public1 = {
            cidr    = var.public_subnet1_cidr
            az      = var.az1
            public  = true
        }

        private1 = {
            cidr    = var.private_subnet1_cidr
            az      = var.az1
            public  = false
        }

        public2 = {
            cidr    = var.public_subnet2_cidr
            az      = var.az2
            public  = true
        }

        private2 = {
            cidr    = var.private_subnet2_cidr
            az      = var.az2
            public  = false
        }
    }
}

resource "aws_vpc" "vpc"{
    cidr_block = var.cidr_block

    tags = {
        Name = "ecs_vpc"
    }
}

resource "aws_internet_gateway" "igw"{
    vpc_id = aws_vpc.vpc.id
}

resource "aws_subnet" "subnets"{
    for_each = local.subnet

    vpc_id                  = aws_vpc.vpc.id
    cidr_block              = each.value.cidr
    availability_zone       = each.value.az
    map_public_ip_on_launch = each.value.public

    tags = {
        Name = each.key
    }
}

resource "aws_route_table" "rt"{
    vpc_id = aws_vpc.vpc.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.igw.id
    }

    tags = {
        Name = "public-rt"
    }
}

resource "aws_route_table_association" "rta" { 
    for_each = {
        for k, v in local.subnet : k => v if v.public
    }

    subnet_id = aws_subnet.subnets[each.key].id
    route_table_id = aws_route_table.rt.id
}

resource "aws_security_group" "sg"{
    name    = "ecs-sg"
    vpc_id  = aws_vpc.vpc.id

    ingress{
        description  = "Backend"
        protocol     = "tcp"
        from_port    = 8500
        to_port      = 8500
        cidr_blocks  = ["0.0.0.0/0"]
    }

    ingress{
        description  = "Frontend"
        protocol     = "tcp"
        from_port    = 80
        to_port      = 80
        cidr_blocks  = ["0.0.0.0/0"]
    }

    egress{
        protocol    = "-1"
        from_port   = 0
        to_port     = 0
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "ecs_sg"
    }
}

resource "aws_eip" "nat_eip"{   
    domain = "vpc"
}

resource "aws_nat_gateway" "nat"{
    allocation_id = aws_eip.nat_eip.id
    subnet_id = aws_subnet.subnets["public1"].id
    depends_on = [aws_internet_gateway.igw]

    tags = {
        Name = "nat-gateway"
    }
}

resource "aws_route_table" "private_rt"{
    vpc_id = aws_vpc.vpc.id

    route {
        cidr_block     = "0.0.0.0/0"
        nat_gateway_id = aws_nat_gateway.nat.id
    }

    tags = {
        Name = "private-rt"
    }
}

resource "aws_route_table_association" "private_rta"{
    for_each = {
        for k, v in local.subnet: k => v if !v.public
    }

    subnet_id      = aws_subnet.subnets[each.key].id
    route_table_id = aws_route_table.private_rt.id
}


output "public_subnet1_id" {
  value = aws_subnet.subnets["public1"].id
}

output "private_subnet1_id" {
  value = aws_subnet.subnets["private1"].id
}

output "public_subnet2_id" {
  value = aws_subnet.subnets["public2"].id
}

output "private_subnet2_id" {
  value = aws_subnet.subnets["private2"].id
}

output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "security_group_id" {
    value = aws_security_group.sg.id
}