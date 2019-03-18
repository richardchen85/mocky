import { apiRequest, API_SUCCESS, API_ERROR } from '../api';
import { PROJECT } from '../../constants/url';
import createModal from '../utils/createModel';

function refreshList(store) {
  store.dispatch({ type: 'projectList/getList' });
}

export default createModal({
  namespace: 'projectList',
  state: {
    fetching: false,
    data: [],
    edit: { data: null, editing: false, saving: false },
  },
  reducers: {
    getList: (state, { payload }) => {
      return { ...state, payload, fetching: true };
    },
    setList: (state, { payload }) => {
      return { ...state, fetching: false, data: payload };
    },
    edit: (state, { payload }) => {
      return { ...state, edit: { ...state.edit, ...payload } };
    },
  },
  effects: {
    getList: (store, next, { payload }) => {
      next(apiRequest({ url: PROJECT.GET_LIST, feature: 'projectList/getList' }));
    },
    [`getList_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'projectList/setList', payload });
    },
    getProject: (store, next, { payload }) => {
      next(apiRequest({ url: PROJECT.GET_PROJECT + payload, feature: 'projectList/getProject' }));
    },
    [`getProject_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'projectList/edit', payload: { editing: true, data: payload } });
    },
    save: (store, next, { payload }) => {
      next(apiRequest({ url: PROJECT.SAVE, method: 'POST', body: payload, feature: 'projectList/save' }));
    },
    [`save_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'projectList/edit', payload: { data: null, editing: false, saving: false } });
      refreshList(store);
    },
    [`save_${API_ERROR}`]: (store, next, { payload }) => {
      next({ type: 'projectList/edit', payload: { saving: false } });
    },
    delete: (store, next, { payload }) => {
      next(apiRequest({ url: PROJECT.DELETE + payload, feature: 'projectList/delete' }));
    },
    [`delete_${API_SUCCESS}`]: (store, next, { payload }) => {
      refreshList(store);
    },
  },
});
