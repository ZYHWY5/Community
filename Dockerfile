# 构建阶段
FROM node:22.14.0-alpine AS builder
ARG BUILD_ENV=development
WORKDIR /app
COPY . .

# 安装依赖
RUN rm -rf node_modules pnpm-lock.yaml package-lock.json
ENV NODE_OPTIONS=--max_old_space_size=8012
RUN npm install -g pnpm
RUN pnpm install

RUN set -e; if [ "$BUILD_ENV" = "production" ]; then \
        pnpm run build:online; \
    else \
        pnpm run build:test; \
    fi

# 生产阶段
FROM node:22.14.0-alpine

ENV NODE_OPTIONS=--max_old_space_size=8012

RUN mkdir -p /data/imagentbot

WORKDIR /data/imagentbot
COPY --from=builder /app/.output/ /data/imagentbot/
EXPOSE 3000
CMD [ "node", "/data/imagentbot/server/index.mjs" ]
