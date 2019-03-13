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
  SAVE_PROJECT: '/project/save',
  DELETE_PROJECT: '/project/delete?id=',
  GET_DETAIL: '/project/detail?id=',
  TRANSFER: '/project/transfer',
};

export const GROUP = {
  SAVE_GROUP: '/group/save',
  DELETE_GROUP: '/group/delete?id=',
  SORT_GROUP: '/group/sort',
};

export const INTERFACE = {
  SAVE_INTERFACE: '/interface/save',
  DELETE_INTERFACE: '/interface/delete?id=',
  SORT_INTERFACE: '/interface/sort',
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
