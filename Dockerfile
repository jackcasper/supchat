# Dockerfile
FROM oven/bun:1.1

WORKDIR /app

COPY . .

RUN bun install

RUN bun run install

EXPOSE 3000

CMD ["bun", "start"]