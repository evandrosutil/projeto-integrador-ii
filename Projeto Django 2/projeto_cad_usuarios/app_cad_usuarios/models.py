from django.db import models

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nome = models.TextField(max_length=255)
    sobrenome = models.TextField(max_length=255)
    idade = models.TextField(max_length=255)
    telefone = models.TextField(max_length=255)
    email = models.TextField(max_length=255)
    endereco = models.TextField(max_length=255)
    bairro = models.TextField(max_length=255)
    cidade = models.TextField(max_length=255)
    

