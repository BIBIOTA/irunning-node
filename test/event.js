/* https://www.npmjs.com/package/chai */
import chai from 'chai';
import fs from 'fs';
import { events } from '../lib/events.js';

var assert = chai.assert;

describe('#event', () => {
  it('should return the event data of array', () => {

    /* 爬蟲 */
    return events().then(() => {

      /* 取得爬蟲過後儲存的json */
      const path = process.cwd() + '/result.json';

      assert.exists(fs.existsSync(path), 'result.json is not found');

      const json = JSON.parse(fs.readFileSync(path, 'utf-8'))

      /* 確認json parse後是否為陣列 */
      assert(Array.isArray(json), 'json.parse data are not arrays');

      json.forEach((item) => {

        /* 賽事連結 */
        describe('#link', () => {
          it('should return link or null', () => {
            assert(isUrlOrNull(item.link), 'link are not link or null');
          })
        })

        /* 賽事狀態(取消或延期:0;正常:1))  */
        describe('#event_status', () => {
          it('should return 0 or 1', () => {
            assert(item.event_status === 0 || item.event_status === 1, 'event_status are not 0 or 1');
          })
        })

        /* 賽事名稱  */
        describe('#event_name', () => {
          it('should return string', () => {
            assert.isString(item.event_name, 'event_name are not string');
          })
        })

        /* 賽事認證(1:IAAF,2:AIMS,3:本賽道經AIMS/IAAF丈量員丈量)  */
        describe('#event_certificate', () => {
          it('should return 1 or 2 or 3 or null', () => {
            assert(checkEventCertificateIsCorrect(item.event_certificate), 'event_certificate are not 1 or 2 or 3');
          })
        })

        /* 賽事日期  */
        describe('#event_date', () => {
          it('should return date', () => {
            assert(isDate(item.event_date), 'event_date are not date');
          })
        })

        /* 賽事時間  */
        describe('#event_time', () => {
          it('should return time or null', () => {
            assert(isTimeOrNull(item.event_time), 'event_time are not date');
          })
        })

        /* 地點  */
        describe('#location', () => {
          it('should return string', () => {
            assert.isString(item.location, 'location are not string');
          })
        })

        /* 距離  */
        describe('#distances', () => {
          it('should return array', () => {
            assert(Array.isArray(item.distances), 'distances are not arrays');

            if (item.distances.length > 0) {
              item.distances.forEach((distance) => {
                
                /* 賽事距離 */
                describe('#event_distance', () => {
                  it('should return string', () => {
                    assert.isString(distance.event_distance, 'event_distance are not string');
                  })
                })

                /* 賽事價格 */
                describe('#event_price', () => {
                  it('should return Int or null', () => {
                    if (distance.event_price) {
                      assert.isNumber(distance.event_price, 'event_distance are not number');
                    }
                  })
                })

                /* 限額 */
                describe('#event_limit', () => {
                  it('should return Int or null', () => {
                    if (distance.event_limit) {
                      assert.isNumber(distance.event_limit, 'event_limit are not number');
                    }
                  })
                })

              });
            }
          })
        })

        /* 賽事單位  */
        describe('#agent', () => {
          it('should return string', () => {
            assert.isString(item.agent, 'agent are not string');
          })
        })

        /* 報名截止狀態  */
        describe('#participate', () => {
          it('should return string', () => {
            if (item.participate) {
              assert.isString(item.participate, 'participate are not string');
            }
          })
        })

      });
    })
  })
})

function iThrowError(msg) {
  throw new Error(msg);
}

function isUrlOrNull(link) {
  const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gm);
  if (link === null) {
    return true;
  }
  return regex.test(link);
}

function checkEventCertificateIsCorrect(value) {
  switch (value) {
    case 1:
      return true;
    case 2:
      return true;
    case 3:
      return true;
    case null:
      return true;
    default:
      return false;
  }
}

function isDate(date) {
  const regex = new RegExp(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/gm);
  return regex.test(date);
}

function isTimeOrNull(time) {
  const regex = new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/gm);
  if (time === null) {
    return true;
  }
  return regex.test(time);
}