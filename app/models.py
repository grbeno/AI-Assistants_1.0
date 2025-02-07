from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
    

class Chat(models.Model):

    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    mode = models.CharField(max_length=200, default="Chat")
    prompt = models.TextField(max_length=500)
    answer = models.CharField(max_length=1000)

    class Meta:
        ordering = ['timestamp']  # Sort by timestamp in ascending order

    def __str__(self):
        return str(self.prompt)
