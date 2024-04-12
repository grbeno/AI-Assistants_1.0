from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
    

class Chat(models.Model):

    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)

    timestamp = models.DateTimeField(default=timezone.now)
    
    """ CHOICES = (
        (0, "Chat"),
        (1, "Translate to English"),
        (2, "Translate to Hungarian"),
        (3, "Translate to German"),
        (4, "Translate to Latin"),
        (5, "Correct grammatical errors"),
        (6, "Correct as if it was written by a native speaker"),
    ) """

    mode = models.CharField(max_length=200, default="Chat")
    prompt = models.TextField(max_length=500)
    answer = models.CharField(max_length=1000)

    def __str__(self):
        return str(self.prompt)
