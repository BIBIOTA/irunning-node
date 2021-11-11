FROM node:14-alpine as publish
WORKDIR /app
RUN apk update \
    && apk add npm python g++ make \
    && npm install -g npm \
    && npm install -g pm2
RUN npm install

RUN echo "PORT=8060" >> /app/.env
RUN echo "APP_NAME=irunning-node" >> /app/.env

COPY package.json ./
COPY . .

RUN chown -R node:node /app
EXPOSE 8080
CMD [ "node", "index.js" ]

