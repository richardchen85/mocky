export const AUTH = {
  SIGN_UP: '/user/signUp',
  LOGIN: '/user/login',
  GET: '/user/get?_=',
  LOGOUT: '/user/logout',
  SEARCH: '/user/search?key=',
};

export const PROJECT = {
  GET_LIST: '/project/getByUser',
  GET_PROJECT: '/project/getById?id=',
  SAVE_PROJECT: '/project/save',
  DELETE_PROJECT: '/project/delete?id=',
  GET_DETAIL: '/project/detail?id=',
};

export const GROUP = {
  CREATE_GROUP: '/group/create',
  UPDATE_GROUP: '/group/update',
  DELETE_GROUP: '/group/remove?id=',
  SORT_GROUP: '/group/sort',
};

export const INTERFACE = {
  CREATE_INTERFACE: '/interface/create',
  UPDATE_INTERFACE: '/interface/update',
  DELETE_INTERFACE: '/interface/remove?id=',
  SORT_INTERFACE: '/interface/sort',
};

export const DATA_MAP = {
  GET_LIST: '/dataMap/list?interface_id=',
  DELETE: '/dataMap/remove?id=',
  CREATE: '/dataMap/create',
  UPDATE: '/dataMap/update',
};

export const MOCK = {
  GET_LIST: '/mock/list?interface_id=',
  DELETE: '/mock/remove?id=',
  GET_MOCK: '/mock/detail?id=',
  CREATE: '/mock/create',
  UPDATE: '/mock/update',
};
