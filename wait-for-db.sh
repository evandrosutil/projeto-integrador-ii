#!/bin/bash

# Espera até o banco de dados estar disponível
echo "Esperando o banco de dados ficar disponível..."
while ! nc -z db 5432; do
  sleep 1
done

# Banco de dados disponível, então executa as migrations
echo "Banco de dados está disponível! Executando migrations..."
python manage.py makemigrations
python manage.py migrate

# Executa o comando do Docker, por exemplo, iniciar o servidor
echo "Iniciando o servidor Django..."
exec "$@"
