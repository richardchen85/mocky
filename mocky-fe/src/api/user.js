import { fetch } from '../utils/fetch';

export default {
  signUp(body) {
    return fetch('/user/signUp', {
      method: 'POST',
      body,
      toastError: false,
    });
  },
  login(body) {
    return fetch('/user/login', {
      method: 'POST',
      body,
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
