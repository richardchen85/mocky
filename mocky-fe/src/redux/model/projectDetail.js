import { apiRequest, API_SUCCESS, API_ERROR } from '../api';
import { GROUP, INTERFACE, PROJECT } from '../../constants/url';
import createModal from '../utils/createModel';

function refreshDetail(store) {
  const { dispatch, getState } = store;
  dispatch(apiRequest({ url: PROJECT.GET_DETAIL + getState().projectDetail.id, feature: 'projectDetail/getDetail' }));
}

export default createModal({
  namespace: 'projectDetail',
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
      next(apiRequest({ url: PROJECT.GET_DETAIL + payload, feature: 'projectDetail/getDetail' }));
    },
    [`getDetail_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'projectDetail/setDetail', payload });
    },
    saveTransfer: (store, next, { payload }) => {
      next(apiRequest({ url: PROJECT.TRANSFER, method: 'POST', body: payload, feature: 'projectDetail/saveTransfer' }));
    },
    [`saveTransfer_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'projectDetail/setTransfer', payload: { show: false, saving: false } });
      refreshDetail(store);
    },
    [`saveTransfer_${API_ERROR}`]: (store, next, { payload }) => {
      next({ type: 'projectDetail/setTransfer', payload: { saving: false } });
    },

    // 分组相关
    saveGroup: (store, next, { payload }) => {
      next(apiRequest({ url: GROUP.SAVE, method: 'POST', body: payload, feature: 'projectDetail/saveGroup' }));
    },
    [`saveGroup_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'projectDetail/setGroupEdit', payload: { data: null, editing: false, saving: false } });
      refreshDetail(store);
    },
    [`saveGroup_${API_ERROR}`]: (store, next, { payload }) => {
      next({ type: 'projectDetail/setGroupEdit', payload: { saving: false } });
    },
    deleteGroup: (store, next, { payload }) => {
      next(apiRequest({ url: GROUP.DELETE + payload, feature: 'projectDetail/deleteGroup' }));
    },
    [`deleteGroup_${API_SUCCESS}`]: (store, next, { payload }) => {
      refreshDetail(store);
    },
    sortGroup: (store, next, { payload }) => {
      next(apiRequest({ url: GROUP.SORT, method: 'POST', body: { ids: payload }, feature: 'projectDetail/sortGroup' }));
    },

    // 接口相关
    saveInterface: (store, next, { payload }) => {
      next(apiRequest({ url: INTERFACE.SAVE, method: 'POST', body: payload, feature: 'projectDetail/saveInterface' }));
    },
    [`saveInterface_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'projectDetail/setInterfaceEdit', payload: { data: null, editing: false, saving: false } });
      refreshDetail(store);
    },
    [`saveInterface_${API_ERROR}`]: (store, next, { payload }) => {
      next({ type: 'projectDetail/setInterfaceEdit', payload: { saving: false } });
    },
    deleteInterface: (store, next, { payload }) => {
      next(apiRequest({ url: INTERFACE.DELETE + payload, feature: 'projectDetail/deleteInterface' }));
    },
    [`deleteInterface_${API_SUCCESS}`]: (store, next, { payload }) => {
      refreshDetail(store);
    },
    sortInterface: (store, next, { payload }) => {
      next(
        apiRequest({
          url: INTERFACE.SORT,
          method: 'POST',
          body: { ids: payload },
          feature: 'projectDetail/sortInterface',
        })
      );
    },
  },
});
