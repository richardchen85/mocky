import { message } from 'antd';
import messages from '../constants/messages';
let apiServer = 'https://api.mocky.chenliqiang.cn';

if (process.env.NODE_ENV !== 'production') {
  apiServer = 'http://127.0.0.1:7001';
}

const defaults = {
  toastError: true,
  toastSuccess: false,
  timeout: 30000,
  method: 'GET',
  body: null,
};

const toastType = {
  error: 'error',
  success: 'success',
};

function toast(type, content) {
  if (typeof content !== 'string') {
    content = String(content);
  }
  if (type === toastType.error) {
    message.error(content);
  } else if (type === toastType.success) {
    message.success(content);
  }
}

/**
 * fetch with timeout
 * @param {*} fetchPromise
 * @param {*} timeout
 */
function _fetch(fetchPromise, timeout) {
  let abortFn = null;

  let abortPromise = new Promise(function(resolve, reject) {
    abortFn = function() {
      reject('abort promise');
    };
  });

  let abortablePromise = Promise.race([fetchPromise, abortPromise]);

  setTimeout(function() {
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
    toastError && toast(toastType.error, json.message || messages.serverBusy);

    return reject({
      code: json.code,
      message: json.message,
      data: json.data || {},
    });
  }

  toastSuccess && toast(toastType.success, json.message || json.data || messages.success);

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

  let { timeout, method, body } = options;

  return new Promise(function(resolve, reject) {
    const fetchOption = {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body) {
      fetchOption.body = JSON.stringify(body);
    }

    _fetch(window.fetch(apiServer + url, fetchOption), timeout)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        _success(json, options, resolve, reject);
      })
      .catch(function(e) {
        console.error(e);
        _fail(options, reject);
      });
  });
}

export function get(url, options = {}) {
  return fetch(url, options);
}

export function post(url, body, options = {}) {
  return fetch(url, Object.assign({}, options, { method: 'POST', body }));
}
