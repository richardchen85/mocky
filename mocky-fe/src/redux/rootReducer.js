import { combineReducers } from 'redux';
// import auth from './auth';
import project from './project';
import dataMap from './dataMap';
import mock from './mock';

export default combineReducers({
  // auth,
  project,
  dataMap,
  mock,
});
