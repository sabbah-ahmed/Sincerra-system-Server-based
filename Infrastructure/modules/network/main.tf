####################### vpc ##########################
resource "vpc" "main" {
    name = var.vpc_name
    cidr = var.vpc_cidr

    tags = {
        Name = var.vpc_name
        environment = var.environment
        terraform = "true"
    }
}

####################### public subnets ##########################
resource "subnet" "public" {
    for_each = var.public_subnets

    vpc_id           = vpc.main.id
    cidr_block       = each.value
    availability_zone = each.key

    tags = {
        Name = "${var.vpc_name}-public-${each.key}"
        environment = var.environment
        terraform = "true"
    }
}
####################### internet gateway ##########################
resource "internet_gateway" "igw" {
    vpc_id = vpc.main.id

    tags = {
        Name = "${var.vpc_name}-igw"
        environment = var.environment
        terraform = "true"
    }
}



####################### public route table ##########################
resource "route_table" "public" {
    vpc_id = vpc.main.id

    tags = {
        Name = "${var.vpc_name}-public-rt"
        environment = var.environment
        terraform = "true"
    }
}


####################### public route table associations ##########################
resource "route_table_association" "public_assoc" {
    for_each = subnet.public

    subnet_id = each.value.id
    route_table_id = route_table.public.id

}

####################### public route ##########################
resource "route" "public_internet_access" {
    route_table_id = route_table.public.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = internet_gateway.igw.id
}

##################################################################################################################


####################### private subnets ##########################
resource "subnet" "private" {
    for_each = var.private_subnets

    vpc_id = vpc.main.id
    cidr_block = each.value
    availability_zone = each.key

    tags = {
        Name = "${var.vpc_name}-private-${each.key}"
        environment = var.environment
        terraform = "true"
    }
}

######################## private route table ##########################
resource "route_table" "private" {
    vpc_id = vpc.main.id

    tags = {
        Name = "${var.vpc_name}-private-rt"
        environment = var.environment
        terraform = "true"
    }
}


######################## eip for nat gateway ##########################
resource "eip" "nat_eip" {
    vpc = true

    tags = {
        Name = "${var.vpc_name}-nat-eip"
        environment = var.environment
        terraform = "true"
    }
}

####################### nate gateway ##########################
resource "nat_gateway" "nat" {
    allocation_id = eip.nat_eip.id
    subnet_id = subnet.public["us-east-1a"].id

    tags = {
        Name = "${var.vpc_name}-nat-gateway"
        environment = var.environment
        terraform = "true"
    }

}


####################### private route table associations ##########################
resource "route_table_association" "private_assoc" {
    for_each = subnet.private

    subnet_id = each.value.id
    route_table_id = route_table.private.id

}

####################### private route ##########################
resource "route" "private_internet_access" {
    route_table_id = route_table.private.id
    destination_cidr_block = "0.0.0.0/0"
    nat_gateway_id = nat_gateway.nat.id
}


