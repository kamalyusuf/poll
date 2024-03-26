FROM node:alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
# RUN yarn global add turbo
RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store
COPY . .
RUN turbo prune --scope=api --docker

FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
# COPY --from=builder /app/out/yarn.lock ./yarn.lock
# RUN yarn install
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# RUN yarn turbo run build --filter=api

FROM node:alpine AS runner

WORKDIR /app

COPY --from=installer /app .

CMD node apps/api/dist/index.js