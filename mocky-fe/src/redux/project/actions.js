import types from './types';

// feature name
export const PROJECTS = 'PROJECTS';

// action types
export const GET_LIST = `${PROJECTS}_GET_LIST`;
export const SET_LIST = `${PROJECTS}_SET_LIST`;

export const GET_DETAIL = `${PROJECTS}_GET_DETAIL`;
export const SET_DETAIL = `${PROJECTS}_SET_DETAIL`;

// action creators
export const getList = () => ({
  type: GET_LIST,
});

export const setList = (projects = []) => ({
  type: SET_LIST,
  payload: projects,
});

export const getDetail = (id) => ({
  type: GET_DETAIL,
  payload: id,
});

export const setDetail = (project = {}) => ({
  type: SET_DETAIL,
  payload: project,
});

export default {
  getList,
  getDetail,

  getListStart: () => ({ type: types.getListStart }),
  getListSuccess: projects => ({ type: types.getListSuccess, projects }),
  getListFail: error => ({ type: types.getListFail, error }),

  getDetailStart: () => ({ type: types.getDetailStart }),
  getDetailSuccess: project => ({ type: types.getDetailSuccess, project }),
  getDetailFail: error => ({ type: types.getDetailFail, error }),
}
