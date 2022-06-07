<h1>Irunning</h1>

![node.js](https://img.shields.io/badge/node.js-lts-blue)

#### About this side-project:

- 路跑天氣: 即時取得台灣各地及目前所在地(GPS Location)的即時天氣資訊及空氣品質
- 跑步紀錄: 與運動社群應用程式[Strava](https://www.strava.com/?hl=zh-TW)串接、第三方登入，取得個人的跑步紀錄
- 台灣路跑賽事: 每日更新近期的台灣路跑賽事資訊
    
  - 目前透過爬蟲技術取得[跑者廣場-全國賽會](http://www.taipeimarathon.org.tw/contest.aspx)的資料
  - 提供賽事搜尋功能
  - 可以將即將參加的路跑賽事加入Google Calender
  - Telegram bot訂閱服務，每日自動取得最新的路跑賽事資訊

#### Tech:

- Frontend: Vue.js + Vuetify UI

- Backend: Laravel 9 (PHP 8.1 + Swoole + Octane) + Node.js(爬蟲、Telegram bot)

- Database: MYSQL

- API: RESTful & GraphQL

- Environment: GCP (Google Compute Engine & Google Kubernetes Engine)

- 3rd party:
  - Strava API V3 (運動社群第三方登入及資料取得)
  - Google API (MAP & Calendar API)
  - 政府開放平台API
  - 中央氣象局API
### License

[MIT licensed](LICENSE).

