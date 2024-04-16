from django.http import HttpResponse
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Chat
from .serializers import ChatSerializer
from .assistant import Assistant


# Django home page
def home(request):
    return HttpResponse("<h1>Hello, Django-React developer!</h1>")


# React home page
class React(TemplateView):
    template_name = 'index.html'


# Chat API
class ChatAPI(APIView):
    pass


class ChatAI(APIView):
	
	serializer_class = ChatSerializer

	def get(self, request):
		detail = Chat.objects.filter(user=request.user.id)
		serializer = ChatSerializer(detail, many=True)
		return Response(serializer.data)
	
	def post(self, request):
		return Assistant(request).get_chat()
		
	def delete(self, request, pk):
		try:
			detail = Chat.objects.get(pk=pk)
			detail.delete()
			return Response({'message': 'Item deleted successfully.'})
		except Chat.DoesNotExist:
			return Response({'error': 'Item not found.'})
    
