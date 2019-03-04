import api from '../../api/dataMap';
import actions from './actions';

export default {
  getList: (interfaceId) => (dispatch) => {
    dispatch(actions.getListStart());
    api.getByInterface(interfaceId).then(json => {
      dispatch(actions.getListSuccess(json.data));
    }).catch(error => {
      dispatch(actions.getListFail(error));
    });
  },
  delete: (id) => () => api.delete(id),
  create: (itf) => () => api.create(itf),
  update: (itf) => () => api.update(itf),
}