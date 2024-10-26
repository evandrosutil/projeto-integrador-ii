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
    email = models.EmailField(unique=True) 
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username