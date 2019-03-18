import { apiRequest } from '../api';
import { PROJECT } from '../../constants/url';
import createModal from '../utils/createModel';

function refreshList(store) {
  store.dispatch({ type: types.getList });
}

const namespace = 'projectList';

export const types = {
  getList: `${namespace}/getList`,
  setList: `${namespace}/setList`,
  getProject: `${namespace}/getProject`,
  edit: `${namespace}/edit`,
  save: `${namespace}/save`,
  delete: `${namespace}/delete`,
};

export default createModal({
  namespace: namespace,
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
      next(
        apiRequest({
          url: PROJECT.GET_LIST,
          feature: types.getList,
          success: data => {
            next({ type: types.setList, payload: data });
          },
        })
      );
    },
    getProject: (store, next, { payload }) => {
      next(
        apiRequest({
          url: PROJECT.GET_PROJECT + payload,
          feature: types.getProject,
          success: data => {
            next({ type: types.edit, payload: { editing: true, data } });
          },
        })
      );
    },
    save: (store, next, { payload }) => {
      next(
        apiRequest({
          url: PROJECT.SAVE,
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
          url: PROJECT.DELETE + payload,
          feature: types.delete,
          success: () => {
            refreshList(store);
          },
        })
      );
    },
  },
});
