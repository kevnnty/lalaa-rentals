FROM node:18

WORKDIR /app

COPY package*.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install

COPY . .

RUN npx prisma generate

EXPOSE 8080

CMD ["pnpm", "start"]
