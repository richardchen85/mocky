import { fetch } from '../utils/fetch'

export default {
  create(group) {
    return fetch('/group/create', {
      type: 'POST',
      data: group,
    });
  },
  update(group) {
    return fetch('/group/update', {
      type: 'POST',
      data: group,
    });
  },
  delete(id) {
    return fetch('/group/remove?id=' + id);
  },
  getById(id) {
    return fetch('/group/detail?id=' + id);
  },
  sort(ids) {
    return fetch('/group/sort', { type: 'POST', data: { ids } });
  }
}