import types from './types';

export default {
  signUp: (data) => ({ type: types.SIGN_UP, payload: data }),
  login: (data) => ({ type: types.LOGIN, payload: data }),
  setAuth: (auth) => ({ type: types.SET_AUTH, payload: auth }),
  logout: () => ({ type: types.LOGOUT }),
}
