variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name"
  type        = string
}

variable "domain_name" {
  description = "domain name"
  type        = string
}

variable "api_gateway_invoke_url" {
  type = string
}

variable "from_email" {
  type = string
}

variable "to_email" {
  type = string
}