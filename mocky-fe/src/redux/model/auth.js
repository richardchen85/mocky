import { apiRequest, API_SUCCESS, API_ERROR } from '../api';
import { AUTH } from '../../constants/url';
import createModel from '../utils/createModel';

export default createModel({
  namespace: 'auth',
  state: { fetching: false, user: {}, error: null },
  reducers: {
    setAuth: (state, { payload }) => ({ ...state, ...payload }),
  },
  effects: {
    signUp: (store, next, { payload }) => {
      next(apiRequest({ url: AUTH.SIGN_UP, method: 'POST', body: payload, feature: 'auth/signUp' }));
      next({ type: 'auth/setAuth', payload: { fetching: true, error: null } });
    },
    [`signUp_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'auth/setAuth', payload: { fetching: false, user: payload || {} } });
    },
    [`signUp_${API_ERROR}`]: (store, next, { payload }) => {
      next({ type: 'auth/setAuth', payload: { fetching: false, error: payload.message } });
    },
    login: (store, next, { payload }) => {
      next(apiRequest({ url: AUTH.LOGIN, method: 'POST', body: payload, feature: 'auth/login' }));
      next({ type: 'auth/setAuth', payload: { fetching: true, error: null } });
    },
    [`login_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'auth/setAuth', payload: { fetching: false, user: payload || {} } });
    },
    [`login_${API_ERROR}`]: (store, next, { payload }) => {
      next({ type: 'auth/setAuth', payload: { fetching: false, error: payload.message } });
    },
    logout: (store, next, { payload }) => {
      next(apiRequest({ url: AUTH.LOGOUT, feature: 'auth/logout' }));
    },
    [`logout_${API_SUCCESS}`]: (store, next, { payload }) => {
      next({ type: 'auth/setAuth', payload: { user: {} } });
    },
  },
});
