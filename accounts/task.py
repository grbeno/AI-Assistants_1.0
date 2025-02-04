# from celery import shared_task
# from django.core.management import call_command

# @shared_task
# def flush_expired_tokens_task():
#     call_command('flushexpiredtokens')# # yourapp/tasks.py


# from celery import shared_task
# from django.utils import timezone
# from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

# @shared_task
# def flush_expired_tokens():
#     """
#     Celery task to flush expired JWT tokens.
#     """
#     now = timezone.now()

#     # Delete outstanding tokens that have expired
#     OutstandingToken.objects.filter(expires_at__lte=now).delete()

#     # Blacklist tokens that are past their grace period (if applicable)
#     BlacklistedToken.objects.filter(token__expires_at__lte=now).delete()

#     print("Expired tokens flushed successfully.")