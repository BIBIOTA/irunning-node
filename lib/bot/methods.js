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

export function searchEvent(keywords) {
  return axios.get(getUrl('/events') + '?' + new URLSearchParams({keywords})).then((res) => {
    const response = res.data.data;
    const eventListsBtn = response.map((event) => {
      return [{
        text: event.event_name,
        callback_data: event.id,
      }]
    });
    return eventListsBtn;
  }).catch((err) => {
    if (err.response.status === 404) {
      return [];
    } else {
      throw err;
    }
  });
}

export function followEvent(data) {
  return axios.post(getUrl('/telegram/follow'), data).then((res) => {
    return res.data;
  }).catch((err) => {
    throw err;
  });
}

export function searchFollowingEvent(userId) {
  return axios.get(getUrl('/telegram/followingEvent') + '?' + new URLSearchParams({userId})).then((res) => {
    const events = res.data.data;
    const eventListsBtn = events.map((event) => {
      return [{
        text: event.event_name,
        callback_data: event.id,
      }]
    });
    return eventListsBtn;
  }).catch((err) => {
    if (err.response.status === 404) {
      return [];
    } else {
      throw err;
    }
  });
}

export function unfollowEvent(data) {
  return axios.post(getUrl('/telegram/unfollow'), data).then((res) => {
    return res.data;
  }).catch((err) => {
    throw err;
  });
}