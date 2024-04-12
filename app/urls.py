from .views import home
from django.urls import path
from .views import ChatAI


urlpatterns = [
    path('api/chat/', ChatAI.as_view(), name='chat'),
    path('api/chat/<int:pk>/', ChatAI.as_view()),
]