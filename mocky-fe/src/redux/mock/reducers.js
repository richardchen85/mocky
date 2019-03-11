import {combineReducers} from 'redux';
import createReducer from '../utils/createReducer';
import types from './types';

const mockListReducers = createReducer({
  fetching: false,
  interface_id: null,
  data: [],
  mock: {editing: false, data: null, saving: false}
}, {
  [types.GET_LIST]: (state, {payload}) => {
    return {...state, interface_id: payload, fetching: true};
  },
  [types.SET_LIST]: (state, {payload}) => {
    return {...state, fetching: false, data: payload};
  },
  [types.SET_MOCKS]: (state, {payload}) => {
    return {...state, mock: {...state.mock, ...payload}};
  },
});

export default combineReducers({
  list: mockListReducers,
});
