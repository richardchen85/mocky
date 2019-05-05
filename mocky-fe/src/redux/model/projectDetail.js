import { apiRequest } from '../api';
import { GROUP, INTERFACE, PROJECT } from '../../constants/url';
import createModal from '../utils/createModel';

function refreshDetail({ dispatch, getState }) {
  dispatch(
    apiRequest({
      url: PROJECT.GET_DETAIL + getState().projectDetail.id,
      feature: types.getDetail,
      success: data => {
        dispatch({ type: types.setDetail, payload: data });
      },
    })
  );
}

const namespace = 'projectDetail';

export const types = {
  getDetail: `${namespace}/getDetail`,
  setDetail: `${namespace}/setDetail`,
  setTransfer: `${namespace}/setTransfer`,
  saveTransfer: `${namespace}/saveTransfer`,
  setGroupEdit: `${namespace}/setGroupEdit`,
  saveGroup: `${namespace}/saveGroup`,
  deleteGroup: `${namespace}/deleteGroup`,
  sortGroup: `${namespace}/sortGroup`,
  setInterfaceEdit: `${namespace}/setInterfaceEdit`,
  saveInterface: `${namespace}/saveInterface`,
  deleteInterface: `${namespace}/deleteInterface`,
  sortInterface: `${namespace}/sortInterface`,
};

export default createModal({
  namespace: namespace,
  state: {
    fetching: false,
    id: null,
    data: {},
    groupEdit: { data: null, editing: false, saving: false },
    interfaceEdit: { data: null, editing: false, saving: false },
    transfer: { show: false, saving: false },
  },
  reducers: {
    getDetail: (state, { payload }) => {
      return { ...state, fetching: true, id: payload };
    },
    setDetail: (state, { payload }) => {
      return { ...state, fetching: false, data: payload };
    },
    setGroupEdit: (state, { payload }) => {
      return { ...state, groupEdit: { ...state.groupEdit, ...payload } };
    },
    setInterfaceEdit: (state, { payload }) => {
      return { ...state, interfaceEdit: { ...state.interfaceEdit, ...payload } };
    },
    setTransfer: (state, { payload }) => {
      return { ...state, transfer: { ...state.transfer, ...payload } };
    },
  },
  effects: {
    // 详情相关
    getDetail: (store, next, { payload }) => {
      next(
        apiRequest({
          url: PROJECT.GET_DETAIL + payload,
          feature: types.getDetail,
          success: data => {
            next({ type: types.setDetail, payload: data });
          },
        })
      );
    },
    saveTransfer: (store, next, { payload }) => {
      next(
        apiRequest({
          url: PROJECT.TRANSFER,
          method: 'POST',
          body: payload,
          feature: types.saveTransfer,
          success: () => {
            next({ type: types.setTransfer, payload: { show: false, saving: false } });
            refreshDetail(store);
          },
          error: () => {
            next({ type: types.setTransfer, payload: { saving: false } });
          },
        })
      );
    },

    // 分组相关
    saveGroup: (store, next, { payload }) => {
      next(
        apiRequest({
          url: GROUP.SAVE,
          method: 'POST',
          body: payload,
          feature: types.saveGroup,
          success: () => {
            next({ type: types.setGroupEdit, payload: { data: null, editing: false, saving: false } });
            refreshDetail(store);
          },
          error: () => {
            next({ type: types.setGroupEdit, payload: { saving: false } });
          },
        })
      );
    },
    deleteGroup: (store, next, { payload }) => {
      next(
        apiRequest({
          url: GROUP.DELETE + payload,
          feature: types.deleteGroup,
          success: () => {
            refreshDetail(store);
          },
        })
      );
    },
    sortGroup: (store, next, { payload }) => {
      next(apiRequest({ url: GROUP.SORT, method: 'POST', body: { ...payload }, feature: types.sortGroup }));
    },

    // 接口相关
    saveInterface: (store, next, { payload }) => {
      next(
        apiRequest({
          url: INTERFACE.SAVE,
          method: 'POST',
          body: payload,
          feature: types.saveInterface,
          success: () => {
            next({ type: types.setInterfaceEdit, payload: { data: null, editing: false, saving: false } });
            refreshDetail(store);
          },
          error: () => {
            next({ type: types.setInterfaceEdit, payload: { saving: false } });
          },
        })
      );
    },
    deleteInterface: (store, next, { payload }) => {
      next(
        apiRequest({
          url: INTERFACE.DELETE + payload,
          feature: types.deleteInterface,
          success: () => {
            refreshDetail(store);
          },
        })
      );
    },
    sortInterface: (store, next, { payload }) => {
      next(apiRequest({ url: INTERFACE.SORT, method: 'POST', body: { ...payload }, feature: types.sortInterface }));
    },
  },
});
