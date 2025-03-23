# ChatBot
Api de ChatBot: Autoatendimento para restaurante

## Tecnologias utilizadas
- Node.js >= v20.16.0
- Express.js
- React
- TypeScript
- Node.js

## Endpoints Back-End
- `GET - http://localhost:3005/v1/chat`: Apenas para testes: Retorna um json no seu navegador para mostrar a resposta que o frontend irá receber
- `POST - http://localhost:3005/v1/chat`: Retorna o body do json, incluindo uma mensagem de resposta do chatbot e o track record do que foi feito anteriormente

## Endpoints Front-End
- `GET - http://localhost:3000`: Rota única para o react

## Como utilizar
Clone o repositório no seu computador, instale as dependências e rode o
backend e o frontend ao mesmo tempo com o comando "`npm run start`"

```bash
git clone https://github.com/Everton-Lourens/bot.git
cd bot
npm install
npm run start
```
