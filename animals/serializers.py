from rest_framework import serializers
from .models import Animal, User, AdopterProfile
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

   
User = get_user_model()

class AdopterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdopterProfile
        fields = [
            'birth_date', 'phone', 'street_name',
            'street_number', 'complement', 'neighborhood', 'city', 'state',
            'zipcode', 'residence_type', 'has_screens', 'number_of_residents',
            'has_children', 'has_allergic_residents', 'has_other_pets',
            'number_of_pets', 'adoption_motivation', 'acknowledges_costs'
        ]

class UserRegistrationSerializer(serializers.ModelSerializer):
    profile = AdopterProfileSerializer(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role', 'profile')
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        role = data.get('role')
        profile = data.get('profile')

        # Se for adotante, profile é obrigatório
        if role == 'adopter' and not profile:
            raise serializers.ValidationError({
                'profile': 'Profile data is required for adopter users.'
            })
            
        # Se for admin, não deve ter profile
        if role == 'admin' and profile:
            raise serializers.ValidationError({
                'profile': 'Admin users should not have a profile.'
            })

        return data

    def create(self, validated_data):
        try:
            # Remove profile data se existir
            profile_data = validated_data.pop('profile', None)
            
            # Cria o usuário
            user = User.objects.create_user(**validated_data)
            
            # Se for adotante, cria o profile
            if user.role == 'adopter' and profile_data:
                AdopterProfile.objects.create(user=user, **profile_data)
            
            return user
            
        except Exception as e:
            # Se algo der errado, deletamos o usuário para evitar órfãos
            if 'user' in locals():
                user.delete()
            raise e

    def update(self, instance, validated_data):
        # Atualiza campos do usuário
        profile_data = validated_data.pop('profile', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Atualiza o perfil, se aplicável
        if profile_data and instance.role == 'adopter':
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        instance.save()
        return instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        
        return token

class AnimalSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = Animal
        fields = [
            'id', 'name', 'species', 'breed', 'gender',
            'age_estimated', 'weight', 'status', 'description',
            'vaccinated', 'neutered', 'created_at', 'updated_at',
            'created_by', 'image'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']

    def validate_age_estimated(self, value):
        if value < 0:
            raise serializers.ValidationError("A idade não pode ser negativa")
        return value

    def validate_weight(self, value):
        if value <= 0:
            raise serializers.ValidationError("O peso deve ser maior que zero")
        return value