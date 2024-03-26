FROM node:alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN yarn global add turbo
RUN yarn global add pnpm
COPY . .
RUN turbo prune --scope=api --docker

FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# RUN yarn turbo run build --filter=api
RUN pnpm turbo run build --filter=api

FROM node:alpine AS runner

WORKDIR /app

COPY --from=installer /app .

ENV NODE_ENV production

CMD node apps/api/dist/index.js