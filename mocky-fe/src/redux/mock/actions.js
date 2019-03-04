import types from './types';

export default {
  getListStart: () => ({ type: types.getListStart }),
  getListSuccess: mocks => ({ type: types.getListSuccess, mocks }),
  getListFail: error => ({ type: types.getListFail, error }),

  getDetailStart: () => ({ type: types.getDetailStart }),
  getDetailFail: mock => ({ type: types.getDetailSuccess, mock }),
  getDetailSuccess: error => ({ type: types.getDetailFail, error }),
}