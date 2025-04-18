# Kafka Processor Service

Microserviço Node.js + TypeScript para processamento de pedidos via Kafka, persistência no MongoDB e exposição de API REST para consulta de pedidos.

## 🚀 Tecnologias Utilizadas
- Node.js (recomendado: versão 18 ou superior)
- TypeScript
- Express
- KafkaJS
- Mongoose
- Winston (logs)
- Docker & Docker Compose

## 📦 Instalação e Execução

### 1. Pré-requisitos
- Docker e Docker Compose instalados
- Node.js **18 ou superior** (obrigatório para rodar testes automatizados)

### 2. Clone o repositório
```bash
git clone <url-do-repo>
cd kafka-processor-service
```

### 3. Configure o arquivo `.env`
Crie um arquivo `.env` na raiz do projeto com as variáveis:
```
KAFKA_BROKER=kafka:9092
MONGO_URI=mongodb://mongodb:27017/pedidosdb
```

### 4. Suba os serviços com Docker Compose
```bash
docker-compose up --build
```
Isso irá subir:
- Kafka + Zookeeper
- MongoDB
- (Opcional) Mongo Express
- O microserviço Node.js

### 5. Rodando localmente (sem Docker)
1. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```
2. Compile o projeto:
   ```bash
   npm run build
   # ou
   yarn build
   ```
3. Inicie o serviço:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## 🧪 Testes Automatizados

- Certifique-se de estar usando Node.js 18 ou superior para evitar erros de execução do Jest.
- Para rodar todos os testes automatizados:
  ```bash
  npm test
  ```
- Para rodar um teste específico:
  ```bash
  npx jest src/__tests__/OrderService.test.ts
  ```
- Os testes estão localizados em `src/__tests__` e utilizam Jest + ts-jest.

## 🛣️ Endpoints da API REST

- `GET /order/quantity/:clienteId` — Quantidade de pedidos por cliente
- `GET /order/list/:clienteId` — Lista de pedidos de um cliente
- `GET /order/total/:codigoPedido` — Valor total de um pedido

### Exemplos de resposta
```json
// GET /order/quantity/1
{ "clienteId": 1, "quantidadePedidos": 3 }

// GET /order/list/1
[
  {
    "codigoPedido": 1001,
    "valorTotal": 120,
    "itens": [...]
  }
]

// GET /order/total/1001
{ "codigoPedido": 1001, "valorTotal": 120 }
```

## 🧪 Testes
- Testes manuais podem ser feitos via Postman/cURL nos endpoints acima.
- (Opcional) Para rodar testes automatizados, implemente com Jest.

## 📂 Estrutura do Projeto
```
src/
  ├── controller/         # Controllers das rotas
  ├── cron/               # Jobs agendados (ex: producer)
  ├── database/           # Conexão com MongoDB
  ├── encryption/         # Utilitários de criptografia
  ├── Interface/          # Interfaces TypeScript
  ├── logger/             # Configuração de logs
  ├── model/              # Schemas e models do Mongoose
  ├── repository/         # Repositórios de acesso a dados
  ├── router/             # Definição de rotas
  ├── services/           # Serviços de negócio e Kafka
  ├── index.ts            # Ponto de entrada
```

## 📝 Observações
- O serviço consome mensagens do tópico Kafka `pedidos` e armazena no MongoDB.
- Os endpoints REST permitem consultar os pedidos processados.
- Logs são gravados via Winston, inclusive no MongoDB.

---

Contribuições e sugestões são bem-vindas!