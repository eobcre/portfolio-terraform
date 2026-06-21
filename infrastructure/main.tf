terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

#################################
# Data Sources
#################################

# existing acm
data "aws_acm_certificate" "portfolio" {
  domain      = var.domain_name
  statuses    = ["ISSUED"]
  most_recent = true
}

# existing cloudfront distribution
data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host_header" {
  name = "Managed-AllViewerExceptHostHeader"
}

# archive file
data "archive_file" "email_api_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend"
  output_path = "${path.module}/email-api.zip"
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
  name                              = "portfolio-oac"
  description                       = "OAC for portfolio S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

#################################
# CloudFront Distribution
#################################

resource "aws_cloudfront_distribution" "portfolio" {
  enabled             = true
  default_root_object = "index.html"
  comment             = "for terraform-portfolio"
  price_class         = "PriceClass_100"

  /////////////////////////////////
  # Origin
  ////////////////////////////////

  origin {
    domain_name              = aws_s3_bucket.portfolio.bucket_regional_domain_name
    origin_id                = "S3-Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.portfolio_oac.id
  }

  origin {
    domain_name = replace(aws_apigatewayv2_api.email_api.api_endpoint, "https://", "")
    origin_id   = "API-Gateway-Origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  /////////////////////////////////
  # Cache Behaviors
  ////////////////////////////////

  # default
  default_cache_behavior {
    target_origin_id       = "S3-Origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  # api gateway
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "API-Gateway-Origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"]

    cached_methods = ["GET", "HEAD", "OPTIONS"]

    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
  }

  /////////////////////////////////
  # Error Pages
  ////////////////////////////////

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
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
    acm_certificate_arn      = data.aws_acm_certificate.portfolio.arn
    ssl_support_method       = "sni-only"
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
# API Gateway - HTTP API
#################################

# create
resource "aws_apigatewayv2_api" "email_api" {
  name          = "email-api"
  protocol_type = "HTTP"

  # cors
  cors_configuration {
    allow_origins = ["https://${var.domain_name}"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
  }
}

# default stage - no stage name in url
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.email_api.id
  name        = "$default"
  auto_deploy = true
}

#################################
# Lambda - email API
#################################

# create
resource "aws_lambda_function" "email_api" {
  function_name = "email-api"
  role          = aws_iam_role.lambda_exec.arn
  runtime       = "python3.14"
  handler       = "lambda_function.lambda_handler"

  filename         = data.archive_file.email_api_zip.output_path
  source_code_hash = data.archive_file.email_api_zip.output_base64sha256

  # environment variables
  environment {
    variables = {
      FROM_EMAIL = var.from_email
      TO_EMAIL   = var.to_email
    }
  }
}

#################################
# IAM Role for Lambda
#################################

# allow lambda to assume this role
resource "aws_iam_role" "lambda_exec" {
  name = "email-api-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# cloudWatch logs permissions for lambda
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# api gateway -> lambda
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_api.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.email_api.execution_arn}/*/*"
}