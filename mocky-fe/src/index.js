import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './css/index.css';

import userApi from './api/user';
import store from './redux/store';
//import Routes from './containers/Routes';
import App from './components/App';
import { actions } from './redux/auth';

function startRender() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}

userApi.getUser().then(json => {
  store.dispatch(actions.loginSuccess(json.data));
  startRender();
}).catch(() => {
  startRender();
});
