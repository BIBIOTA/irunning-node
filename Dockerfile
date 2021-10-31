FROM node:14-alpine as publish
RUN apk update \
    && apk add --update python make g++ \
    && npm install -g npm \
    && npm install -g pm2 \
    && apk add yarn \
WORKDIR /app
RUN echo "PORT=8060" >> /app/.env
RUN echo "APP_NAME=irunning-node" >> /app/.env

COPY package.json yarn.lock ./
RUN npm install && npm cache clean
COPY . .
CMD [ "node" ]

FROM node:14-alpine
WORKDIR /app
RUN apk update \
    && apk add yarn

RUN chown -R node:node /app
USER node
CMD [ "node", "index.js" ]
