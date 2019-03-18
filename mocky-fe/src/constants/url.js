export const AUTH = {
  SIGN_UP: '/user/signUp',
  LOGIN: '/user/login',
  GET: '/user/get',
  LOGOUT: '/user/logout',
  SEARCH: '/user/search?key=',
};

export const PROJECT = {
  GET_LIST: '/project/getByUser',
  GET_PROJECT: '/project/getById?id=',
  SAVE: '/project/save',
  DELETE: '/project/delete?id=',
  GET_DETAIL: '/project/detail?id=',
  TRANSFER: '/project/transfer',
};

export const GROUP = {
  SAVE: '/group/save',
  DELETE: '/group/delete?id=',
  SORT: '/group/sort',
};

export const INTERFACE = {
  SAVE: '/interface/save',
  DELETE: '/interface/delete?id=',
  SORT: '/interface/sort',
};

export const DATA_MAP = {
  GET_LIST: '/dataMap/list?interface_id=',
  DELETE: '/dataMap/delete?id=',
  SAVE: '/dataMap/save',
};

export const MOCK = {
  GET_LIST: '/mock/list?interface_id=',
  DELETE: '/mock/delete?id=',
  GET_MOCK: '/mock/detail?id=',
  SAVE: '/mock/save',
};
