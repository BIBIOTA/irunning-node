import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { subscribe, unsubscribe, searchEvent, followEvent, searchFollowingEvent, unfollowEvent } from './methods.js';
import {
  createNewEventsTemplate,
  createUpdatedEventsTemplate,
  startMessage,
  subscribeMessage,
  unsubscribeMessage,
  serverErrorMessage,
  followDefaultMessage,
  followSuccessMessage,
  unfollowSuccessMessage,
  notFoundMessage,
} from './template.js';
// TODO: collect options
const markDownoption = {
  parse_mode: 'MarkdownV2',
  disable_web_page_preview: true
};
const replyMarkupWithForceReplyOption = {
  reply_markup: {
      force_reply: true,
  },
};

let bot;
if (process.env.NODE === 'production') {
  bot = new Telegraf(process.env.TELEGRAM_TOKEN);
} else {
  bot = new Telegraf(process.env.TELEGRAM_TEST_BOT_TOKEN);
}


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

// follow single event
bot.hears('/follow', async (ctx) => {
  try {

    // wait user input keywords
    await bot.telegram.sendMessage(ctx.update.message.from.id, followDefaultMessage, {
        ...markDownoption,
        ...replyMarkupWithForceReplyOption,
    });

    // get user input keywords
    bot.on('text', async (ctx) => {
      try {
        const response = await searchEvent(ctx.message.text);
        if (response.length === 0) {
          ctx.reply(notFoundMessage);
          return;
        }
        const option = {
          reply_markup: {
            inline_keyboard: response,
            parse_mode: 'HTML',
          },
        };
        
        // send results and selection
        await bot.telegram.sendMessage(ctx.update.message.from.id, '請選擇想要關注的賽事', option);

        // get user select event
        bot.on('callback_query', async (ctx) => {
          try {
            const eventId = ctx.callbackQuery.data;
            const userId = ctx.from.id;
            await followEvent({userId, eventId});
            ctx.reply(followSuccessMessage);
          } catch (err) {
            console.log(err);
            if (err.response.status === 400) {
              if (err.response.data.data.code === 'IR401') {
                ctx.reply('此賽事已加入過囉');
              }
              ctx.reply(serverErrorMessage);        
            } else {
              ctx.reply(serverErrorMessage);        
            }
          }
        });
      } catch (err) {
        console.log(err);
        ctx.reply(serverErrorMessage);    
      }
    });
  } catch (err) {
    console.log(err);
    ctx.reply(serverErrorMessage);
  }
});

bot.hears('/unfollow', async (ctx) => {
  try {
    const response = await searchFollowingEvent(ctx.update.message.from.id);

    if (response.length === 0) {
      ctx.reply(notFoundMessage);
      return;
    }
    const option = {
      reply_markup: {
        inline_keyboard: response,
        parse_mode: 'HTML',
      },
    };
    
    // send results and selection
    await bot.telegram.sendMessage(ctx.update.message.from.id, '請選擇想要取消關注的賽事', option);

    // get user select event
    bot.on('callback_query', async (ctx) => {
      try {
        const eventId = ctx.callbackQuery.data;
        const userId = ctx.from.id;
        await unfollowEvent({userId, eventId});
        ctx.reply(unfollowSuccessMessage);
      } catch (err) {
        ctx.reply(serverErrorMessage);
      }
    });

  } catch (err) {
    console.log(err);
    ctx.reply(serverErrorMessage);
  }
});

export function sendNewEvent(data)
{
  try {
    const message = createNewEventsTemplate(data.events);
    data.userIds.forEach((userId) => {
      bot.telegram.sendMessage(userId, message, markDownoption);
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
      bot.telegram.sendMessage(user, message, markDownoption);
    });
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

bot.launch();