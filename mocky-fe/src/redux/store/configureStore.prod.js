import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../rootReducer';
import rootMiddleware from '../rootMiddleware';

const configureStore = (preloadedState) => {
  return createStore(
    rootReducer,
    preloadedState,
    compose(applyMiddleware(...rootMiddleware))
  );
};

export default configureStore;
