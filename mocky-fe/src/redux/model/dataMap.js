import { apiRequest, API_SUCCESS, API_ERROR } from '../api';
import { DATA_MAP } from '../../constants/url';
import createModal from '../utils/createModel';

function refreshList({ dispatch, getState }) {
  try {
    const { interface_id } = getState().mock;
    interface_id && dispatch({ type: 'dataMap/getList', payload: interface_id });
  } catch (e) {
    console.error(e);
  }
}

export default createModal({
  namespace: 'dataMap',
  state: {
    fetching: false,
    interface_id: 0,
    data: [],
    edit: { editing: false, data: null, saving: false },
  },
  reducers: {
    getList: (state, { payload }) => {
      return { ...state, interface_id: payload, fetching: true };
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
      next(apiRequest({ url: DATA_MAP.GET_LIST + payload, feature: 'dataMap/getList' }));
    },
    [`getList_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'dataMap/setList', payload });
    },
    save: (store, next, { payload }) => {
      next(apiRequest({ url: DATA_MAP.SAVE, method: 'POST', body: payload, feature: 'dataMap/save' }));
    },
    [`save_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'dataMap/edit', payload: { data: null, editing: false, saving: false } });
      refreshList(store);
    },
    [`save_${API_ERROR}`]: (store, next, { payload }) => {
      next({ type: 'dataMap/edit', payload: { saving: false } });
    },
    delete: (store, next, { payload }) => {
      next(apiRequest({ url: DATA_MAP.DELETE + payload, feature: 'dataMap/delete' }));
    },
    [`delete_${API_SUCCESS}`]: (store, next, { payload }) => {
      refreshList(store);
    },
  },
});
