# projeto-integrador-ii
Repositório com código para avaliação do projeto integrador II da UNIVESP.

## Ambiente de desenvolvimento

Para criar o banco de dados:
```bash
docker compose up -d

docker ps

docker exec -it {{container_id}} createdb -U root petadocao
```

Para acessar o banco de dados:
```bash
psql -h localhost -p 5432 -U root -d petadocao
```