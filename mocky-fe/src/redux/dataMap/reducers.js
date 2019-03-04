import { combineReducers } from 'redux';
import createReducer from '../../redux/createReducer';
import types from './types';

const dataMapListReducers = createReducer({ fetching: false, data: [], error: null }, {
  [types.getListStart]: (state, action) => {
    return { ...state, fetching: true, error: null };
  },
  [types.getListSuccess]: (state, { dataMaps = [] }) => {
    return { ...state, fetching: false, data: dataMaps };
  },
  [types.getListFail]: (state, { error }) => {
    return { ...state, fetching: false, error };
  },
});

const dataMapDetailReducers = createReducer({ fetching: false, data: {}, error: null }, {
  [types.getDetail]: (state, action) => {
    return { ...state, fetching: true, error: null };
  },
  [types.getDetailSuccess]: (state, { dataMap = {} }) => {
    return { fetching: false, data: dataMap };
  },
  [types.getDetailFail]: (state, { error }) => {
    return { ...state, fetching: false, error };
  },
});

export default combineReducers({
  list: dataMapListReducers,
  detail: dataMapDetailReducers,
});