from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView
from rest_framework.views import APIView


# Django home page
def home(request):
    return HttpResponse("<h1>Hello, Django-React developer!</h1>")

# React home page
class React(TemplateView):
    template_name = 'index.html'
    
# Chat API
class ChatAPI(APIView):
    pass
    
