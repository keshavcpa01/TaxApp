# backend/email_utils.py
import os
import sendgrid
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL")

def send_confirmation_email(to_email: str, payer_name: str, count: int):
    if not SENDGRID_API_KEY or not FROM_EMAIL:
        print("SendGrid config missing. Skipping email.")
        return

    sg = sendgrid.SendGridAPIClient(SENDGRID_API_KEY)
    subject = "✅ 1099 Submission Confirmation"
    content = f"Dear {payer_name},\n\nYou successfully submitted {count} 1099 form(s)."

    message = Mail(from_email=FROM_EMAIL, to_emails=to_email, subject=subject, plain_text_content=content)
    
    try:
        response = sg.send(message)
        print("✅ Confirmation email sent:", response.status_code)
    except Exception as e:
        print("❌ Email send failed:", e)
