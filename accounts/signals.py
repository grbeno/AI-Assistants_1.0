from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
import logging
from config.settings import DEBUG, EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER


logger = logging.getLogger(__name__)

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

    # Use valid email address - fallback to default if EMAIL_HOST_USER not set
    sent_from = EMAIL_HOST_USER if EMAIL_HOST_USER else "szaktan-dev@szaktanweb.com"
    
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
    
    try:
        msg.send()
        logger.info(f"Password reset email sent to {reset_password_token.user.email}")
    except Exception as e:
        logger.error(f"Failed to send password reset email: {e}")
        if DEBUG:
            print(f"Password reset token for {reset_password_token.user.email}: {reset_password_token.key}")
            print(f"Reset URL: {context['reset_password_url']}")
        # Don't re-raise exception - allow the password reset request to succeed
        # The user can still use the token if they have it from logs

