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
    
    path('admin/', admin.site.urls),
    
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
    re_path(r'^.*$', React.as_view(), name='frontend'),  # Uncomment for react development on localhost:3000 -> npm start ...

]
