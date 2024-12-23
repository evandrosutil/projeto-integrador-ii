# projeto-integrador-ii
Repositório com código para avaliação do projeto integrador II da UNIVESP.

## Ambiente de desenvolvimento

### Docker
Usando o docker você consegue subir o banco de dados, o backend e o frontend:
```sh
docker compose up -d
```

Depois, basta acessar [http://localhost:3000](http://localhost:3000)


### Backend
#### Banco de dados
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

#### ambiente e inicialização do servidor
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
python manage.py makemigrations

# roda as migrations
python manage.py migrate
```

Por fim, para rodar o server:
```bash
python manage.py runserver
```

### Frontend

```bash
# caso tenha algum erro com SSL, executar:
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# instala as dependências
npm install

# inicia o front
npm start
```
