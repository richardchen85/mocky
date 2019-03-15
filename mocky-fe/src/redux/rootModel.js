import { combineReducers } from 'redux';
import auth from './auth/auth';

import project from './project';
import dataMap from './dataMap';
import mock from './mock';

import { apiMiddleware } from './api';
import { middleware as projectMiddleware } from './project';
import { middleware as dataMapMiddleware } from './dataMap';
import { middleware as mockMiddleware } from './mock';

const reducer = combineReducers({
  auth: auth.reducer,
  project,
  dataMap,
  mock,
});

const middleware = [
  auth.middleware,
  projectMiddleware,
  dataMapMiddleware,
  mockMiddleware,
  apiMiddleware
];

export {
  reducer,
  middleware,
}
