import {PROJECTS, GET_LIST, setList, GET_DETAIL, setDetail} from './actions';
import {apiRequest, API_SUCCESS} from '../api';

const URL_GET_LIST = '/project/getByUser';
const URL_GET_DETAIL = '/project/detail?id=';

export default () => next => action => {
  next(action);

  switch (action.type) {
    case GET_LIST:
      next(apiRequest({url: URL_GET_LIST, feature: PROJECTS}));
      break;

    case `${PROJECTS}_${API_SUCCESS}`:
      next(setList(action.payload));
      break;

    case GET_DETAIL:
      next(apiRequest({url: URL_GET_DETAIL + action.payload, feature: PROJECTS}));
      break;

    case `${PROJECTS_${API_SU}}`

    default:
      break;
  }

}
