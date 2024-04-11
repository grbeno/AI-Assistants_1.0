from django.db import models


class Chat(models.Model):

    prompt = models.TextField(max_length=500)
    answer = models.CharField(max_length=1000)

    def __str__(self):
        return str(self.prompt)
