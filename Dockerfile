# ---------- Build stage ----------
FROM node:24-alpine AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.1.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build


# ---------- Runtime stage ----------
FROM node:24-alpine

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.1.0 --activate

ENV NODE_ENV=production
ENV PORT=5173

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
# Fly release_command runs `pnpm db:push && pnpm db:seed` — needs Drizzle + TS sources + Kit tsconfig paths
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/svelte.config.js ./
COPY --from=builder /app/vite.config.ts ./
COPY --from=builder /app/.svelte-kit ./.svelte-kit
COPY --from=builder /app/src ./src

EXPOSE 5173

CMD ["node", "build"]