import { apiRequest, API_SUCCESS, API_ERROR } from '../api';
import actions from './actions';
import types from './types';
import selectors from './selectors';
import { MOCK } from '../../constants/url';

export default ({ dispatch, getState }) => next => action => {
  next(action);

  switch (action.type) {
    case types.GET_LIST: {
      next(
        apiRequest({
          url: MOCK.GET_LIST + action.payload,
          feature: types.GET_LIST,
        })
      );
      break;
    }

    case `${types.GET_LIST}_${API_SUCCESS}`: {
      next(actions.setList(action.payload));
      break;
    }

    case types.GET_MOCK: {
      next(
        apiRequest({
          url: MOCK.GET_MOCK + action.payload,
          feature: types.GET_MOCK,
        })
      );
      break;
    }

    case `${types.GET_MOCK}_${API_SUCCESS}`: {
      next(actions.setMock({ editing: true, data: action.payload }));
      break;
    }

    case types.CREATE: {
      next(
        apiRequest({
          url: MOCK.CREATE,
          method: 'POST',
          body: action.payload,
          feature: types.CREATE,
        })
      );
      break;
    }

    case types.UPDATE: {
      next(
        apiRequest({
          url: MOCK.UPDATE,
          method: 'POST',
          body: action.payload,
          feature: types.UPDATE,
        })
      );
      break;
    }

    case `${types.CREATE}_${API_SUCCESS}`:
    case `${types.UPDATE}_${API_SUCCESS}`: {
      next(actions.setMock({ data: null, editing: false, saving: false }));
      let interfaceId = selectors.getInterfaceId(getState());
      interfaceId && dispatch(actions.getList(interfaceId));
      break;
    }

    case `${types.CREATE}_${API_ERROR}`:
    case `${types.UPDATE}_${API_ERROR}`:
      next(actions.setMock({ saving: false }));
      break;

    case types.DELETE: {
      next(apiRequest({ url: MOCK.DELETE + action.payload, feature: types.DELETE }));
      break;
    }

    case `${types.DELETE}_${API_SUCCESS}`: {
      let interfaceId = selectors.getInterfaceId(getState());
      interfaceId && dispatch(actions.getList(selectors.getInterfaceId(getState())));
      break;
    }

    default:
      break;
  }
};