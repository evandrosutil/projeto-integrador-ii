from django.shortcuts import render
from .models import Usuario

def home(request):
    return render(request,'usuarios/cadastro.html')

def cadastro_usuario(request):
    novo_usuario = Usuario()
    novo_usuario.nome = request.POST.get('nome')
    novo_usuario.sobrenome = request.POST.get('sobrenome')
    novo_usuario.idade = request.POST.get('idade')
    novo_usuario.telefone = request.POST.get('telefone')
    novo_usuario.email = request.POST.get('email')
    novo_usuario.rua = request.POST.get('rua')
    novo_usuario.numero = request.POST.get('numero')
    novo_usuario.complemento = request.POST.get('complemento')
    novo_usuario.bairro = request.POST.get('bairro')
    novo_usuario.cidade = request.POST.get('cidade')
    novo_usuario.cep = request.POST.get('cep')
    novo_usuario.save()

    return render(request, 'usuarios/cadastro_adotante_sucesso.html') 

def usuarios(request):

    usuarios = {
        'usuarios': Usuario.objects.all()
    }

    render(request,'usuarios/usuarios.html',usuarios)
