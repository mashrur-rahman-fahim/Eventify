# Build the Vite frontend, then run the Express backend which serves
# frontend/dist statically (single origin, API base is relative "/").
# node:22-slim (glibc) so bcrypt uses prebuilt binaries — no compiling.
# puppeteer is an unused dependency; skip its Chromium download.
FROM node:22-slim AS build
WORKDIR /app
COPY frontend/package*.json frontend/
RUN npm install --prefix frontend
COPY frontend frontend
RUN npm run build --prefix frontend

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true
COPY backend/package*.json backend/
RUN npm install --prefix backend --omit=dev
COPY backend backend
COPY --from=build /app/frontend/dist frontend/dist
# CWD must be backend/ — app.js resolves frontend/dist relative to it
WORKDIR /app/backend
EXPOSE 3000
CMD ["node", "src/server.js"]
