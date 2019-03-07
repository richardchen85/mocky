import createReducer from '../utils/createReducer';
import types from './types';

export default createReducer({}, {
  [types.loginSuccess]: (state, { user }) => {
    return user || {};
  },
  [types.logout]: () => {
    return {}
  },
});
