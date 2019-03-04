import { fetch } from '../utils/fetch'

export default {
  getByProject(projectId) {
    return fetch('/interface/getByProject?projectId=' + projectId);
  },
  delete(id) {
    return fetch('/interface/remove?id=' + id);
  },
  create(itf) {
    return fetch('/interface/create', {
      type: 'POST',
      data: itf,
    })
  },
  update(itf) {
    return fetch('/interface/update', {
      type: 'POST',
      data: itf,
    })
  },
  sort(ids) {
    return fetch('/interface/sort', { type: 'POST', data: { ids }});
  }
}