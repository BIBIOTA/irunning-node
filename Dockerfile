FROM node:14-alpine as publish
WORKDIR /app
RUN apk update \
    && apk add --update python make g++ \
    && npm install -g npm \
    && npm install \
    && npm install -g pm2
RUN echo "PORT=8060" >> /app/.env
RUN echo "APP_NAME=irunning-node" >> /app/.env

RUN chown -R node:node /app
EXPOSE 8080
CMD [ "node", "index.js" ]

