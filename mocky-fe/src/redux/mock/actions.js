import types from './types';

export default {
  getList: (interfaceId) => ({type: types.GET_LIST, payload: interfaceId}),
  setList: (mocks) => ({type: types.SET_LIST, payload: mocks}),
  getMock: (id) => ({type: types.GET_MOCK, payload: id}),
  setMock: (mock) => ({type: types.SET_MOCKS, payload: mock}),
  delete: (id) => ({type: types.DELETE, payload: id}),
  create: (mock) => ({type: types.CREATE, payload: mock}),
  update: (mock) => ({type: types.UPDATE, payload: mock}),
}
