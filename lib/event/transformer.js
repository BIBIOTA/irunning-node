import _ from 'lodash';
import moment from 'moment';
import { getDate, formatChineseDateToDate } from '../date.js';
import { isset } from '../isset.js';

export default (data) => {
  const {
    year,
    title,
    link,
    statusElement,
    certificate,
    datetime,
    location,
    distancesElement,
    agent,
    entry,
  } = data;
  
  const event = {};

  const status = statusElement === 'line-through' ? 0 : 1;

  let eventName = null, info = null;
  /* check data has info or not */
  if (existBrackets(title)) {
    [eventName, info] = splitEventNameAndInfo(title);
  } else {
    eventName = title; 
  }

  /* check eventCertificate */
  let eventCertificate;
  switch (certificate) {
    case ('/images/iaaf.gif'):
      eventCertificate = 1;
      break;
    case ('/images/aims_logo.gif'):
      eventCertificate = 2;
      break;
    case ('/images/course_ok.png'):
      eventCertificate = 3;
        break;
    default:
      eventCertificate = null
  }

  /* process event time and date */
  const [date, , time] = datetime.trim().split(' ');
  const eventDate = getDate(year, date);
  let eventTime;
  if (time) {
    eventTime = moment(time, 'HH:mm').format('HH:mm:ss');
  } else {
    eventTime = null;
  }

  /* process distances */
  const distances = [];
  if (distancesElement.length > 0) {
    for (let i = 0; i <= distancesElement.length - 1; i++)  {
      let eventDistance = distancesElement.eq(i).html();
      let distance = null;
      let event_distance = null;
      if (!eventDistance.includes('+') && eventDistance.includes('K') && !isNaN(parseFloat(eventDistance.replace('K', '')))) {
        distance = parseFloat(eventDistance.replace('K', ''));
      } else {
        event_distance = eventDistance;
      }
      const distanceInfo = distancesElement.eq(i).attr('title').split('：');
      const eventPrice = isset(parseInt(distanceInfo[1].split('<br/>')[0].trim()));
      const eventLimit = isset(parseInt(distanceInfo[2]));
      distances.push({
        distance,
        event_distance,
        event_price: eventPrice,
        event_limit: eventLimit,
      });
    }
  }

  /* process entry date */
  let participate;
  let entry_is_end = 0;
  let entry_start = null;
  let entry_end = null;
  let entryLastDayCount = null;
  if (entry === '已截止') {
    participate = entry;
    entry_is_end = 1;
  } else if (entry !== null) {
    const [start, end] = entry.split('~');
    if (start != '') {
      entry_start = formatChineseDateToDate(year, start);
    }
    if (end != '') {
      entry_end = formatChineseDateToDate(year, end);
      entryLastDayCount = moment(entry_end).diff(moment(Date.now()), 'days') + 1;
    }
    if (entry_start > entry_end) {
      entry_end = moment(entry_end).add(1, 'years').format('YYYY-MM-DD');
    }
    participate = getPaticipateContent(entry_start, entry_end, entryLastDayCount);
  }

  _.set(event, 'event_name', eventName);
  _.set(event, 'info', info);
  _.set(event, 'link', link);
  _.set(event, 'event_status', status);
  _.set(event, 'event_certificate', eventCertificate);
  _.set(event, 'event_date', eventDate);
  _.set(event, 'event_time', eventTime);
  _.set(event, 'location', location);
  _.set(event, 'distances', distances);
  _.set(event, 'agent', agent);
  _.set(event, 'participate', participate);
  _.set(event, 'entry_is_end', entry_is_end);
  _.set(event, 'entry_start', entry_start);
  _.set(event, 'entry_end', entry_end);

  return event;

}

function getPaticipateContent(entry_start, entry_end, entryLastDayCount) {
  let start = entry_start ? moment(entry_start).format('M/DD') : '';
  let end = entry_end ? moment(entry_end).format('M/DD') : '';
  let lastDayStr = '';
  if (entryLastDayCount !== null && entryLastDayCount <= 7) {
    lastDayStr = ` (最後${entryLastDayCount}天)`;
  }
  return start + '~' + end + lastDayStr;
}

function getBrackets(title) {
  let brackets = {}
  if (title.includes('（')) {
    brackets.first = '（';
  } else if (title.includes('(')) {
    brackets.first = '('
  }

  if (title.includes('）')) {
    brackets.last = '）';
  } else if (title.includes(')')) {
    brackets.last = ')';
  }

  return brackets;
}

function splitEventNameAndInfo(title)
{
  let brackets = getBrackets(title);

  const eventName = title.substring(0, title.indexOf(brackets.first));
  const info = title.substring(title.indexOf(brackets.first) + 1, title.indexOf(brackets.last));

  return [eventName, info]; 
}

function existBrackets(title) {
  const brackets = ['（', '(', '）', ')'];
  if (brackets.filter(item => title.includes(item)).length > 0) {
    return true;
  }

  return false;
}