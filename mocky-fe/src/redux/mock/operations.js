import api from '../../api/mock';
import actions from './actions';

export default {
  getList: (interfaceId) => dispatch => {
    dispatch(actions.getListStart());
    api.getByInterface(interfaceId).then(json => {
      dispatch(actions.getListSuccess(json.data));
    }).catch(error => {
      dispatch(actions.getListFail(error));
    });
  },
  delete: (id) => () => api.delete(id),
  create: (mock) => () => api.create(mock),
  update: (mock) => () => api.update(mock),
  getById: (id) => () => api.getById(id),
}