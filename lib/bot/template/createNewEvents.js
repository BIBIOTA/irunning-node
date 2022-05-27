import { texts } from '../messages/messages.js';
import { escapedUrl, escapedMsg } from '../messages/escapedMsg.js';
import { formatDateDashToSlash } from '../../date.js';
import { formatNameAndLink, eventDistancesToStr } from './methods.js';

const content = (event, index) => {
  const nameAndUrl = `${index + 1}. ` + formatNameAndLink(event.event_name, event.link) + '\n';
  const nameTitle = event.link ? escapedUrl(nameAndUrl) : escapedMsg(nameAndUrl);
  const date = event.event_date ? escapedMsg(`比賽日期: ${formatDateDashToSlash(event.event_date)}`) : '';
  const location = event.location ? escapedMsg(`\n比賽地點: ${event.location}`) : '';
  const distances = event.distances?.length > 0 ? `\n比賽項目: ${eventDistancesToStr(event.distances)}` : '';
  return nameTitle + date + location + distances + '\n\n';
}

export const createNewEventsTemplate = (events) => {
  
  let contents = '';

  events.forEach((event, index) => {
    contents += content(event, index);
  });

  const message = texts.title.newEvent + contents + texts.foot;

  return message;
}