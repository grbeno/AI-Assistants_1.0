from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework_simplejwt.views import TokenRefreshView

from app.views import React
from accounts.views import (
    BlacklistTokenUpdateView,
    MyTokenObtainPairView,
    # GetEmail,
)

urlpatterns = [
    
    path('no4uh/', admin.site.urls),
    
    # App
    path("", include("app.urls")),

    # Password reset
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api/password_reset/validate_token/', include('django_rest_passwordreset.urls', namespace='password_reset_validate')),
    # path('api/token_email/', GetEmail.as_view(), name='token_email'),
    
    # User model
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),

    # JWT
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # logout
    path('api/token/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist'),

    # React
    path('', React.as_view(), name='home'),
    # auth
    path('login/', React.as_view(), name='login'),
    path('signup/', React.as_view(), name='signup'),
    path('change/', React.as_view(), name='change-password'),
    path('success/', React.as_view(), name='success'),
    path('reset/', React.as_view(), name='reset-password'),
    # app
    path('lang-assistant/', React.as_view(), name='dashboard'),
    path('ws/chat/', React.as_view(), name='profile'),
    path('coder-assistant/', React.as_view(), name='settings'),

    #re_path(r'^.*', React.as_view(), name='frontend'),  # Uncomment for react development on localhost:3000 -> npm start ...

]

handler404 = 'app.views.custom_404_view'
