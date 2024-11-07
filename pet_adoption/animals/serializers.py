from rest_framework import serializers
from .models import Animal, User, AdopterProfile
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

   
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


    # SEGUNDO TESTE
    # def create(self, validated_data):
    #     try:
    #         profile_data = validated_data.pop('profile')
    #         # Remove phone do validated_data se existir no nível raiz
    #         validated_data.pop('phone', None)
            
    #         # Cria o usuário
    #         user = User.objects.create_user(
    #             **validated_data,
    #             # role='adopter'  # Força o role como 'adopter'
    #         )
            
    #         # Cria o perfil
    #         AdopterProfile.objects.create(user=user, **profile_data)
            
    #         return user
            
    #     except Exception as e:
    #         # Se algo der errado, deletamos o usuário para evitar órfãos
    #         if 'user' in locals():
    #             user.delete()
    #         raise e

    
    # PRIMEIRO TESTE
    # def create(self, validated_data):
    #     profile_data = validated_data.pop('profile', None)
        
    #     # Verifica se já existe um usuário com este email
    #     email = validated_data.get('email')
    #     existing_user = User.objects.filter(email=email).first()
        
    #     if existing_user:
    #         # Se o usuário existe, atualiza os dados do perfil
    #         if profile_data and existing_user.role == 'adopter':
    #             profile, created = AdopterProfile.objects.update_or_create(
    #                 user=existing_user,
    #                 defaults=profile_data
    #             )
    #         return existing_user
            
    #     # Se não existe, cria um novo usuário
    #     user = User.objects.create_user(**validated_data)
        
    #     if user.role == 'adopter' and profile_data:
    #         AdopterProfile.objects.create(user=user, **profile_data)
            
    #     return user

    # def update(self, instance, validated_data):
    #     profile_data = validated_data.pop('profile', None)
        
    #     # Atualiza os dados do usuário
    #     for attr, value in validated_data.items():
    #         if attr == 'password':
    #             instance.set_password(value)
    #         else:
    #             setattr(instance, attr, value)
    #     instance.save()
        
    #     # Atualiza ou cria o perfil
    #     if profile_data and instance.role == 'adopter':
    #         AdopterProfile.objects.update_or_create(
    #             user=instance,
    #             defaults=profile_data
    #         )
            
    #     return instance

class AnimalSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = Animal
        fields = [
            'id', 'name', 'species', 'breed', 'gender',
            'age_estimated', 'weight', 'status', 'description',
            'vaccinated', 'neutered', 'created_at', 'updated_at',
            'created_by'
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