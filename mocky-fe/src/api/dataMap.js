import { fetch } from '../utils/fetch'

export default {
  getByInterface(interfaceId) {
    return fetch('/dataMap/list?interface_id=' + interfaceId);
  },
  delete(id) {
    return fetch('/dataMap/remove?id=' + id);
  },
  create(dataMap) {
    return fetch('/dataMap/create', { type: 'POST', data: dataMap });
  },
  update(dataMap) {
    return fetch('/dataMap/update', { type: 'POST', data: dataMap });
  },
}