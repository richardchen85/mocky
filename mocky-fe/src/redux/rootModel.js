import { combineReducers } from 'redux';
import auth from './model/auth';
import mock from './model/mock';

import project from './project';
import dataMap from './dataMap';

import { apiMiddleware } from './api';
import { middleware as projectMiddleware } from './project';
import { middleware as dataMapMiddleware } from './dataMap';

const reducer = combineReducers({
  auth: auth.reducer,
  project,
  dataMap,
  mock: mock.reducer,
});

const middleware = [
  auth.middleware,
  projectMiddleware,
  dataMapMiddleware,
  mock.middleware,
  apiMiddleware
];

export {
  reducer,
  middleware,
}
