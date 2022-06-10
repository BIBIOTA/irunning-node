import { escapedMsg } from '../messages/escapedMsg.js';

export const formatNameAndLink = (name,link) => {
  if (link) {
    return `[${name}](${link})`;
  }

  return name;
}

export const linkOrNull = (link) => {
  if (link) {
    return `(${link})`;
  }

  return '';
}

export const eventDistancesToStr = (distances) => {
  let str = '';
  distances.forEach((distance, index) => {
    const quote = '、';
    const singleDistance = distance.event_distance ?? `${distance.distance}K`;
    str += `${index !== 0 ? quote : ''}${singleDistance}`;
  });
  return escapedMsg(`(${str})`);
}

