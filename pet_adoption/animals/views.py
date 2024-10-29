from rest_framework import viewsets, filters, generics, permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Animal, User
from .permissions import IsAdminUser
from .serializers import AnimalSerializer, UserRegistrationSerializer
from rest_framework.permissions import AllowAny


class UserRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    permission_classes = [IsAuthenticated]  # Para listar animais, qualquer usuário autenticado

    filterset_fields = ['species', 'status', 'vaccinated', 'neutered']
    search_fields = ['name', 'breed', 'description']
    ordering_fields = ['created_at', 'name', 'species']

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_animals = Animal.objects.count()
        available_animals = Animal.objects.filter(status='available').count()
        adopted_animals = Animal.objects.filter(status='adopted').count()
        
        return Response({
            'total_animals': total_animals,
            'available_animals': available_animals,
            'adopted_animals': adopted_animals
        })

    @action(detail=True, methods=['post'])
    def adopt(self, request, pk=None):
        animal = self.get_object()
        if animal.status != 'available':
            return Response(
                {'error': 'Este animal não está disponível para adoção'},
                status=400
            )
        
        animal.status = 'adopted'
        animal.save()
        
        return Response({'status': 'Animal marcado como adotado'})