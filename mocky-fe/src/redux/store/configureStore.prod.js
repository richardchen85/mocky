import { createStore, applyMiddleware, compose } from 'redux';
import { reducer, middleware } from '../model';

const configureStore = preloadedState => {
  return createStore(reducer, preloadedState, compose(applyMiddleware(...middleware)));
};

export default configureStore;
