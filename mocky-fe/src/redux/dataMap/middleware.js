import {apiRequest, API_SUCCESS, API_ERROR} from '../api';
import actions from './actions';
import types from './types';
import selectors from './selectors';
import {DATA_MAP} from '../../constants/url';

export default ({dispatch, getState}) => next => action => {
  next(action);

  switch (action.type) {
    case types.GET_LIST: {
      next(apiRequest({url: DATA_MAP.GET_LIST + action.payload, feature: types.GET_LIST}));
      break;
    }

    case `${types.GET_LIST}_${API_SUCCESS}`: {
      next(actions.setList(action.payload));
      break;
    }

    case types.CREATE: {
      next(apiRequest({url: DATA_MAP.CREATE, method: 'POST', body: action.payload, feature: types.CREATE}));
      break;
    }

    case types.UPDATE: {
      next(apiRequest({url: DATA_MAP.UPDATE, method: 'POST', body: action.payload, feature: types.UPDATE}));
      break;
    }

    case `${types.CREATE}_${API_SUCCESS}`:
    case `${types.UPDATE}_${API_SUCCESS}`: {
      next(actions.setDataMap({data: null, editing: false, saving: false}));
      dispatch(actions.getList(selectors.getInterfaceId(getState())));
      break;
    }

    case `${types.CREATE}_${API_ERROR}`:
    case `${types.UPDATE}_${API_ERROR}`:
      next(actions.setDataMap({saving: false}));
      break;

    case types.DELETE: {
      next(apiRequest({url: DATA_MAP.DELETE + action.payload, feature: types.DELETE}));
      break;
    }

    case `${types.DELETE}_${API_SUCCESS}`: {
      dispatch(actions.getList(selectors.getInterfaceId(getState())));
      break;
    }

    default:
      break;
  }
}
