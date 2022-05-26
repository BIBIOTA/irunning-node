export const options = {
  markDownOption: {
    parse_mode: 'MarkdownV2',
    disable_web_page_preview: true
  },
  replyMarkupWithForceReplyOption: {
    reply_markup: {
        force_reply: true,
    },
  },
  replyMarkupWithInlineKeyboardOption(response) {
    return {
      reply_markup: {
        inline_keyboard: response,
        parse_mode: 'HTML',
      },
    };
  },
}