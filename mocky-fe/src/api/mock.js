import { fetch } from '../utils/fetch'

export default {
  getByInterface(interfaceId) {
    return fetch('/mock/list?interface_id=' + interfaceId);
  },
  delete(mockId) {
    return fetch('/mock/remove?id=' + mockId);
  },
  create(mock) {
    return fetch('/mock/create', { type: 'POST', data: mock });
  },
  update(mock) {
    return fetch('/mock/update', { type: 'POST', data: mock });
  },
  getById(mockId) {
    return fetch('/mock/detail?id=' + mockId);
  }
}