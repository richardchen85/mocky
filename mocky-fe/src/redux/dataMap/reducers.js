import { combineReducers } from 'redux';
import createReducer from '../utils/createReducer';
import types from './types';

const dataMapListReducers = createReducer(
  {
    fetching: false,
    interface_id: 0,
    data: [],
    dataMap: { editing: false, data: null, saving: false },
  },
  {
    [types.GET_LIST]: (state, { payload }) => {
      return { ...state, interface_id: payload, fetching: true };
    },
    [types.SET_LIST]: (state, { payload }) => {
      return { ...state, fetching: false, data: payload };
    },
    [types.SET_DATA_MAP]: (state, { payload }) => {
      return { ...state, dataMap: { ...state.dataMap, ...payload } };
    },
  }
);

export default combineReducers({
  list: dataMapListReducers,
});
