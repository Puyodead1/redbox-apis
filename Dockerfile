FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /usr/src/app
COPY package*.json pnpm-*.yaml ./
COPY packages ./packages

RUN pnpm install --frozen-lockfile
COPY . .

RUN pnpm build

EXPOSE 3012 3013 3014 3015 3016 3017 3018 3019 8883
CMD ["sh", "-c", "pnpm migrate:prod && pnpm start"]