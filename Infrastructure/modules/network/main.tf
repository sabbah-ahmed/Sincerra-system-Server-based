####################### vpc ##########################
resource "aws_vpc" "main" {
    cidr_block = var.vpc_cidr

    tags = {
        Name = var.vpc_name
        environment = var.environment
        terraform = "true"
    }
}

####################### public subnets ##########################
resource "aws_subnet" "public" {
    for_each = var.public_subnets

    vpc_id           = aws_vpc.main.id
    cidr_block       = each.value
    availability_zone = each.key

    tags = {
        Name = "${var.vpc_name}-public-${each.key}"
        environment = var.environment
        terraform = "true"
    }
}
####################### internet gateway ##########################
resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.main.id

    tags = {
        Name = "${var.vpc_name}-igw"
        environment = var.environment
        terraform = "true"
    }
}



####################### public route table ##########################
resource "aws_route_table" "public" {
    vpc_id = aws_vpc.main.id

    tags = {
        Name = "${var.vpc_name}-public-rt"
        environment = var.environment
        terraform = "true"
    }
}


####################### public route table associations ##########################
resource "aws_route_table_association" "public_assoc" {
    for_each = aws_subnet.public

    subnet_id = each.value.id
    route_table_id = aws_route_table.public.id

}

####################### public route ##########################
resource "aws_route" "public_internet_access" {
    route_table_id = aws_route_table.public.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
}

##################################################################################################################


####################### private subnets ##########################
resource "aws_subnet" "private" {
    for_each = var.private_subnets

    vpc_id = aws_vpc.main.id
    cidr_block = each.value
    availability_zone = each.key

    tags = {
        Name = "${var.vpc_name}-private-${each.key}"
        environment = var.environment
        terraform = "true"
    }
}

######################## private route table ##########################
resource "aws_route_table" "private" {
    vpc_id = aws_vpc.main.id

    tags = {
        Name = "${var.vpc_name}-private-rt"
        environment = var.environment
        terraform = "true"
    }
}


######################## eip for nat gateway ##########################
resource "aws_eip" "nat_eip" {
    domain = "vpc"

    tags = {
        Name = "${var.vpc_name}-nat-eip"
        environment = var.environment
        terraform = "true"
    }
}

####################### nate gateway ##########################
resource "aws_nat_gateway" "nat" {
    allocation_id = aws_eip.nat_eip.id
    subnet_id = aws_subnet.public["us-east-1a"].id

    tags = {
        Name = "${var.vpc_name}-nat-gateway"
        environment = var.environment
        terraform = "true"
    }

}


####################### private route table associations ##########################
resource "aws_route_table_association" "private_assoc" {
    for_each = aws_subnet.private

    subnet_id = each.value.id
    route_table_id = aws_route_table.private.id

}

####################### private route ##########################
resource "aws_route" "private_internet_access" {
    route_table_id = aws_route_table.private.id
    destination_cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
}


