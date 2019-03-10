import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './css/index.css';

import userApi from './api/user';
import { configureStore } from './redux';
import App from './components/App';

function startRender(preloadState = {}) {
  ReactDOM.render(
    <Provider store={configureStore(preloadState)}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}

userApi.getUser().then(json => {
  startRender({auth: {fetching: false, user: json.data, error: null}});
}).catch(() => {
  startRender();
});
