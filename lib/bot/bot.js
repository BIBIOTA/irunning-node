import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { subscribe, unsubscribe, searchEvent, followEvent, searchFollowingEvent, unfollowEvent } from './methods.js';
import { messages } from './messages/messages.js';
import { createNewEventsTemplate } from './template/createNewEvents.js';
import { createUpdatedEventsTemplate } from './template/updatedEvents.js';
import { options } from './options/options.js';

let bot;
if (process.env.NODE === 'production') {
  bot = new Telegraf(process.env.TELEGRAM_TOKEN);
} else {
  bot = new Telegraf(process.env.TELEGRAM_TEST_BOT_TOKEN);
}


bot.start((ctx) => ctx.replyWithMarkdownV2(messages.startMessage));

bot.hears('/subscribe', async (ctx) => {
  try {
    await subscribe(ctx.update.message.from.id);
    ctx.reply(messages.subscribeMessage);   
  } catch (err) {
    console.log(err);
    ctx.reply(messages.serverErrorMessage);
  }
});

bot.hears('/unsubscribe', async(ctx) => {
  try {
    await unsubscribe(ctx.update.message.from.id);
    ctx.reply(messages.unsubscribeMessage);   
  } catch (err) {
    console.log(err);
    ctx.reply(messages.serverErrorMessage);
  }
});

// follow single event
bot.hears('/follow', async (ctx) => {
  try {

    // wait user input keywords
    await bot.telegram.sendMessage(ctx.update.message.from.id, messages.followDefaultMessage, {
        ...options.markDownOption,
        ...options.replyMarkupWithForceReplyOption,
    });

    // get user input keywords
    bot.on('text', async (ctx) => {
      try {
        const response = await searchEvent(ctx.message.text);
        if (response.length === 0) {
          ctx.reply(messages.notFoundMessage);
          return;
        }
        
        // send results and selection
        await bot.telegram.sendMessage(ctx.update.message.from.id, '請選擇想要關注的賽事', options.replyMarkupWithInlineKeyboardOption(response));

      } catch (err) {
        console.log(err);
        ctx.reply(messages.serverErrorMessage);    
      }
    });
  } catch (err) {
    console.log(err);
    ctx.reply(messages.serverErrorMessage);
  }
});

bot.hears('/unfollow', async (ctx) => {
  try {
    const response = await searchFollowingEvent(ctx.update.message.from.id);

    if (response.length === 0) {
      ctx.reply(messages.notFoundMessage);
      return;
    }
    
    // send results and selection
    await bot.telegram.sendMessage(ctx.update.message.from.id, '請選擇想要取消關注的賽事', options.replyMarkupWithInlineKeyboardOption(response));

  } catch (err) {
    console.log(err);
    ctx.reply(messages.serverErrorMessage);
  }
});

bot.on('callback_query', async (ctx) => {
  const [command, data] = ctx.callbackQuery.data.split('-');
  const userId = ctx.from.id;
  switch(command) {
    case 'follow':
      try {
        await followEvent({userId, eventId: data});
        ctx.reply(messages.followSuccessMessage);
      } catch (err) {
        console.log(err);
        if (err.response.data.data.code === 'IR401') {
          ctx.reply('此賽事已加入過囉');
        } else {
          ctx.reply(messages.serverErrorMessage);        
        }
      }
      break;
    case 'unfollow':
      try {
        await unfollowEvent({userId, eventId: data});
        ctx.reply(messages.unfollowSuccessMessage);
      } catch (err) {
        ctx.reply(messages.serverErrorMessage);
      }
      break;
    default:
      ctx.reply(messages.serverErrorMessage);
      break;
  }
});

export function sendNewEvent(data)
{
  try {
    const message = createNewEventsTemplate(data.events);
    data.userIds.forEach((userId) => {
      bot.telegram.sendMessage(userId, message, options.markDownOption);
    });
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function sendUpdatedEvent(data)
{
  try {
    Object.keys(data).forEach((user) => {
      const message = createUpdatedEventsTemplate(data[user]);
      bot.telegram.sendMessage(user, message, options.markDownOption);
    });
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

bot.launch();