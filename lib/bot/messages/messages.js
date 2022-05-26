import { escapedUrl } from './escapedMsg.js';

const homepage = escapedUrl('[irunning](https://irunning.bibiota.com/)');

export const texts = {
  title: {
    newEvent: '早安 有新的路跑賽事公佈囉 ！ \n',
    updatedEvent: '嗨 關注的路跑賽事有更新囉 ！ \n',
  },

  foot: `更多賽事資訊，可以到 ${homepage} 查看哦 ！`,
};

export const messages = {

  serverErrorMessage: '伺服器發生錯誤',
  notFoundMessage: '查無資料',

  startMessage: `
  嗨 我是Irunning 愛跑步機器人。
  每日更新台灣最新的路跑賽事資訊！
  如果想要追蹤最新賽事資訊，請輸入 /subscribe ！
  `,

  subscribeMessage: `
  追蹤成功👍 每日上午九點就會發送最新賽事資訊哦 ！
  如果要取消訂閱，請輸入 /unsubscribe
  `,
  unsubscribeMessage: `已取消訂閱`,

  followDefaultMessage: `
  請輸入想要查詢的賽事關鍵字
  例如: 田中馬拉松。
  或是搜尋: 臺北 取得該地區的所有賽事
  如果想知道現在有哪些賽事，可以到 ${homepage} 查看哦 ！
  `,

  followSuccessMessage: `
  成功關注賽事，如果有此賽事的新消息將會提醒哦！
  如果想取消已關注的賽事，請輸入 /unfollow
  `,

  unfollowSuccessMessage: '已取消關注',

}