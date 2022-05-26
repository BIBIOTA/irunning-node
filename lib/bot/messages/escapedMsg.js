export const escapedMsg = (str) =>
{
  return str
          .replace(/_/g, '\\_')
          .replace(/\*/g, '\\*')
          .replace(/\[/g, '\\[')
          .replace(/\]/g, '\\]')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          .replace(/~/g, '\\~')
          .replace(/`/g, '\\`')
          .replace(/>/g, '\\>')
          .replace(/#/g, '\\#')
          .replace(/\+/g, '\\+')
          .replace(/-/g, '\\-')
          .replace(/=/g, '\\=')
          .replace(/\|/g, '\\|')
          .replace(/\{/g, '\\{')
          .replace(/\}/g, '\\}')
          .replace(/\./g, '\\.')
          .replace(/!/g, '\\!');
}

export const escapedUrl = (url) =>
{
  return url.replace(/(\[[^\][]*]\(http[^()]*\))|[_*[\]()~>#+=|{}.!-]/gi,
  (x,y) => y ? y : '\\' + x).replace(/-/g, '\\-');
}