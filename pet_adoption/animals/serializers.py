from rest_framework import serializers
from .models import Animal, User
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator


    
User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data['role']
        )
        return user

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