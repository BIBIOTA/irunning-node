FROM node:14-alpine as publish
WORKDIR /app
RUN apk update \
    && npm install -g npm \
    && npm install -g pm2

COPY package.json ./
COPY . .

WORKDIR /app
RUN npm install
RUN chown -R node:node /app
EXPOSE 80

COPY ./app-entrypoint.sh /
RUN chmod -R 0755 /app-entrypoint.sh
ENTRYPOINT /app-entrypoint.sh
