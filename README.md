# projeto-integrador-ii
Repositório com código para avaliação do projeto integrador II da UNIVESP.

## Ambiente de desenvolvimento

### Banco de dados
Para criar a base de dados, com o docker rodando:
```bash
docker compose up -d

# informações sobre o container rodando
docker ps

docker exec -it {{container_id}} createdb -U root petadocao
```

Para acessar o banco de dados:
```bash
psql -h localhost -p 5432 -U root -d petadocao
```

```bash
# primeiro, crie o ambiente
python -m venv venv

# ative o ambiente
[windows]
venv\Scripts\Activate.ps1
[unix/linux]
source venv/bin/activate

# instale as dependêncais
python -m pip install -r requirements.txt
```

Com isso, você pode fazer e rodar as migrations do django:
```bash
# cria as migrations
python pet_adoption/manage.py makemigrations

# roda as migrations
python pet_adoption/manage.py migrate
```

Por fim, para rodar o server:
```bash
python pet_adoption/manage.py runserver
```