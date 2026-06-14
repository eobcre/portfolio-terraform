terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

#################################
# ACM
#################################

# existing acm
data "aws_acm_certificate" "portfolio" {
  domain = var.domain_name
  statuses = ["ISSUED"]
  most_recent = true
}

#################################
# S3 Bucket
#################################

resource "aws_s3_bucket" "portfolio" {
  bucket = var.bucket_name
}

#################################
# CloudFront - OAC
#################################

resource "aws_cloudfront_origin_access_control" "portfolio_oac" {
  name = "portfolio-oac"
  description = "OAC for portfolio S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

#################################
# CloudFront Distribution
#################################

resource "aws_cloudfront_distribution" "portfolio" {
  enabled = true
  default_root_object = "index.html"
  comment = "for terraform-portfolio"
  price_class = "PriceClass_100"

  /////////////////////////////////
  # Origin
  ////////////////////////////////

  origin {
    domain_name = aws_s3_bucket.portfolio.bucket_regional_domain_name
    origin_id = "S3-portfolio-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.portfolio_oac.id
  }

  /////////////////////////////////
  # Cache Behavior
  ////////////////////////////////

  default_cache_behavior {
    target_origin_id = "S3-portfolio-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  /////////////////////////////////
  # Restrictions
  ////////////////////////////////

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  /////////////////////////////////
  # SSL Certificate
  ////////////////////////////////

  aliases = [var.domain_name]

  viewer_certificate {
  acm_certificate_arn = data.aws_acm_certificate.portfolio.arn
  ssl_support_method = "sni-only"
  minimum_protocol_version = "TLSv1.2_2021"
  }
}

#################################
# S3 Bucket Policy
#################################

resource "aws_s3_bucket_policy" "portfolio_policy" {
  bucket = aws_s3_bucket.portfolio.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "AllowCloudFrontReadOnly"
        Effect = "Allow"

        Principal = {
          Service = "cloudfront.amazonaws.com"
        }

        Action = [
          "s3:GetObject"
        ]

        Resource = "${aws_s3_bucket.portfolio.arn}/*"

        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.portfolio.arn
          }
        }
      }
    ]
  })
}

#################################
# Route 53 - Hosted Zone
#################################

data "aws_route53_zone" "main" {
  name = var.domain_name
  private_zone = false
}

#################################
# Route 53 - Record
#################################

resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.main.zone_id
  name = var.domain_name
  type = "A"

  alias {
    name = aws_cloudfront_distribution.portfolio.domain_name
    zone_id = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}