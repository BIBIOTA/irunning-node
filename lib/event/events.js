import axios from 'axios';
import cheerio from 'cheerio';
import moment from 'moment';
import { getMonthIndex } from '../date.js';
import { isset } from '../isset.js';
import transform from './transformer.js';

export const getEventsDataFromOrg = axios.get('http://www.taipeimarathon.org.tw/contest.aspx').then((res) => {
  return res.data;
}).catch((err) => {
  console.log(err);
  return;
});

export const processEventsBody = ((body) => {
  const result = []; // 建立一個儲存結果的容器
  const $ = cheerio.load(body); // 載入 body
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
    const statusElement = table_td.eq(1).css('text-decoration');
    let title, link;
    if (table_td.eq(1).find('a').text()) {
      title = table_td.eq(1).find('a').text().trim();
      link = table_td.eq(1).find('a').attr('href');
    } else {
      title = table_td.eq(1).text().trim();
      link = null;
    }

    /* 賽事名稱和狀態,賽事認證(1:IAAF,2:AIMS,3:本賽道經AIMS/IAAF丈量員丈量))  */
    let certificate = table_td.eq(2).find('img').attr('src');

    /* 舉辦日期和時間  */
    const datetime = table_td.eq(3).text();

    /* 賽事地點  */
    const location = isset(table_td.eq(4).text());

    /* 里程  */
    const distancesElement = table_td.eq(5).find('button');

    /* 承辦單位 */
    const agent = table_td.eq(6).text();

    /* 報名截止狀態 */
    const entry = isset(table_td.eq(7).text().trim().replace(/\s/g, ""));

    /* 資料整理 */
    const event = transform({
      year,
      title,
      link,
      statusElement,
      certificate,
      datetime,
      location,
      distancesElement,
      agent,
      entry,
    });

    // 建立物件並(push)存入結果
    result.push(event);
  }
  return result;
});