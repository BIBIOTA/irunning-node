FROM node:14-alpine as publish
WORKDIR /app

RUN apk update \
    && apk add bash \
    && apk add --update python make g++ \
    && npm install -g npm \
    && npm install -g @vue/cli \
    && npm install -g nodemon
RUN echo "PORT=8060" >> /app/.env
RUN echo "APP_NAME=irunning-node" >> /app/.env

COPY package.json ./
COPY . .
CMD [ "node" ]

FROM node:14-alpine
WORKDIR /app
RUN apk update
RUN npm install
RUN chown -R node:node /app
EXPOSE 8060
CMD [ "node", "index.js" ]