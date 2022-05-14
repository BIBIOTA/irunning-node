import { escapedMsg, escapedUrl } from './escapedMsg.js';

const titile = '早安 有新的路跑賽事公佈囉 ！ \n';
const homepage = escapedUrl('[irunning](https://irunning.bibiota.com/)');
const foot = `更多賽事資訊，可以到 ${homepage} 查看哦 ！`

const eventDistancesToStr = (distances) => {
  let str = '';
  distances.forEach((distance, index) => {
    const quote = '、';
    str += `${index !== 0 ? quote : ''}${distance.event_distance}`;
  });
  return escapedMsg(`(${str})`);
}

const content = (event, index) => {
  const nameAndUrl = escapedUrl(`${index + 1}. [${event.event_name}]${linkOrNull(event.link)}\n`);
  const date = escapedMsg(`比賽日期: ${event.event_date}`);
  const location = escapedMsg(`\n比賽地點: ${event.location}`);
  const distances = event.distances?.length > 0 ? `\n比賽項目: ${eventDistancesToStr(event.distances)}` : '';
  return nameAndUrl + date + location + distances + '\n\n';
}

const linkOrNull = (link) => {
  if (link) {
    return `(${link})`;
  }

  return '';
}

export const serverErrorMessage = '伺服器發生錯誤';

export const startMessage = `
嗨 我是Irunning 愛跑步機器人。
每日更新台灣最新的路跑賽事資訊！
如果想要追蹤最新賽事資訊，請輸入 /subscribe ！
`;

export const subscribeMessage = `
追蹤成功👍 每日上午九點就會發送最新賽事資訊哦 ！
如果要取消訂閱，請輸入 /unsubscribe
`

export const unsubscribeMessage = `已取消訂閱`;

export const createNewEventsTemplate = (events) => {
  
  let contents = '';

  console.log(events);

  events.forEach((event, index) => {
    contents += content(event, index);
  });

  const message = titile + contents + foot;

  console.log(message);

  return message;
}
