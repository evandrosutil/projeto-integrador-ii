from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models

class Animal(models.Model):
    GENDER_CHOICES = [
        ('M', 'Macho'),
        ('F', 'Fêmea')
    ]
    
    STATUS_CHOICES = [
        ('available', 'Disponível'),
        ('adopted', 'Adotado'),
        ('under_treatment', 'Em tratamento'),
        ('quarantine', 'Em quarentena')
    ]
    
    name = models.CharField(max_length=100, verbose_name='Nome')
    species = models.CharField(max_length=100, verbose_name='Espécie')
    breed = models.CharField(max_length=100, verbose_name='Raça', blank=True)
    gender = models.CharField(
        max_length=1, 
        choices=GENDER_CHOICES, 
        verbose_name='Gênero'
    )
    age_estimated = models.IntegerField(verbose_name='Idade Estimada')
    weight = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        verbose_name='Peso (kg)'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available',
        verbose_name='Status'
    )
    description = models.TextField(verbose_name='Descrição', blank=True)
    vaccinated = models.BooleanField(default=False, verbose_name='Vacinado')
    neutered = models.BooleanField(default=False, verbose_name='Castrado')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='animals_created'
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Animal'
        verbose_name_plural = 'Animais'

    def __str__(self):
        return f"{self.name} - {self.species} ({self.breed})"

class User(AbstractUser):
    USER_ROLES = [
        ('admin', 'Administrador'),
        ('adopter', 'Adotante'),
    ]

    email = models.EmailField(unique=True) 
    role = models.CharField(max_length=10, choices=USER_ROLES, default='adopter')
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class AdopterProfile(models.Model):
    RESIDENCE_CHOICES = [
        ('HOUSE', 'Casa'),
        ('APARTMENT', 'Apartamento'),
        ('FARM', 'Fazenda')
    ]
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    birth_date = models.DateField(blank=True, null=True)
    street_name = models.CharField(max_length=255)
    street_number = models.CharField(max_length=10)
    complement = models.CharField(max_length=255, blank=True)
    neighborhood = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    residence_type = models.CharField(max_length=10, choices=RESIDENCE_CHOICES, default='HOUSE')
    has_screens = models.BooleanField(default=False)
    number_of_residents = models.IntegerField(default=1)
    has_children = models.BooleanField(default=False)
    has_allergic_residents = models.BooleanField(default=False)
    has_other_pets = models.BooleanField(default=False)
    number_of_pets = models.IntegerField(default=0)
    adoption_motivation = models.TextField(blank=True)
    acknowledges_costs = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Perfil de {self.user.username}"