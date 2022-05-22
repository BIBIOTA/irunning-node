import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { subscribe, unsubscribe } from './methods.js';
import {
  createNewEventsTemplate,
  startMessage,
  subscribeMessage,
  unsubscribeMessage,
  serverErrorMessage,
} from './template.js';
// TODO: collect options

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.replyWithMarkdownV2(startMessage));

bot.hears('/subscribe', async (ctx) => {
  try {
    await subscribe(ctx.update.message.from.id);
    ctx.reply(subscribeMessage);   
  } catch (err) {
    console.log(err);
    ctx.reply(serverErrorMessage);
  }
});

bot.hears('/unsubscribe', async(ctx) => {
  try {
    await unsubscribe(ctx.update.message.from.id);
    ctx.reply(unsubscribeMessage);   
  } catch (err) {
    console.log(err);
    ctx.reply(serverErrorMessage);
  }
});

export function sendNewEvent(data)
{
  try {
    const message = createNewEventsTemplate(data.events);
    const option = {parse_mode: 'MarkdownV2', disable_web_page_preview: true};
    data.userIds.forEach((userId) => {
      bot.telegram.sendMessage(userId, message, option);
    });
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

bot.launch();