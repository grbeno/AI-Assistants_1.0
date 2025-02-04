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
	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		
		# Check for forwarded protocol (for proxies like Railway)
		forwarded_proto = self.request.META.get('HTTP_X_FORWARDED_PROTO')
		is_secure = self.request.is_secure() or forwarded_proto == 'https'

		# Set HTTP/HTTPS protocol
		http_protocol = 'https://' if is_secure else 'http://'
		context['BACKEND_URL'] = f"{http_protocol}{self.request.get_host()}"
		
		# Set WS/WSS protocol
		ws_protocol = 'wss://' if is_secure else 'ws://'
		context['WS_URL'] = f"{ws_protocol}{self.request.get_host()}"
		
		return context


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
    
