# ── Build stage ────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

ARG REACT_APP_API_URL=http://localhost:3001

COPY package.json package-lock.json* ./
RUN npm ci

COPY public ./public
COPY src ./src

ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ── Serve stage ─────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
