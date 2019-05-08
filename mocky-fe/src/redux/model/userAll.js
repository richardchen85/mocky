import { apiRequest } from '../api';
import { AUTH } from '../../constants/url';
import createModal from '../utils/createModel';

export const namespace = 'userAll';

export const types = {
  setPage: `${namespace}/setPage`,
  fetchList: `${namespace}/fetchList`,
  fetchStart: `${namespace}/fetchStart`,
  fetchSucceed: `${namespace}/fetchSucceed`,
  fetchFailed: `${namespace}/fetchFailed`,
  setStatus: `${namespace}/setStatus`,
  changeStatus: `${namespace}/changeStatus`,
};

export default createModal({
  namespace: namespace,
  state: {
    fetching: false,
    page: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
    data: [],
    status: {
      loading: false,
      id: null,
    },
  },
  reducers: {
    setPage: (state, { payload }) => ({ ...state, page: { ...state.page, ...payload } }),
    fetchStart: state => ({ ...state, fetching: true }),
    fetchSucceed: (state, { payload }) => ({
      ...state,
      fetching: false,
      page: { ...state.page, total: payload.page.total },
      data: payload.data || [],
    }),
    fetchFailed: state => ({ ...state, fetching: false }),
    setStatus: (state, { payload }) => ({ ...state, status: { ...state.status, ...payload } }),
  },
  effects: {
    fetchList: (store, next) => {
      next({ type: types.fetchStart });

      const { current, pageSize } = store.getState()[namespace].page;
      next(
        apiRequest({
          url: AUTH.USER_ALL + `?current=${current}&pageSize=${pageSize}`,
          feature: types.fetchStart,
          success: data => {
            next({ type: types.fetchSucceed, payload: data });
          },
          error: () => {
            next({ type: types.fetchFailed });
          },
        })
      );
    },
    changeStatus: (store, next, { payload }) => {
      const { id, status } = payload;
      next({ type: types.setStatus, payload: { loading: true, id } });
      next(
        apiRequest({
          url: AUTH.CHANGE_STATUS + `?id=${id}&status=${status}`,
          feature: types.changeStatus,
          success: () => {
            next({ type: types.setStatus, payload: { loading: false, id: null } });
            store.dispatch({ type: types.fetchList });
          },
          error: () => {
            next({ type: types.setStatus, payload: { loading: false, id: null } });
          },
        })
      );
    },
  },
});
