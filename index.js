import dotenv from 'dotenv';
dotenv.config();


import SlackNotify from 'slack-notify';
const MY_SLACK_WEBHOOK_URL = process.env.MY_SLACK_WEBHOOK_URL;
const slack = SlackNotify(MY_SLACK_WEBHOOK_URL);

import express from 'express';
const app = express();
app.use(express.static(process.cwd()));
import cors from 'cors';
import * as http from 'http';
const server = http.createServer(app);

import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();

import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Taipei");

/* log */
import fs from 'fs';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(log) { //
  log_file.write(util.format(log) + '\n');
  log_stdout.write(util.format(log) + '\n');
  slack.send({
    channel: '#irunning',
    text: log,
    unfurl_links: 1,
    username: 'irunning-node-' + process.env.NODE,
  });
};

/* libs */
import { getEventsDataFromOrg, processEventsBody } from './lib/event/events.js';
import { district } from './lib/district.js';
import { sendNewEvent, sendUpdatedEvent } from './lib/bot/bot.js';

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
    
    const body = await getEventsDataFromOrg;

    if (!body) {
      response.status(404).send({
        status: false,
        message: '查無資料',
        data: null,
      });
    }

    const data = await processEventsBody(body);

    response.json({
      status: true,
      message: '資料取得成功',
      data,
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

app.post('/api/newEvents', jsonParser, (request, response) => {
  try {
    sendNewEvent(request.body);
    response.json({
      status: true,
      message: 'ok',
      data: request.body,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: false,
      message: 'Internel Server Error',
      data: null,
    });
  }
});

app.post('/api/updatedEvent', jsonParser, (request, response) => {
  try {
    sendUpdatedEvent(request.body.data);
    response.json({
      status: true,
      message: 'ok',
      data: request.body,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: false,
      message: 'Internel Server Error',
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