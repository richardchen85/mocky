import { apiRequest } from '../api';
import { PROJECT } from '../../constants/url';
import createModal from '../utils/createModel';

export const namespace = 'projectAll';

export const types = {
  setPage: `${namespace}/setPage`,
  fetchList: `${namespace}/fetchList`,
  fetchStart: `${namespace}/fetchStart`,
  fetchSucceed: `${namespace}/fetchSucceed`,
  fetchFailed: `${namespace}/fetchFailed`,
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
  },
  effects: {
    fetchList: (store, next) => {
      next({ type: types.fetchStart });

      const { current, pageSize } = store.getState()[namespace].page;
      next(
        apiRequest({
          url: PROJECT.GET_ALL + `?current=${current}&pageSize=${pageSize}`,
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
  },
});
