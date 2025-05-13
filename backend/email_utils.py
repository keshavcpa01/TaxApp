# backend/email_utils.py

import os
import sendgrid
import base64
from sendgrid.helpers.mail import (
    Mail, Email, To,
    Attachment, FileContent, FileName, FileType, Disposition
)

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL")

def send_confirmation_email(to_email: str, payer_name: str, count: int, attachment_path: str | None = None):
    if not SENDGRID_API_KEY or not FROM_EMAIL:
        print("⚠️ SendGrid configuration missing. Skipping email.")
        return

    sg = sendgrid.SendGridAPIClient(SENDGRID_API_KEY)

    subject = "✅ Your 1099 Submission Confirmation"
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>✅ Thank you, {payer_name}!</h2>
        <p>You have successfully submitted <strong>{count}</strong> 1099 form(s).</p>
        <p>We've received your data and will process it accordingly.</p>

        <hr style="margin: 24px 0;" />
        <p style="font-size: 0.9em; color: #888;">
          If you have questions or need support, just reply to this email.
        </p>
        <p style="font-size: 0.9em; color: #aaa;">
          This is an automated message from your 1099 Filing Portal.
        </p>
      </body>
    </html>
    """

    message = Mail(
        from_email=Email(FROM_EMAIL),
        to_emails=To(to_email),
        subject=subject,
        html_content=html_content
    )

    # Attach PDF if provided
    if attachment_path and os.path.exists(attachment_path):
        with open(attachment_path, 'rb') as f:
            encoded_file = base64.b64encode(f.read()).decode()
        attachment = Attachment(
            file_content=FileContent(encoded_file),
            file_type=FileType('application/pdf'),
            file_name=FileName('1099-confirmation.pdf'),
            disposition=Disposition('attachment'),
        )
        message.attachment = attachment

    try:
        response = sg.send(message)
        print(f"📧 Email sent to {to_email} — status {response.status_code}")
    except Exception as e:
        print("❌ Email send failed:", e)
