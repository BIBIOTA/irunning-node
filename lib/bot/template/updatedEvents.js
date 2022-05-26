import { texts } from '../messages/messages.js';
import { escapedUrl, escapedMsg } from '../messages/escapedMsg.js';
import { linkOrNull, eventDistancesToStr } from './methods.js';

const content = (event, index) => {
  const nameAndUrl = escapedUrl(`${index + 1}. [${event.event_name}]${linkOrNull(event.link)}\n`);
  const date = escapedMsg(`比賽日期: ${event.event_date}`);
  const location = escapedMsg(`\n比賽地點: ${event.location}`);
  const distances = event.distance?.length > 0 ? `\n比賽項目: ${eventDistancesToStr(event.distance)}` : '';
  const participate = escapedMsg(`\n報名日期: ${event.participate}`);
  return nameAndUrl + date + location + distances + participate + '\n\n';
}

export const createUpdatedEventsTemplate = (events) => {
  
  let contents = '';

  events.forEach((event, index) => {
    contents += content(event, index);
  });

  const message = texts.title.updatedEvent + contents;

  return message;
}
