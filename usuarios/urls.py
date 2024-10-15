from django.urls import path

from . import views

urlpatterns = [
        path("cadastro", views.home, name="novo_usuario"),
        path("cadastro/sucesso", views.cadastro_usuario, name="cadastro_realizado"),
        path("lista", views.usuarios, name="lista_usuarios")
]

