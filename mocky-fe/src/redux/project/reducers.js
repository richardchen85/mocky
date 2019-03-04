import { combineReducers } from 'redux';
import createReducer from '../../redux/createReducer';
import types from './types';

const projectListReducers = createReducer({ fetching: false, data: [], error: null }, {
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