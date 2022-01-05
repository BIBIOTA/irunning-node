FROM node:14-alpine as publish
WORKDIR /app
RUN apk update \
    && npm install -g npm
RUN echo "PORT=80" >> /app/.env
RUN echo "APP_NAME=irunning-node" >> /app/.env
RUN echo "REDIS_HOST='redis'" >> /app/.env

COPY package.json ./
COPY . .

WORKDIR /app
RUN npm install
RUN chown -R node:node /app
EXPOSE 80
CMD [ "node", "index.js" ]

