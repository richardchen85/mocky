import { apiRequest } from '../api';
import { AUTH } from '../../constants/url';
import createModel from '../utils/createModel';

export default createModel({
  namespace: 'auth',
  state: { fetching: false, user: {}, error: null },
  reducers: {
    setAuth: (state, { payload }) => ({ ...state, ...payload }),
  },
  effects: {
    signUp: (store, next, action) => {
      next(apiRequest({ url: AUTH.SIGN_UP, method: 'POST', body: action.payload, feature: 'signUp' }));
      next({ type: 'setAuth', payload: { fetching: true, error: null } });
    },
    signUp_API_SUCCESS: (store, next, action) => {
      next({ type: 'setAuth', payload: { fetching: false, user: action.payload || {} } });
    },
    signUp_API_ERROR: (store, next, action) => {
      next({ type: 'setAuth', payload: { fetching: false, error: action.payload.message } });
    },
    login: (store, next, action) => {
      next(apiRequest({ url: AUTH.SIGN_UP, method: 'POST', body: action.payload, feature: 'login' }));
      next({ type: 'setAuth', payload: { fetching: true, error: null } });
    },
    login_API_SUCCESS: (store, next, action) => {
      next({ type: 'setAuth', payload: { fetching: false, user: action.payload || {} } });
    },
    login_API_ERROR: (store, next, action) => {
      next({ type: 'setAuth', payload: { fetching: false, error: action.payload.message } });
    },
    logout: (store, next, action) => {
      next(apiRequest({ url: AUTH.LOGOUT, feature: 'logout' }));
    },
    logout_API_SUCCESS: (store, next, action) => {
      next({ type: 'setAuth', payload: { user: {} } });
    },
  },
});
