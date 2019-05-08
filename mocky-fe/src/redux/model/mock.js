import { apiRequest } from '../api';
import { MOCK } from '../../constants/url';
import createModel from '../utils/createModel';

function refreshList({ dispatch, getState }) {
  try {
    const { interface_id } = getState().mock;
    interface_id && dispatch({ type: types.getList, payload: interface_id });
  } catch (e) {
    console.error(e);
  }
}

export const namespace = 'mock';

export const types = {
  getList: `${namespace}/getList`,
  setList: `${namespace}/setList`,
  getMock: `${namespace}/getMock`,
  edit: `${namespace}/edit`,
  save: `${namespace}/save`,
  delete: `${namespace}/delete`,
};

export default createModel({
  namespace: namespace,
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
      next(
        apiRequest({
          url: MOCK.GET_LIST + payload,
          feature: types.getList,
          success: data => {
            next({ type: types.setList, payload: data });
          },
          error: () => {
            //
          },
        })
      );
    },
    getMock: (store, next, { payload }) => {
      next(
        apiRequest({
          url: MOCK.GET_MOCK + payload,
          feature: types.getMock,
          success: data => {
            next({ type: types.edit, payload: { editing: true, data } });
          },
        })
      );
    },
    save: (store, next, { payload }) => {
      next(
        apiRequest({
          url: MOCK.SAVE,
          method: 'POST',
          body: payload,
          feature: types.save,
          success: () => {
            next({ type: types.edit, payload: { data: null, editing: false, saving: false } });
            refreshList(store);
          },
          error: () => {
            next({ type: types.edit, payload: { saving: false } });
          },
        })
      );
    },
    delete: (store, next, { payload }) => {
      next(
        apiRequest({
          url: MOCK.DELETE + payload,
          feature: types.delete,
          success: () => {
            refreshList(store);
          },
        })
      );
    },
  },
});
