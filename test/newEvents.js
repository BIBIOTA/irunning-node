/* https://www.npmjs.com/package/chai */
import chai from 'chai';
import { sendNewEvent } from '../lib/bot/bot.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

var expect = chai.expect;

describe('#newEvents', () => {
  it('should return true', () => {

    /* success */

    const request = {
      "events": [
          {
              "id": "627bd5d9eddfb",
              "link": "https://bao-ming.com/eb/content/5145#24941",
              "event_status": 1,
              "event_name": "2022 年花蓮太平洋全國鐵人三項錦標賽",
              "event_info": null,
              "event_certificate": null,
              "event_date": "2022-05-14",
              "event_time": "08:00:00",
              "location": "花蓮縣壽豐鄉鯉魚潭風景區",
              "agent": "花蓮縣體育會/中華民國鐵人三項運動協會",
              "participate": "已截止",
              "created_at": "2022-05-11T15:27:21.000000Z",
              "updated_at": "2022-05-11T15:33:31.000000Z"
          },
          {
              "id": "627bd1a315a73",
              "link": "https://www.beclass.com/rid=25465b861a33de9538df",
              "event_status": 1,
              "event_name": "四躍林道挑戰賽",
              "event_info": null,
              "event_certificate": null,
              "event_date": "2022-05-14",
              "event_time": "04:00:00",
              "location": "南投縣國姓鄉泰雅渡假村",
              "agent": "臺灣龍虎鳳越野協會",
              "participate": "已截止",
              "created_at": "2022-05-11T15:09:23.000000Z",
              "updated_at": "2022-05-11T15:33:31.000000Z"
          },
          {
              "id": "627bd5da025e5",
              "link": "https://www.eventpal.com.tw/FOAS/actions/ActivityIndex.action?showTabContent&seqno=8c815167-8a7b-4d54-92ab-253e891b4522",
              "event_status": 1,
              "event_name": "2022 阿里山雲端路跑",
              "event_info": null,
              "event_certificate": null,
              "event_date": "2022-05-15",
              "event_time": "05:30:00",
              "location": "嘉義縣阿里山國家森林遊樂區外停車廣場",
              "agent": "明訊資訊/聯網國際股份有限公司",
              "participate": "已截止",
              "created_at": "2022-05-11T15:27:22.000000Z",
              "updated_at": "2022-05-11T15:33:31.000000Z"
          },
          {
              "id": "627bd5d9f114f",
              "link": "http://www.taipeifreewaymarathon.com/",
              "event_status": 1,
              "event_name": "2022 臉部平權運動-臺北國道馬拉松",
              "event_info": "由3／13延期",
              "event_certificate": null,
              "event_date": "2022-05-15",
              "event_time": "05:30:00",
              "location": "臺北市大同區淡水河六號-敦煌水門",
              "agent": "中華民國路跑協會",
              "participate": "已截止",
              "created_at": "2022-05-11T15:27:21.000000Z",
              "updated_at": "2022-05-11T15:33:31.000000Z"
          },
          {
              "id": "627bd5da0c89c",
              "link": "https://lohasnet.tw/Watermelon2021/",
              "event_status": 1,
              "event_name": "2021 二崙西瓜半程馬拉松-就是要抱西瓜衝回終點！",
              "event_info": null,
              "event_certificate": null,
              "event_date": "2022-05-15",
              "event_time": "06:00:00",
              "location": "雲林縣二崙鄉運動公園  ",
              "agent": "臺灣路跑賽會服務協會 ",
              "participate": "已截止",
              "created_at": "2022-05-11T15:27:22.000000Z",
              "updated_at": "2022-05-11T15:33:32.000000Z"
          }
      ],
      "userIds": [process.env.TELEGRAM_TEST_USERID],
    }

    const result = sendNewEvent(request);

    expect(result).to.equal(true);

  })
})
