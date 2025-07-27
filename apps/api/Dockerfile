FROM oven/bun:1 as builder

WORKDIR /app

COPY package.json bun.lockb turbo.json ./

COPY packages/shared-types ./packages/shared-types
RUN cd packages/shared-types && bun install && bun run build

COPY apps/api ./apps/api

RUN cd apps/api && bun install && bun run build

FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app/package.json /app/bun.lockb ./
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/package.json
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api

RUN bun install --production

EXPOSE 3000

CMD ["bun", "dist/index.js"] 