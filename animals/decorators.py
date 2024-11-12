from functools import wraps
from django.shortcuts import redirect
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import login_required

def admin_required(function):
    @wraps(function)
    @login_required
    def wrap(request, *args, **kwargs):
        if request.user.user_type == 'ADMIN':
            return function(request, *args, **kwargs)
        raise PermissionDenied
    return wrap

def adoptant_required(function):
    @wraps(function)
    @login_required
    def wrap(request, *args, **kwargs):
        if request.user.user_type == 'ADOPTANT':
            return function(request, *args, **kwargs)
        raise PermissionDenied
    return wrap

# Decorator mais flexível que aceita múltiplos tipos de usuário
def user_type_required(allowed_types):
    def decorator(function):
        @wraps(function)
        @login_required
        def wrap(request, *args, **kwargs):
            if request.user.user_type in allowed_types:
                return function(request, *args, **kwargs)
            raise PermissionDenied
        return wrap
    return decorator