import projectApi from '../../api/project';
import interfaceApi from '../../api/interface';
import groupApi from '../../api/group';
import actions from './actions';

export default {
  getList: () => dispatch => {
    dispatch(actions.getListStart());
    projectApi.getList().then(json => {
      dispatch(actions.getListSuccess(json.data));
    }).catch(error => {
      dispatch(actions.getListFail(error));
    });
  },
  deleteProject: (id) => () => projectApi.delete(id),
  saveProject: (project) => () => projectApi.save(project),
  getDetail: (id) => dispatch => {
    dispatch(actions.getDetailStart());
    projectApi.getDetail(id).then(json => {
      dispatch(actions.getDetailSuccess(json.data));
    }).catch(error => {
      dispatch(actions.getDetailFail(error));
    });
  },
  getProjectById: (id) => () => projectApi.getById(id),

  deleteGroup: (id) => () => groupApi.delete(id),
  createGroup: (group) => () => groupApi.create(group),
  updateGroup: (group) => () => groupApi.update(group),
  sortGroup: (ids) => () => groupApi.sort(ids),

  deleteInterface: (id) => () => interfaceApi.delete(id),
  createInterface: (itf) => () => interfaceApi.create(itf),
  updateInterface: (itf) => () => interfaceApi.update(itf),
  sortInterface: (ids) => () => interfaceApi.sort(ids),
}