import types from './types';

export default {
  getListStart: () => ({ type: types.getListStart }),
  getListSuccess: projects => ({ type: types.getListSuccess, projects }),
  getListFail: error => ({ type: types.getListFail, error }),

  getDetailStart: () => ({ type: types.getDetailStart }),
  getDetailSuccess: project => ({ type: types.getDetailSuccess, project }),
  getDetailFail: error => ({ type: types.getDetailFail, error }),
}