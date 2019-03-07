import { combineReducers } from 'redux';
import createReducer from '../utils/createReducer';
import types from './types';

const mockListReducers = createReducer({ fetching: false, data: [], error: null }, {
  [types.getListStart]: (state, action) => {
    return { ...state, fetching: true, error: null };
  },
  [types.getListSuccess]: (state, { mocks = [] }) => {
    return { ...state, fetching: false, data: mocks };
  },
  [types.getListFail]: (state, { error }) => {
    return { ...state, fetching: false, error };
  },
});

const mockDetailReducers = createReducer({ fetching: false, data: {}, error: null }, {
  [types.getDetail]: (state, action) => {
    return { ...state, fetching: true };
  },
  [types.getDetailSuccess]: (state, { mock = {} }) => {
    return { fetching: false, data: mock };
  },
  [types.getDetailFail]: (state, { error }) => {
    return { ...state, fetching: false, error };
  },
});

export default combineReducers({
  list: mockListReducers,
  detail: mockDetailReducers,
});
