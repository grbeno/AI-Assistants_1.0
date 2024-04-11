# accounts.urls
from django.urls import path, include
from .views import IsSuperuser, ChangePasswordView, SignupView, DeleteUser

urlpatterns = [
    
    path('signup/', SignupView.as_view(), name="create_user"),
    path('change_password/', ChangePasswordView.as_view(), name="change_password"),
    path('is_superuser/', IsSuperuser.as_view(), name="is_superuser"),
    path('delete_user/<int:pk>', DeleteUser.as_view(), name="delete_user"),
   
]