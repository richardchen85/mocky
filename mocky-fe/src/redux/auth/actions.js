import types from './types';

const loginSuccess = user => ({ type: types.loginSuccess, user });
const logout = () => ({ type: types.logout });

export default {
  loginSuccess,
  logout,
}
