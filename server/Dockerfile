FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# Remove devDependencies after build
RUN npm prune --omit=dev

EXPOSE 4000

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
