from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    pass

class OpenAITokens(models.Model):
    user = models.ForeignKey(CustomUser, null=True, on_delete=models.CASCADE)
    model = models.CharField(max_length=200, default="gpt-4o-mini")
    input_token = models.IntegerField(default=0)
    output_token = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - tokens: {self.input_token + self.output_token}"
