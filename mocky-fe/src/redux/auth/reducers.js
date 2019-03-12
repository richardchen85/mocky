import createReducer from '../utils/createReducer';
import types from './types';

export default createReducer({ fetching: false, user: {}, error: null }, {
  [types.SET_AUTH]: (state, { payload }) => {
    return { ...state, ...payload };
  }
});
