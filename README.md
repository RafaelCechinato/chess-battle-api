# chess-battle-api

Essa api serve para criação de conta, alteração, login e jogar xadrez tradicional é uma variante unica.

Primeiramente crie e configure um arquivo .env com base no .env-example

Secundamente é preciso criar um banco de dados postgresql e criar as tabelas inseridas no arquivo script.sql
e inserir as informações do banco de dados no .env

Terceiramente rodar os comando 
- npm install
- docker compose build
- docker compose up -d
- npm run dev

E agora a api deve estar rodando no link:
- http://localhost:3000/api/
