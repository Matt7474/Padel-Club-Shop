FROM node:18

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=5000

RUN npm install --include=dev

COPY . .

COPY .env.production /app/.env.production

RUN npm run build

CMD ["node", "dist/index.js"]