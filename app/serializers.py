from .models import Chat
from rest_framework import serializers


class ChatSerializer(serializers.ModelSerializer):
	class Meta:
		model = Chat
		fields = ('id', 'timestamp', 'mode', 'prompt', 'answer', 'user')