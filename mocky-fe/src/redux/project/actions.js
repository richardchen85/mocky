import types from './types';

export default {
  getList: () => ({ type: types.GET_LIST }),
  setList: (projects = []) => ({ type: types.SET_LIST, payload: projects }),
  getProject: id => ({ type: types.GET_PROJECT, payload: id }),
  setProject: project => ({ type: types.SET_PROJECT, payload: project }),
  saveProject: project => ({ type: types.SAVE_PROJECT, payload: project }),
  deleteProject: id => ({ type: types.DELETE_PROJECT, payload: id }),

  getDetail: id => ({ type: types.GET_DETAIL, payload: id }),
  setDetail: (project = {}) => ({ type: types.SET_DETAIL, payload: project }),

  setGroup: group => ({ type: types.SET_GROUP, payload: group }),
  deleteGroup: id => ({ type: types.DELETE_GROUP, payload: id }),
  saveGroup: group => ({ type: types.SAVE_GROUP, payload: group }),
  sortGroup: ids => ({ type: types.SORT_GROUP, payload: { ids } }),

  setInterface: itface => ({ type: types.SET_INTERFACE, payload: itface }),
  deleteInterface: id => ({ type: types.DELETE_INTERFACE, payload: id }),
  saveInterface: itf => ({ type: types.SAVE_INTERFACE, payload: itf }),
  sortInterface: ids => ({ type: types.SORT_INTERFACE, payload: { ids } }),
};
