from django.http import HttpResponse
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response

from environs import Env
import openai
import random

from .models import Chat
from .serializers import ChatSerializer

# Read .env file
env = Env()
env.read_env()


# Django home page
def home(request):
    return HttpResponse("<h1>Hello, Django-React developer!</h1>")


# React home page
class React(TemplateView):
    template_name = 'index.html'


# Chat API
class ChatAPI(APIView):
    pass


api_key = env.str("OPENAI_API_KEY")

class ChatAI(APIView):
	
	serializer_class = ChatSerializer

	def get(self, request):
		detail = Chat.objects.filter(user=request.user.id)
		serializer = ChatSerializer(detail, many=True)
		return Response(serializer.data)
	
	def post(self, request):
		form_input = request.data['prompt']
		mode = request.data['mode']
		model = request.data['model']
		
		# print(request.data)  # teszt
		
		""" Prompt management """

		if mode.startswith("Translate"):  # 
			system_role_content="""You are a translator. You can translate everything from English, Hungarian, German and Latin. 
								If the language of the request is the same as the language of the translation, do not react, but write out the question as a response!"""
		elif mode.startswith("Correct"):
			system_role_content="""You are an English and German teacher. 
								You correct the texts as a native speaker with excellent knowledge of grammar would. 
								If you get a prompt, your response will be the correction if a correction is necesarry. 
								If the language of the request is not English or German, write 'Sorry, I can only correct texts in English or German.' as a response!"""
		else:
			system_role_content="You are a helpful assistant. Please provide a brief, but useful response consisting of 3-4 sentences."
			
		#print(system_role_content)  # teszt

		""" OpenAI API """

		if api_key:
			openai.api_key = api_key
			response = openai.chat.completions.create(
				model=model,  # "gpt-3.5-turbo", "gpt-4",
				messages=[
					{"role": "system", "content": system_role_content},
					{"role": "user", "content": f"{mode}: {form_input}"}
				],
				temperature=1, # 0-1
				max_tokens=256,
			)
			answer = response.choices[0].message.content
		else:
			answer = f"@Thank you for the prompt. Possible problem with API key! [test-answer-{random.randint(10000, 99999)}]"
				
		""" Data management, response """
		#print(answer)  # teszt
		
		data = { 'prompt': form_input, 'mode': mode, 'answer': answer, 'user': request.user.id }
		serializer = ChatSerializer(data=data, context={'request': request}) 

		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)

	def delete(self, request, pk):
		try:
			detail = Chat.objects.get(pk=pk)
			detail.delete()
			return Response({'message': 'Item deleted successfully.'})
		except Chat.DoesNotExist:
			return Response({'error': 'Item not found.'})
    
