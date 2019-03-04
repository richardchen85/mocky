import { fetch } from '../utils/fetch';

export default {
  signUp(data) {
    return fetch('/user/signUp', {
      type: 'POST',
      data,
      toastError: false,
    });
  },
  login(data) {
    return fetch('/user/login', {
      type: 'POST',
      data,
      toastError: false,
    });
  },
  getUser() {
    return fetch('/user/get?_=' + Date.now(), {
      toastError: false,
    });
  },
  logout() {
    return fetch('/user/logout', {
      toastError: false,
    });
  },
  search(key) {
    return fetch('/user/search?key=' + key, {
      toastError: false,
    });
  },
}