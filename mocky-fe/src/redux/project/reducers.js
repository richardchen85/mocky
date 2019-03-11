import {combineReducers} from 'redux';
import createReducer from '../utils/createReducer';
import types from './types';

const projectListReducers = createReducer({
  fetching: false,
  data: [],
  project: {data: null, editing: false, saving: false}
}, {
  [types.GET_LIST]: (state) => {
    return {...state, fetching: true};
  },
  [types.SET_LIST]: (state, {payload}) => {
    return {...state, fetching: false, data: payload};
  },
  [types.SET_PROJECT]: (state, {payload}) => {
    return {...state, project: {...state.project, ...payload}};
  },
});

const projectDetailReducers = createReducer({
  fetching: false,
  id: null,
  data: {},
  group: {data: null, editing: false, saving: false},
  itface: {data: null, editing: false, saving: false},
}, {
  [types.GET_DETAIL]: (state, {payload}) => {
    return {...state, fetching: true, id: payload};
  },
  [types.SET_DETAIL]: (state, {payload}) => {
    return {...state, fetching: false, data: payload}
  },
  [types.SET_GROUP]: (state, {payload}) => {
    return {...state, group: {...state.group, ...payload}};
  },
  [types.SET_INTERFACE]: (state, {payload}) => {
    return {...state, itface: {...state.itface, ...payload}};
  },
});

export default combineReducers({
  list: projectListReducers,
  detail: projectDetailReducers,
});
