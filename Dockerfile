FROM node:14-alpine as publish
WORKDIR /app
RUN npm install

RUN echo "PORT=8060" >> /app/.env
RUN echo "APP_NAME=irunning-node" >> /app/.env

COPY package.json ./
COPY . .

RUN chown -R node:node /app
EXPOSE 8080
CMD [ "node", "index.js" ]

