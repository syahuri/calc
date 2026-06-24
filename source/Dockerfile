# ── Stage 1: Transpile JSX → plain JS (classic runtime) ──
FROM node:20-alpine AS builder
WORKDIR /build
COPY package.json package-lock.json babel.config.json ./
RUN npm ci --omit=dev=false 2>/dev/null || npm install
COPY app.jsx ./
RUN npx babel app.jsx --config-file ./babel.config.json -o app.transpiled.js

# ── Stage 2: Serve with nginx ──
FROM nginx:alpine
COPY --from=builder /build/app.transpiled.js /usr/share/nginx/html/app.transpiled.js
COPY index.html style.css /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod 644 /usr/share/nginx/html/*
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
