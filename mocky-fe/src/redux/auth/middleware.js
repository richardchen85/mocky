import { apiRequest, API_SUCCESS, API_ERROR } from '../api';
import types from './types';
import actions from './actions';
import { AUTH } from '../../constants/url';


export default () => next => action => {
  next(action);

  switch (action.type) {
    case types.SIGN_UP:
      next(apiRequest({ url: AUTH.SIGN_UP, method: 'POST', body: action.payload, feature: types.SIGN_UP }));
      next(actions.setAuth({ fetching: true, error: null }));
      break;

    case types.LOGIN:
      next(apiRequest({ url: AUTH.LOGIN, method: 'POST', body: action.payload, feature: types.LOGIN }));
      next(actions.setAuth({ fetching: true, error: null }));
      break;

    case `${types.SIGN_UP}_${API_SUCCESS}`:
    case `${types.LOGIN}_${API_SUCCESS}`:
      next(actions.setAuth({ fetching: false, user: action.payload || {} }));
      break;

    case `${types.LOGIN}_${API_ERROR}`:
    case `${types.SIGN_UP}_${API_ERROR}`:
      next(actions.setAuth({ fetching: false, error: action.payload.message }));
      break;

    case types.LOGOUT:
      next(apiRequest({ url: AUTH.LOGOUT, feature: types.LOGOUT }));
      break;

    case `${types.LOGOUT}_${API_SUCCESS}`:
      next(actions.setAuth({ user: {} }));
      break;

    default:
      break;
  }
}
