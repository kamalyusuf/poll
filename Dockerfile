FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN corepack enable
COPY . .
RUN yarn dlx turbo prune --scope=api --docker

FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
RUN corepack enable
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN yarn api:build

FROM node:alpine AS runner

WORKDIR /app

COPY --from=installer /app .

CMD ["node", "apps/api/dist/index.js"]