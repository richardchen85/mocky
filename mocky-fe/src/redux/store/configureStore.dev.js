import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../rootReducer';
import rootMiddleware from '../rootMiddleware';

const configureStore = preloadedState => {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer, preloadedState, composeEnhancer(applyMiddleware(...rootMiddleware)));

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../rootReducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
