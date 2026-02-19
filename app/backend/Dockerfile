FROM node:22-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS production
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules

COPY . .

RUN npm prune --omit=dev

EXPOSE 8500

CMD ["node", "index.js"]
