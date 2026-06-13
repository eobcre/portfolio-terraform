terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

#################################
# S3 Bucket
#################################

resource "aws_s3_bucket" "portfolio" {
  bucket = var.bucket_name
}

