provider "aws" {
  region = var.aws_region
}

# 1. VPC
resource "aws_vpc" "prepai_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "PrepAI-VPC"
  }
}

# 2. Internet Gateway
resource "aws_internet_gateway" "prepai_igw" {
  vpc_id = aws_vpc.prepai_vpc.id

  tags = {
    Name = "PrepAI-IGW"
  }
}

# 3. Public Subnet
resource "aws_subnet" "prepai_public_subnet" {
  vpc_id                  = aws_vpc.prepai_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"

  tags = {
    Name = "PrepAI-Public-Subnet"
  }
}

# 4. Route Table & Association
resource "aws_route_table" "prepai_public_rt" {
  vpc_id = aws_vpc.prepai_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.prepai_igw.id
  }

  tags = {
    Name = "PrepAI-Public-RT"
  }
}

resource "aws_route_table_association" "prepai_public_rta" {
  subnet_id      = aws_subnet.prepai_public_subnet.id
  route_table_id = aws_route_table.prepai_public_rt.id
}

# 5. Security Group
resource "aws_security_group" "k8s_sg" {
  name        = "prepai_k8s_sg"
  description = "Security group for PrepAI K8s Node"
  vpc_id      = aws_vpc.prepai_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Auth Service"
    from_port   = 8001
    to_port     = 8001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "K8s NodePort Services"
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "PrepAI-K8s-SG"
  }
}

# 6. SSH Key Pair
resource "aws_key_pair" "deployer" {
  key_name   = "prepai-deployer-key"
  public_key = file(var.public_key_path)
}

# 7. AMI Data Source
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 8. EC2 Instance
resource "aws_instance" "k8s_node" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.deployer.key_name
  vpc_security_group_ids      = [aws_security_group.k8s_sg.id]
  subnet_id                   = aws_subnet.prepai_public_subnet.id
  associate_public_ip_address = true

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = "PrepAI-K8s-Node"
  }
}
