import { combineReducers } from 'redux';
import auth from './auth';
import projectList from './projectList';
import projectDetail from './projectDetail';
import mock from './mock';
import dataMap from './dataMap';

import { apiMiddleware } from '../api';

const reducer = combineReducers({
  auth: auth.reducer,
  projectList: projectList.reducer,
  projectDetail: projectDetail.reducer,
  dataMap: dataMap.reducer,
  mock: mock.reducer,
});

const middleware = [
  auth.middleware,
  projectList.middleware,
  projectDetail.middleware,
  dataMap.middleware,
  mock.middleware,
  apiMiddleware
];

export {
  reducer,
  middleware,
}
