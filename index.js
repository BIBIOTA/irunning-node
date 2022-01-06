import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
app.use(express.static(process.cwd()));
import cors from 'cors';
import * as http from 'http';
import redis from 'redis';
const client = redis.createClient({
  port      : 6379,
  host      : process.env.REDIS_HOST
});
const server = http.createServer(app);

// connect redis server
client.on("error", function(error) {
  console.error(error);
});

/* libs */
import { events } from './lib/events.js';
import { district } from './lib/district.js';

const corsOptions = {
  origin: [
    'http://localhost',
    'http://localhost:8070',
    'http://localhost:80',
    'https://irunning-api.bibiota.com',
    'https://irunning.bibiota.com',
  ],
};

/* 取得經緯度位置對應的鄉鎮區api */
app.get('/api/district', cors(corsOptions),(request, response) => {
    try {

      if (request.query.lng && request.query.lat) {

        const geo = district(request.query.lng, request.query.lat);

        if (geo) {
          response.json({
            status: true,
            message: '資料取得成功',
            data: geo,
          });
        } else {
          response.status(404).send({
            status: false,
            message: '無法取得鄉鎮區資料',
            data: null,
          });
        }

      } else {
        response.status(404).send({
          status: false,
          message: '缺少經緯度參數',
          data: null,
        });
      }

    } catch (err) {
      console.log(err);
      response.status(500).send({
        status: false,
        message: '無法取得資料',
        data: null,
      });
    }
});

/* 取得賽事資訊api */
app.get('/api/events', cors(corsOptions),async(request, response) => {
  try {

    client.get("events", async (err, redisData) => {
      // err handle
      if (err) {
        console.log(err)
      }
      // check redis has value
      if (redisData) {
        response.json({
          status: true,
          message: '資料取得成功',
          data: JSON.parse(redisData),
        });
      } else {
        const data = await events;

        if(data) {
          if (data.length > 0) {
            client.set("events", JSON.stringify(data), redis.print);
            client.expire("events", 12*60*60);
            response.json({
              status: true,
              message: '資料取得成功',
              data,
            });
          } else {
            response.status(404).send({
              status: false,
              message: '無法取得更新資料',
              data: null,
            });
          }
        } else {
          response.status(404).send({
            status: false,
            message: '查無資料',
            data: null,
          });
        }
      }
    });

  } catch (err) {
    console.log(err);
    response.status(500).send({
      status: false,
      message: '無法取得資料',
      data: null,
    });
  }
});

app.get('', (request, response) => {
  response.json({
    message: 'Hello world',
  });
});

server.listen(process.env.PORT, () => console.log('start!'));