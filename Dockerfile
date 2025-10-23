FROM node:20-alpine AS install

WORKDIR /app/install

COPY package*.json ./

RUN npm ci --omit=dev --no-audit --no-fund && \
    npm cache clean --force

FROM node:20-alpine AS build

WORKDIR /app/build

COPY --from=install /app/install/node_modules ./node_modules
COPY . .

RUN npm install @nestjs/cli && \ 
    npm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --from=build /app/build/dist ./dist
COPY --from=install /app/install/node_modules ./node_modules

CMD ["node", "dist/main.js"]