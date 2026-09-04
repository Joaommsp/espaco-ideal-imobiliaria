# Node 20: é o que Nest 10 e Prisma 5 deste projeto suportam.
FROM node:20-alpine

# openssl é exigido pelo engine do Prisma no Alpine.
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3002
CMD ["npm", "run", "start:dev"]
