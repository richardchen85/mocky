import { apiRequest, API_SUCCESS, API_ERROR } from '../api';
import types from './types';
import actions from './actions';
import selectors from './selectors';
import { PROJECT, GROUP, INTERFACE } from '../../constants/url';

const fetchDetail = (dispatch, getState) => {
  let id = selectors.getDetailId(getState());
  id && dispatch(apiRequest({ url: PROJECT.GET_DETAIL + id, feature: types.GET_DETAIL }));
};

export default ({ dispatch, getState }) => next => action => {
  next(action);

  switch (action.type) {
    // project list
    case types.GET_LIST: {
      next(apiRequest({ url: PROJECT.GET_LIST, feature: types.GET_LIST }));
      break;
    }

    case `${types.GET_LIST}_${API_SUCCESS}`: {
      next(actions.setList(action.payload));
      break;
    }

    case types.GET_PROJECT: {
      next(apiRequest({ url: PROJECT.GET_PROJECT + action.payload, feature: types.GET_PROJECT }));
      break;
    }

    case `${types.GET_PROJECT}_${API_SUCCESS}`: {
      next(actions.setProject({ data: action.payload, editing: true }));
      break;
    }

    case types.SAVE_PROJECT: {
      next(apiRequest({
        url: PROJECT.SAVE_PROJECT,
        method: 'POST',
        body: action.payload,
        feature: types.SAVE_PROJECT
      }));
      break;
    }

    case `${types.SAVE_PROJECT}_${API_SUCCESS}`: {
      next(actions.setProject({ data: null, editing: false, saving: false }));
      dispatch(actions.getList());
      break;
    }

    case `${types.SAVE_PROJECT}_${API_ERROR}`: {
      next(actions.setProject({ saving: false }));
      break;
    }

    case types.DELETE_PROJECT: {
      next(apiRequest({ url: PROJECT.DELETE_PROJECT + action.payload, feature: types.DELETE_PROJECT }));
      break;
    }

    case `${types.DELETE_PROJECT}_${API_SUCCESS}`: {
      dispatch(actions.getList());
      break;
    }

    // project detail
    case types.GET_DETAIL: {
      fetchDetail(dispatch, getState);
      break;
    }

    case `${types.GET_DETAIL}_${API_SUCCESS}`: {
      next(actions.setDetail(action.payload));
      break;
    }

    // group
    case types.CREATE_GROUP: {
      next(apiRequest({ url: GROUP.CREATE_GROUP, method: 'POST', body: action.payload, feature: types.CREATE_GROUP }));
      break;
    }

    case types.UPDATE_GROUP: {
      next(apiRequest({ url: GROUP.UPDATE_GROUP, method: 'POST', body: action.payload, feature: types.CREATE_GROUP }));
      break;
    }

    case `${types.CREATE_GROUP}_${API_SUCCESS}`:
    case `${types.UPDATE_GROUP}_${API_SUCCESS}`: {
      next(actions.setGroup({ data: null, editing: false, saving: false }));
      fetchDetail(dispatch, getState);
      break;
    }

    case `${types.CREATE_GROUP}_${API_ERROR}`:
    case `${types.UPDATE_GROUP}_${API_ERROR}`: {
      next(actions.setGroup({ saving: false }));
      break;
    }

    case types.DELETE_GROUP: {
      next(apiRequest({ url: GROUP.DELETE_GROUP + action.payload, feature: types.DELETE_GROUP }));
      break;
    }

    case types.SORT_GROUP: {
      next(apiRequest({ url: GROUP.SORT_GROUP, method: 'POST', body: action.payload, feature: types.SORT_GROUP }));
      break;
    }

    case `${types.DELETE_GROUP}_${API_SUCCESS}`: {
      fetchDetail(dispatch, getState);
      break;
    }

    // interface
    case types.CREATE_INTERFACE: {
      next(apiRequest({
        url: INTERFACE.CREATE_INTERFACE,
        method: 'POST',
        body: action.payload,
        feature: types.CREATE_INTERFACE
      }));
      break;
    }

    case types.UPDATE_INTERFACE: {
      next(apiRequest({
        url: INTERFACE.UPDATE_INTERFACE,
        method: 'POST',
        body: action.payload,
        feature: types.CREATE_INTERFACE
      }));
      break;
    }

    case `${types.CREATE_INTERFACE}_${API_SUCCESS}`:
    case `${types.UPDATE_INTERFACE}_${API_SUCCESS}`: {
      next(actions.setInterface({ data: null, editing: false, saving: false }));
      fetchDetail(dispatch, getState);
      break;
    }

    case `${types.CREATE_INTERFACE}_${API_ERROR}`:
    case `${types.UPDATE_INTERFACE}_${API_ERROR}`: {
      next(actions.setInterface({ saving: false }));
      break;
    }

    case types.DELETE_INTERFACE: {
      next(apiRequest({ url: INTERFACE.DELETE_INTERFACE + action.payload, feature: types.DELETE_INTERFACE }));
      break;
    }

    case types.SORT_INTERFACE: {
      next(apiRequest({
        url: INTERFACE.SORT_INTERFACE,
        method: 'POST',
        body: action.payload,
        feature: types.SORT_INTERFACE
      }));
      break;
    }

    case `${types.DELETE_INTERFACE}_${API_SUCCESS}`: {
      fetchDetail(dispatch, getState);
      break;
    }

    default:
      break;
  }
}
