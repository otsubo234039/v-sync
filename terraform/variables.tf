variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1" # AWS Academyの標準リージョン
}

variable "project_name" {
  description = "Project name tag"
  type        = string
  default     = "V-Sync"
}