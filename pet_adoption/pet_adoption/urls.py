from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from animals.views import AnimalViewSet, RegisterView, UserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register('animals', AnimalViewSet, basename='animal')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/register/', UserRegistrationView.as_view(), name='auth_register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]