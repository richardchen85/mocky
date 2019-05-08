import { combineReducers } from 'redux';
import auth from './auth';
import projectList from './projectList';
import projectDetail from './projectDetail';
import projectAll from './projectAll';
import mock from './mock';
import dataMap from './dataMap';
import userAll from './userAll';

import { apiMiddleware } from '../api';

const reducer = combineReducers({
  auth: auth.reducer,
  projectList: projectList.reducer,
  projectDetail: projectDetail.reducer,
  projectAll: projectAll.reducer,
  dataMap: dataMap.reducer,
  mock: mock.reducer,
  userAll: userAll.reducer,
});

const middleware = [
  auth.middleware,
  projectList.middleware,
  projectDetail.middleware,
  projectAll.middleware,
  dataMap.middleware,
  mock.middleware,
  userAll.middleware,
  apiMiddleware,
];

export { reducer, middleware };
