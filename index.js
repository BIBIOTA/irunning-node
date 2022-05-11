import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
app.use(express.static(process.cwd()));
import cors from 'cors';
import * as http from 'http';
const server = http.createServer(app);

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

    const data = await events;

    if(data && data.length > 0) {
      response.json({
        status: true,
        message: '資料取得成功',
        data,
      });
    } else {
      response.status(404).send({
        status: false,
        message: '查無資料',
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

app.get('', (request, response) => {
  response.json({
    message: 'Hello world',
  });
});

server.listen(process.env.PORT, () => console.log('start!'));