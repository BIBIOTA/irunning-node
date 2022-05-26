//TODO: Seperate message and template
import { escapedMsg, escapedUrl } from './escapedMsg.js';

const titile = '早安 有新的路跑賽事公佈囉 ！ \n';
const updatedEventTitile = '嗨 關注的路跑賽事有更新囉 ！ \n';
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

const updatedContent = (event, index) => {
  const nameAndUrl = escapedUrl(`${index + 1}. [${event.event_name}]${linkOrNull(event.link)}\n`);
  const date = escapedMsg(`比賽日期: ${event.event_date}`);
  const location = escapedMsg(`\n比賽地點: ${event.location}`);
  const distances = event.distance?.length > 0 ? `\n比賽項目: ${eventDistancesToStr(event.distance)}` : '';
  const participate = escapedMsg(`\n報名日期: ${event.participate}`);
  return nameAndUrl + date + location + distances + participate + '\n\n';
}

const linkOrNull = (link) => {
  if (link) {
    return `(${link})`;
  }

  return '';
}

export const serverErrorMessage = '伺服器發生錯誤';
export const notFoundMessage = '查無資料';

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

export const followDefaultMessage = `
請輸入想要查詢的賽事關鍵字
例如: 田中馬拉松。
或是搜尋: 臺北 取得該地區的所有賽事
如果想知道現在有哪些賽事，可以到 ${homepage} 查看哦 ！
`

export const followSuccessMessage = `
成功關注賽事，如果有此賽事的新消息將會提醒哦！
如果想取消已關注的賽事，請輸入 /unfollow
`

export const unfollowSuccessMessage = '已取消關注';

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

export const createUpdatedEventsTemplate = (events) => {
  
  let contents = '';

  events.forEach((event, index) => {
    contents += updatedContent(event, index);
  });

  const message = updatedEventTitile + contents;

  return message;
}
