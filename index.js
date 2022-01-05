import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import express from 'express';
import * as d3 from 'd3';
const app = express();
app.use(express.static(process.cwd()));
import cors from 'cors';
import * as http from 'http';
import redis from 'redis';
const client = redis.createClient();
const server = http.createServer(app);

// connect redis server
client.on("error", function(error) {
  console.error(error);
});

/* libs */
import { events } from './lib/events.js';

const corsOptions = {
  origin: [
    'http://localhost',
    'http://localhost:8070',
    'http://localhost:80',
    'https://irunning-api.bibiota.com',
    'https://irunning.bibiota.com',
  ],
};

/* 經緯度位置對應的鄉鎮區json */
const TwGeoJsonPath = process.cwd() + '/twGeoJson.json';
const TwGeoJson = JSON.parse(fs.readFileSync(TwGeoJsonPath, 'utf-8'))

/* 取得經緯度位置對應的鄉鎮區api */
app.get('/api/district', cors(corsOptions),(request, response) => {
    try {

      if (request.query.lng && request.query.lat) {
        console.log(request.query);
        const point = [request.query.lng, request.query.lat];

        const geoOut = TwGeoJson.features.filter((d) => {return d3.geoContains(d, point)});

        if (geoOut.length === 1) {
          const [geo] = geoOut;
          const { C_Name, T_Name } = geo.properties;
          response.json({
            status: true,
            message: '資料取得成功',
            data: {C_Name, T_Name},
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
            response.json({
              status: true,
              message: '資料取得成功',
              data,
            });
            client.set("events", JSON.stringify(data), redis.print);
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
    message: 'Hello Woard',
  });
});

server.listen(process.env.PORT, () => console.log('start!'));