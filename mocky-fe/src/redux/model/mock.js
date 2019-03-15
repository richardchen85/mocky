import { apiRequest, API_SUCCESS, API_ERROR } from '../api';
import { MOCK } from '../../constants/url';
import createModel from '../utils/createModel';

function getList({ dispatch, getState }) {
  try {
    const { interface_id } = getState().mock;
    interface_id && dispatch({ type: 'mock/getList', payload: interface_id });
  } catch (e) {
    console.error(e);
  }
}

export default createModel({
  namespace: 'mock',
  state: {
    fetching: false,
    interface_id: null,
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
      next(apiRequest({ url: MOCK.GET_LIST + payload, feature: 'mock/getList' }));
    },
    [`getList_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'mock/setList', payload });
    },
    getMock: (store, next, { payload }) => {
      next(apiRequest({ url: MOCK.GET_MOCK + payload, feature: 'mock/getMock' }));
    },
    [`getMock_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'mock/edit', payload: { editing: true, data: payload } });
    },
    save: (store, next, { payload }) => {
      next(apiRequest({ url: MOCK.SAVE, method: 'POST', body: payload, feature: 'mock/save' }));
    },
    [`save_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'mock/edit', payload: { data: null, editing: false, saving: false } });
      getList(store);
    },
    [`save_${API_ERROR}`]: (store, next, { payload }) => {
      next({ type: 'mock/edit', payload: { saving: false } });
    },
    delete: (store, next, { payload }) => {
      next(apiRequest({ url: MOCK.DELETE + payload, feature: 'mock/delete' }));
    },
    [`delete_${API_SUCCESS}`]: (store, next, { payload }) => {
      getList(store);
    }
  },
});
