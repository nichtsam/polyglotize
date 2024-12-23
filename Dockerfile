FROM node:20-slim AS base

RUN apt-get update
RUN apt-get -y install ca-certificates
RUN corepack use pnpm@9
RUN corepack enable pnpm

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM deps AS prod-deps

RUN pnpm prune --prod

FROM deps AS build

COPY . .

RUN pnpm build

FROM base

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

WORKDIR /app

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/server.js /app/server.js
COPY --from=build /app/server-utils.js /app/server-utils.js

CMD [ "pnpm","start" ]
