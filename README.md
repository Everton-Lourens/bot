﻿ChatBot API: Autoatendimento para restaurante

# ChatBot API
- Back-End (pricipal)
- Front-End (improviso)

## Tecnologias Utilizadas
- **Node.js**
- **Balanceador de carga: ngnix**
- **Docker**
- **Express.js**
- **React**
- **TypeScript**

### O que está acontecendo?

- **Explicação**: Estamos utilizando o `Docker` para criar imagens do **Back-End (porta 8080)** e do **Front-End (porta 3000:3000)**. O *Front-End* se comunica com o *Back-End* **via API**, e as requisições passam pelo **Nginx**, que atua como um **balanceador de carga (porta 9999:9999)**. O *Nginx* distribui essas requisições entre **duas instâncias do Back-End**, garantindo melhor desempenho e disponibilidade.

- Além disso, o *Back-End* está configurado para utilizar um **cluster de 5 workers (`CLUSTER_WORKERS=5`)**, o que permite processar múltiplas requisições simultaneamente. Também foi definido um **timeout** para evitar que requisições demoradas comprometam o desempenho do sistema.


### Como utilizar localmente

- **Descrição**: Clone o repositório e use o comando "`npm run setup`" para instalar as dependências corretamente (no Fron-End e no Back-End).
- Utilize "`npm run start`" para iniciar o Front-End e o Back-End ao mesmo tempo com a lib de desenvolvimento "`concurrently`".

```bash
git clone https://github.com/Everton-Lourens/bot.git
cd bot
npm run setup
npm run start
```

### Como utilizar no Docker

- **Descrição**: Clone o repositório e utilize o `Docker Compose` para construir e iniciar os containers do Front-End, Back-End e do Nginx. Isso garantirá que todos os serviços rodem corretamente dentro de containers isolados.

```bash
git clone https://github.com/Everton-Lourens/bot.git
cd bot
docker-compose up --build -d
```

### Endpoint Front-End

#### `GET - http://localhost:3000`

- **Descrição**: Depois de instalar as dependências, é só entrar e conversar com o ChatBot.

### Endpoint Back-End

#### Docker (nginx): `POST - http://localhost:9999/v1/chat`

#### Localmente: `POST - http://localhost:8080/v1/chat`

- **Descrição**: Este endpoint envia uma resposta do ChatBot em formato JSON. Para garantir que a conversa siga corretamente, você precisa reenviar o objeto `{ client }` a cada requisição.

##### Fluxo de uso:

1. **Primeira Requisição**:
   Envie no corpo da requisição o objeto inicial com as informações do cliente, como no exemplo abaixo:

##### Obsevação: Como este é apenas um teste, você deve utilizar o seguinte JSON no corpo da requisição POST para garantir o funcionamento correto:

   ```json
   {
     "client": {
       "id": "999",
       "stage": 0,
       "message": "Olá"
     }
   }
  ```