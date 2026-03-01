# AWSプロバイダーの設定
provider "aws" {
  region = var.aws_region
}

# セキュリティグループの定義
resource "aws_security_group" "v_sync_sg" {
  name        = "v-sync-security-group"
  description = "Security group for V-Sync App"

  # SSH (22), HTTP (80), HTTPS (443), Next.js (3000) を許可 [cite: 10]
  dynamic "ingress" {
    for_each = [22, 80, 443, 3000]
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2インスタンスの定義 [cite: 8]
resource "aws_instance" "v_sync_server" {
  ami           = "ami-051f8b2138534b133" # Amazon Linux 2023
  instance_type = "t3.small"               # 基本設計書より [cite: 8]
  
  vpc_security_group_ids = [aws_security_group.v_sync_sg.id]
  
  tags = {
    Name = "V-Sync-Server"
  }
}

# 固定IP (Elastic IP) の割り当て [cite: 9]
resource "aws_eip" "v_sync_eip" {
  instance = aws_instance.v_sync_server.id
  domain   = "vpc"
}