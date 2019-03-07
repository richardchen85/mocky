import { combineReducers } from 'redux';
import createReducer from '../utils/createReducer';
import types from './types';
import {GET_LIST, SET_LIST, GET_DETAIL, SET_DETAIL} from './actions';

const projectListReducers = createReducer({ fetching: false, data: [] }, {
  [GET_LIST]: (state) => {
    return {...state, fetching: true};
  },
  [SET_LIST]: (state, {payload}) => {
    return {...state, fetching: false, data: payload};
  },

  [GET_DETAIL]: (state) => {
    return {...state, fetching: true};
  },
  [SET_DETAIL]: (state, {payload}) => {
    return {...state, fetching: false, data: payload}
  },


  [types.getListStart]: (state, action) => {
    return { ...state, fetching: true, error: null };
  },
  [types.getListSuccess]: (state, { projects = [] }) => {
    return { ...state, fetching: false, data: projects };
  },
  [types.getListFail]: (state, { error }) => {
    return { ...state, fetching: false, error };
  },
});

const projectDetailReducers = createReducer({ fetching: false, data: {}, error: null }, {
  [types.getDetail]: (state, action) => {
    return { ...state, fetching: true, error: null };
  },
  [types.getDetailSuccess]: (state, { project = {} }) => {
    return { ...state, fetching: false, data: project };
  },
  [types.getDetailFail]: (state, { error }) => {
    return { ...state, fetching: false, error };
  },
});

export default combineReducers({
  list: projectListReducers,
  detail: projectDetailReducers,
});
