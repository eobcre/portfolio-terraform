import json
import os
import boto3

ses = boto3.client("ses")

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body") or "{}")

        # validation
        name = body.get("name", "").strip()
        email = body.get("email", "").strip()
        message = body.get("message", "").strip()

        if not all([name, email, message]):
            return response(400, {
                "ok": False,
                "error": "name, email, message are required."
            })

        # ses
        ses.send_email(
            Source=os.environ["FROM_EMAIL"],
            Destination={"ToAddresses": [os.environ["TO_EMAIL"]]},
            Message={
                "Subject": {"Data": f"Contact from {name}."},
                "Body": {
                    "Text": {
                        "Data": f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}\n"
                    }
                },
            },
            ReplyToAddresses=[email],
        )

        return response(200, {"ok": True})

    except Exception as err:
        print("SES send error:", err)
        return response(500, {
            "ok": False,
            "error": "Failed to send email..."
        })


def response(status_code, body):
    return {
        "statusCode": status_code,
        "body": json.dumps(body)
    }