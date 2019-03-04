import { fetch } from '../utils/fetch'

export default {
  getList() {
    return fetch('/project/getByUser');
  },
  delete(id) {
    return fetch('/project/delete?id=' + id);
  },
  getById(id) {
    return fetch('/project/getById?id=' + id);
  },
  save(project) {
    return fetch('/project/save', {
      type: 'POST',
      data: project,
    });
  },
  getDetail(id) {
    return fetch('/project/detail?id=' + id);
  },
}