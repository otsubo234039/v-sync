output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.v_sync_eip.public_ip
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.v_sync_server.id
}