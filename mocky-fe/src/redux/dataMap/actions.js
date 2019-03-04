import types from './types';

export default {
  getListStart: () => ({ type: types.getListStart }),
  getListSuccess: dataMaps => ({ type: types.getListSuccess, dataMaps }),
  getListFail: error => ({ type: types.getListFail, error }),

  getDetailStart: () => ({ type: types.getDetailStart }),
  getDetailFail: dataMap => ({ type: types.getDetailSuccess, dataMap }),
  getDetailSuccess: error => ({ type: types.getDetailFail, error }),
}