import dotenv from 'dotenv';
dotenv.config();

import request from 'request';
import cheerio from 'cheerio';
import fs from 'fs';
import express from 'express';
import moment from 'moment';
const app = express();
import * as http from 'http';
const server = http.createServer(app);

/* 月份中文陣列 */
const monthArr = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ]

function getMonthIndex (month) {
  let index;
  monthArr.forEach((MM, i) => {
    if (MM === month) {
      index = i;
    }
  });
  return index;
};

function getDate(year, date) {
  const dateFormat = moment(`${year}/${date}`).format('YYYY-MM-DD');
  return dateFormat;
}

function isset(data) {
  return data?data:null;
}

const events = function () {
  request({
    url: "http://www.taipeimarathon.org.tw/contest.aspx", // 跑者廣場網頁
    method: "GET"
  }, function (error, response, body) {
    if (error || !body) {
      return;
    }
    const $ = cheerio.load(body); // 載入 body
    const result = []; // 建立一個儲存結果的容器
    const table_tr = $("table.gridview tr"); // 爬全國賽會的table
    let lastRecordMonthIndex;
    let year = moment().format('YYYY');
    for (let i = 1; i < table_tr.length; i++) { // 走訪 tr
        const table_td = table_tr.eq(i).find('td'); // 擷取每個欄位(td)
        /* 抬頭欄位(包含月份、新活動、更新活動資訊)  */
        const month = isset(table_td.eq(0).find('span').text());
        if (month) {
          const monthIndex = getMonthIndex(month);
          if (lastRecordMonthIndex > monthIndex) {
            year = moment(year).add(1, 'years').format('YYYY');
          }
          lastRecordMonthIndex = monthIndex;
        }

        /* 賽事名稱、連結和狀態(取消或延期:0;正常:1))  */
        const textDecoration = table_td.eq(1).css('text-decoration');
        let eventStatus;
        if (textDecoration === 'line-through') {
          eventStatus = 0
        } else {
          eventStatus = 1;
        }
        let eventName;
        let link;
        if (table_td.eq(1).find('a').text()) {
          eventName = table_td.eq(1).find('a').text().trim();
          link = table_td.eq(1).find('a').attr('href');
        } else {
          eventName = table_td.eq(1).text().trim();
          link = null;
        }
        console.log(link);
        console.log(eventStatus);
        console.log(eventName);

        /* 賽事名稱和狀態,賽事認證(1:IAAF,2:AIMS,3:本賽道經AIMS/IAAF丈量員丈量))  */
        let eventCertificate;
        switch (table_td.eq(2).find('img').attr('src')) {
          case ('/images/iaaf.gif'):
            eventCertificate = 1;
            break;
          case ('/images/aims_logo.gif'):
            eventCertificate = 2;
            break;
          case ('/images/course_ok.png'):
            eventCertificate = 3;
              break;
          default:
            eventCertificate = null
        }
        console.log(eventCertificate);

        /* 舉辦日期和時間  */
        const eventTimeDate = table_td.eq(3).text();
        const eventArr = eventTimeDate.trim().split(' ');
        const eventDate = getDate(year, eventArr[0]);
        let eventTime;
        if (eventArr.length >= 3) {
          eventTime = eventArr[2];
        } else {
          eventTime = null;
        }
        console.log(eventDate);
        console.log(eventTime);

         /* 賽事地點  */
         const location = isset(table_td.eq(4).text());
         console.log(location);

        /* 里程  */
        const selections = table_td.eq(5).find('button');
        const distances = [];
        if (selections.length > 0) {
          for (let i = 0; i <= selections.length - 1; i++)  {
            console.log(i);
            const eventDistance = selections.eq(i).html();
            const distanceInfo = selections.eq(i).attr('title').split('：');
            const eventPrice = isset(distanceInfo[1].split('<br/>')[0]);
            const eventLimit = isset(distanceInfo[2]);
            distances.push({
              event_distance: eventDistance,
              event_price: eventPrice,
              event_limit: eventLimit,
            });
          }
        }

        console.log(distances);

        /* 承辦單位 */
        const agent = table_td.eq(6).text();
        console.log(agent);

        /* 報名日期 */
        const participate = isset(table_td.eq(7).text().trim());
        console.log(participate);

      // 建立物件並(push)存入結果
      result.push({
        link,
        event_status: eventStatus,
        event_name: eventName,
        event_certificate: eventCertificate,
        event_date: eventDate,
        event_time: eventTime,
        location,
        distances,
        agent,
        participate,
      });
    }
    // 在終端機(console)列出結果
    console.log(result);
    // 寫入 result.json 檔案
    fs.writeFileSync("result.json", JSON.stringify(result));
  });
};
events();

/* 取得賽事資訊api */
app.get('/', (request, response) => {
    try {

      const getEvent = Promise.resolve(events());

      getEvent.finally(() => {
        const path = './result.json';
        if(fs.existsSync(path)) {
  
          const json = JSON.parse(fs.readFileSync(path, 'utf-8'))
  
          if (json.length > 0) {
            response.json({
              status: true,
              message: '資料取得成功',
              ...json
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

server.listen(process.env.PORT, () => console.log('start!'));