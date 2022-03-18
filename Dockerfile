FROM node:lts as base

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn global add pm2

FROM base AS builder

ENV NODE_ENV=development

RUN yarn install

COPY . .

RUN yarn build

FROM base as final

ENV NODE_ENV=production

COPY --from=builder app/build/ app/ecosystem.config.js app/LICENSE app/README.md ./

CMD ["pm2-runtime", "ecosystem.config.js"]

