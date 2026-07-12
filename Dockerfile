# Frontend build
FROM node:20-alpine AS frontend-build

ENV NODE_ENV=development

WORKDIR /app

COPY app/package*.json ./app/
WORKDIR /app/app
RUN npm ci --include=dev --prefer-offline --no-audit --legacy-peer-deps

WORKDIR /app
COPY app ./app
COPY content/pages ./content/pages
COPY content/updates ./content/updates

WORKDIR /app/app
RUN npm run build && npm cache clean --force

# Runtime
FROM nginx:1.27-alpine AS runtime

RUN apk upgrade --no-cache && rm -rf /var/cache/apk/*

RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

COPY ops/nginx.static.conf /etc/nginx/nginx.conf
COPY --from=frontend-build /app/app/dist /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx /var/run/nginx /var/log/nginx && \
    chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/run/nginx /var/log/nginx

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
