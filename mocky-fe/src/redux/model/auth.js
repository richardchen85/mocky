import { apiRequest } from '../api';
import { AUTH } from '../../constants/url';
import createModel from '../utils/createModel';

const namespace = 'auth';

export const types = {
  signUp: `${namespace}/signUp`,
  login: `${namespace}/login`,
  setAuth: `${namespace}/setAuth`,
  logout: `${namespace}/logout`,
};

export default createModel({
  namespace: namespace,
  state: { fetching: false, user: {}, error: null },
  reducers: {
    setAuth: (state, { payload }) => ({ ...state, ...payload }),
  },
  effects: {
    signUp: (store, next, { payload }) => {
      next({ type: types.setAuth, payload: { fetching: true, error: null } });
      next(
        apiRequest({
          url: AUTH.SIGN_UP,
          method: 'POST',
          body: payload,
          feature: types.signUp,
          toastError: false,
          success: data => {
            next({ type: types.setAuth, payload: { fetching: false, user: data || {} } });
          },
          error: errorMsg => {
            next({ type: types.setAuth, payload: { fetching: false, error: errorMsg } });
          },
        })
      );
    },
    login: (store, next, { payload }) => {
      next({ type: types.setAuth, payload: { fetching: true, error: null } });
      next(
        apiRequest({
          url: AUTH.LOGIN,
          method: 'POST',
          body: payload,
          feature: types.login,
          toastError: false,
          success: data => {
            next({ type: types.setAuth, payload: { fetching: false, user: data || {} } });
          },
          error: errorMsg => {
            next({ type: types.setAuth, payload: { fetching: false, error: errorMsg } });
          },
        })
      );
    },
    logout: (store, next) => {
      next(
        apiRequest({
          url: AUTH.LOGOUT,
          feature: types.logout,
          success: () => {
            next({ type: types.setAuth, payload: { user: {} } });
          },
        })
      );
    },
  },
});
