import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './rootReducer';

let middlewares = [
  thunkMiddleware
];

if (window.__DEV__) {
  middlewares.push(createLogger());
}

let store = applyMiddleware(
  ...middlewares
)(createStore)(rootReducer);

if (module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = require('./rootReducer');
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
