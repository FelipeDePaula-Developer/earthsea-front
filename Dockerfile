# Usa Node.js para construir a aplicação
FROM node:18 AS build
WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código e gera o build
COPY . .
RUN npm run build

# Usa um ambiente mais leve para rodar o Next.js
FROM node:18-alpine
WORKDIR /app

# Copia os arquivos de build do Next.js
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./

# Instala apenas as dependências de produção
RUN npm install --production

EXPOSE 3000
CMD ["npm", "run", "start"]
