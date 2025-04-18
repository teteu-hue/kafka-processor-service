FROM node:22.15

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copia o resto da aplicação
COPY . .

# Expondo a porta da aplicação (ajuste conforme necessário)
EXPOSE 3000

CMD ["npm", 'run', 'dev']