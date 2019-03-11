import types from './types';

export default {
  getList: (interfaceId) => ({type: types.GET_LIST, payload: interfaceId}),
  setList: (dataMaps) => ({type: types.SET_LIST, payload: dataMaps}),
  setDataMap: (dataMap) => ({type: types.SET_DATA_MAP, payload: dataMap}),
  delete: (id) => ({type: types.DELETE, payload: id}),
  create: (dataMap) => ({type: types.CREATE, payload: dataMap}),
  update: (dataMap) => ({type: types.UPDATE, payload: dataMap}),
}
