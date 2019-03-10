import {apiRequest, API_SUCCESS, API_ERROR} from '../api';
import types from './types';
import actions from './actions';
import selectors from './selectors';

const URL_GET_LIST = '/project/getByUser';
const URL_GET_PROJECT = '/project/getById?id=';
const URL_SAVE_PROJECT = '/project/save';
const URL_DELETE_PROJECT = '/project/delete?id=';
const URL_GET_DETAIL = '/project/detail?id=';

const URL_CREATE_GROUP = '/group/create';
const URL_UPDATE_GROUP = '/group/update';
const URL_DELETE_GROUP = '/group/remove?id=';
const URL_SORT_GROUP = '/group/sort';

const URL_CREATE_INTERFACE = '/interface/create';
const URL_UPDATE_INTERFACE = '/interface/update';
const URL_DELETE_INTERFACE = '/interface/remove?id=';
const URL_SORT_INTERFACE = '/interface/sort';

const fetchDetail = (id) => {
  return apiRequest({url: URL_GET_DETAIL + id, feature: types.GET_DETAIL});
};

export default ({dispatch, getState}) => next => action => {
  next(action);

  switch (action.type) {
    // project list
    case types.GET_LIST:
      next(apiRequest({url: URL_GET_LIST, feature: types.GET_LIST}));
      break;

    case `${types.GET_LIST}_${API_SUCCESS}`:
      next(actions.setList(action.payload));
      break;

    case types.GET_PROJECT:
      next(apiRequest({url: URL_GET_PROJECT + action.payload, feature: types.GET_PROJECT}));
      break;

    case `${types.GET_PROJECT}_${API_SUCCESS}`:
      next(actions.setProject({data: action.payload, editing: true}));
      break;

    case types.SAVE_PROJECT:
      next(apiRequest({url: URL_SAVE_PROJECT, method: 'POST', body: action.payload, feature: types.SAVE_PROJECT}));
      break;

    case `${types.SAVE_PROJECT}_${API_SUCCESS}`:
      next(actions.setProject({data: null, editing: false, saving: false}));
      dispatch(actions.getList());
      break;

    case `${types.SAVE_PROJECT}_${API_ERROR}`:
      next(actions.setProject({saving: false}));
      break;

    case types.DELETE_PROJECT:
      next(apiRequest({url: URL_DELETE_PROJECT + action.payload, feature: types.DELETE_PROJECT}));
      break;

    case `${types.DELETE_PROJECT}_${API_SUCCESS}`:
      dispatch(actions.getList());
      break;

    // project detail
    case types.GET_DETAIL:
      next(fetchDetail(action.payload));
      break;

    case `${types.GET_DETAIL}_${API_SUCCESS}`:
      next(actions.setDetail(action.payload));
      break;

    // group
    case types.CREATE_GROUP:
      next(apiRequest({url: URL_CREATE_GROUP, method: 'POST', body: action.payload, feature: types.CREATE_GROUP}));
      break;

    case types.UPDATE_GROUP:
      next(apiRequest({url: URL_UPDATE_GROUP, method: 'POST', body: action.payload, feature: types.CREATE_GROUP}));
      break;

    case `${types.CREATE_GROUP}_${API_SUCCESS}`:
    case `${types.UPDATE_GROUP}_${API_SUCCESS}`:
      next(actions.setGroup({data: null, editing: false, saving: false}));
      dispatch(fetchDetail(selectors.selectDetail(getState()).id));
      break;

    case `${types.CREATE_GROUP}_${API_ERROR}`:
    case `${types.UPDATE_GROUP}_${API_ERROR}`:
      next(actions.setGroup({saving: false}));
      break;

    case types.DELETE_GROUP:
      next(apiRequest({url: URL_DELETE_GROUP + action.payload, feature: types.DELETE_GROUP}));
      break;

    case types.SORT_GROUP:
      next(apiRequest({url: URL_SORT_GROUP, method: 'POST', body: action.payload, feature: types.SORT_GROUP}));
      break;

    case `${types.DELETE_GROUP}_${API_SUCCESS}`:
      dispatch(fetchDetail(selectors.selectDetail(getState()).id));
      break;

    // interface
    case types.CREATE_INTERFACE:
      next(apiRequest({url: URL_CREATE_INTERFACE, method: 'POST', body: action.payload, feature: types.CREATE_INTERFACE}));
      break;

    case types.UPDATE_INTERFACE:
      next(apiRequest({url: URL_UPDATE_INTERFACE, method: 'POST', body: action.payload, feature: types.CREATE_INTERFACE}));
      break;

    case `${types.CREATE_INTERFACE}_${API_SUCCESS}`:
    case `${types.UPDATE_INTERFACE}_${API_SUCCESS}`:
      next(actions.setInterface({data: null, editing: false, saving: false}));
      dispatch(fetchDetail(selectors.selectDetail(getState()).id));
      break;

    case `${types.CREATE_INTERFACE}_${API_ERROR}`:
    case `${types.UPDATE_INTERFACE}_${API_ERROR}`:
      next(actions.setInterface({saving: false}));
      break;

    case types.DELETE_INTERFACE:
      next(apiRequest({url: URL_DELETE_INTERFACE + action.payload, feature: types.DELETE_INTERFACE}));
      break;

    case types.SORT_INTERFACE:
      next(apiRequest({url: URL_SORT_INTERFACE, method: 'POST', body: action.payload, feature: types.SORT_INTERFACE}));
      break;

    case `${types.DELETE_INTERFACE}_${API_SUCCESS}`:
      dispatch(fetchDetail(selectors.selectDetail(getState()).id));
      break;

    default:
      break;
  }
}
