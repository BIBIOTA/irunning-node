import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

function getUrl(uri) {
  return `${process.env.LARAVEL_API_URL}${uri}`;
}

function setSubscribeForm(userId, option) {
  return {
    userId,
    option,
  };
}

export function subscribe(userId) {
  const data = setSubscribeForm(userId, 'subscribe_new_events');
  return axios.post(getUrl('/telegram/subscribe'), data).then((res) => {
    return res.data;
  }).catch((err) => {
    throw err;
  });
}

export function unsubscribe(userId) {
  const data = setSubscribeForm(userId, 'subscribe_new_events');
  return axios.post(getUrl('/telegram/unsubscribe'), data).then((res) => {
    return res.data;
  }).catch((err) => {
    throw err;
  });
}