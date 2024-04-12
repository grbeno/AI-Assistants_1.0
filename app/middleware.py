# middleware.py
from app.views import React


class PortBasedMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.META.get('SERVER_PORT') == '3000':
            # If port 3000, route to React view
            return React.as_view()(request)
        else:
            # Otherwise, proceed with the regular Django view routing
            response = self.get_response(request)
            return response
