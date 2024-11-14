from rest_framework import viewsets, filters, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import IntegrityError
from django_filters.rest_framework import DjangoFilterBackend
from .models import Animal, User, AdoptionIntent
from .permissions import IsAdminUser
from .serializers import AnimalSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserRegistrationSerializer

    def get_object(self):
        # Retorna o usuário autenticado
        return self.request.user

class UserRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'User registered successfully'
                }, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                return Response({
                    'status': 'error',
                    'message': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    # permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(role='admin')

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = []
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

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
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def adopt(self, request, pk=None):
        animal = self.get_object()
        user = request.user

        if animal.status != 'available':
            return Response(
                {'detail': 'Este animal não está disponível para adoção.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if AdoptionIntent.objects.filter(user=user, animal=animal).exists():
            return Response(
                {'detail': 'Você já expressou interesse em adotar este animal.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        AdoptionIntent.objects.create(user=user, animal=animal)
        
        return Response(
            {'detail': 'Intenção de adoção registrada com sucesso.'},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def change_status(self, request, pk=None):
        animal = self.get_object()
        new_status = request.data.get('status')

        if new_status not in dict(Animal.STATUS_CHOICES):
            return Response(
                {'detail': 'Status inválido.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        animal.status = new_status
        animal.save()

        return Response(
            {'detail': f'Status do animal atualizado para {new_status}.'},
            status=status.HTTP_200_OK
        )