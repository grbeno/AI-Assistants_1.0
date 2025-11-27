from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
import logging
import threading
import resend
from config.settings import DEBUG, env


logger = logging.getLogger(__name__)

def send_email_async(msg, user_email, reset_url, sent_from):
    """Send email in a separate thread to avoid blocking the HTTP response"""
    try:
        logger.info(f"Attempting to send email from {sent_from} to {user_email}")
        msg.send()
        logger.info(f"Password reset email successfully sent to {user_email}")
    except Exception as e:
        logger.error(f"Failed to send password reset email to {user_email}: {str(e)}")
        logger.error(f"Sender: {sent_from}, Reset URL: {reset_url}")
        if DEBUG:
            print(f"ERROR: Failed to send email to {user_email}")
            print(f"Error details: {str(e)}")
            print(f"Reset URL: {reset_url}")

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    # Generate frontend URL that matches React route
    scheme = instance.request.scheme
    host = instance.request.get_host()
    
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}://{}/api/password_reset/confirm/{}".format(
            scheme,
            host,
            reset_password_token.key
        )
    }
    
    # render email text
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    # Use valid email address
    sent_from = env.str("EMAIL_USER")
    # sent_from = "127.0.0.1:25"  # for local testing with console email backend
    
    # Send email with SMTP
    if DEBUG:
        msg = EmailMultiAlternatives(
            # title:
            "Password Reset for {title}".format(title="AI-Assistants Web App"),
            # message:
            email_plaintext_message,
            # from:
            sent_from,
            # to:
            [reset_password_token.user.email]
        )
        msg.attach_alternative(email_html_message, "text/html")
    else:
        # Send email with https - Resend API
        resend.api_key = env.str("RESEND_API_KEY")
        msg = resend.Emails.send({
            "from": sent_from,
            "to": [reset_password_token.user.email],
            "subject": "Password Reset for {title}".format(title="AI-Assistants Web App"),
            "html": email_html_message
        })
    
    # Send email asynchronously in a separate thread to avoid blocking HTTP response
    thread = threading.Thread(
        target=send_email_async,
        args=(msg, reset_password_token.user.email, context['reset_password_url'], sent_from)
    )
    thread.daemon = True
    thread.start()
    
    logger.info(f"Password reset email queued for {reset_password_token.user.email} from {sent_from}")

