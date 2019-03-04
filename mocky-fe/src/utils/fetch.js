import { message } from 'antd';
import messages from '../constants/messages';
import store from '../redux/store';
import { actions as usersActions } from '../redux/auth';

const defaults = {
  toastError: true,
  toastSuccess: false,
  timeout: 30000,
  type: 'GET',
  data: null,
};

const toastType = {
  error: 'error',
  success: 'success',
};

function toast(type, content) {
  if (type === toastType.error) {
    message.error(content);
  } else if (type === toastType.success) {
    message.success(content);
  }
}

function notLoggedIn() {
  store.dispatch(usersActions.resetAuth());
}

/**
 * fetch with timeout
 * @param {*} fetchPromise
 * @param {*} timeout
 */
function _fetch(fetchPromise, timeout) {
  let abortFn = null;

  let abortPromise = new Promise(function (resolve, reject) {
    abortFn = function () {
      reject('abort promise');
    }
  })

  let abortablePromise = Promise.race([
    fetchPromise,
    abortPromise,
  ]);

  setTimeout(function () {
    abortFn();
  }, timeout);

  return abortablePromise;
}

/**
 * fetch success callback
 * @param {*} json
 * @param {*} options
 * @param {*} resolve
 * @param {*} reject
 */
function _success(json, options, resolve, reject) {
  const { toastSuccess, toastError } = options;

  if (!json.success) {
    // 处理特殊返回码
    if (json.code === 401) {
      notLoggedIn();
    } else {
      toastError && toast(toastType.error, json.message || messages.serverBusy);
    }

    return reject({
      code: json.code,
      message: json.message,
      data: json.data || {}
    });
  }

  toastSuccess && toast(toastType.success, json.message || messages.success);

  resolve(json);
}

/**
 * fetch failed callback
 * @param {*} options
 * @param {*} reject
 */
function _fail(options, reject) {
  const { toastError } = options;
  toastError && toast(toastType.error, messages.networkError);

  reject({
    message: messages.networkError,
  });
}

export function fetch(url, options) {
  options = Object.assign({}, defaults, options || {});

    let { timeout, type, data } = options;

    return new Promise(function (resolve, reject) {
      const fetchOption = {
        method: type,
        credentials: 'include',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
      };

      if (data) {
        fetchOption.body = JSON.stringify(data);
      }

      _fetch(window.fetch(url, fetchOption), timeout).then(function (response) {
        return response.json();
      }).then(function (json) {
        _success(json, options, resolve, reject);
      }).catch(function () {
        _fail(options, reject);
      })
    })
}
