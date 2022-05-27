import { escapedMsg } from '../messages/escapedMsg.js';

export const formatNameAndLink = (name,link) => {
  if (link) {
    return `[${name}](${link})`;
  }

  return name;
}

export const eventDistancesToStr = (distances) => {
  let str = '';
  distances.forEach((distance, index) => {
    const quote = '、';
    str += `${index !== 0 ? quote : ''}${distance.event_distance}`;
  });
  return escapedMsg(`(${str})`);
}

