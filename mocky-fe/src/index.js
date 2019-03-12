import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './css/index.css';

import { get } from './utils/fetch';
import { AUTH } from './constants/url';
import { configureStore } from './redux';
import App from './components/App';

function startRender(preloadState = {}) {
  ReactDOM.render(
    <Provider store={configureStore(preloadState)}>
      <App/>
    </Provider>,
    document.getElementById('root')
  );
}

get(AUTH.GET + Date.now()).then(json => {
  startRender({ auth: { fetching: false, user: json.data, error: null } });
}).catch(() => {
  startRender();
});
