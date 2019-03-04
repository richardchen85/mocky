import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import LoginForm from '../../components/auth/Login';
import { actions } from '../../redux/auth';
import api from '../../api/user';

class Login extends PureComponent {
  state = {
    fetching: false,
    errorMsg: '',
  }

  render() {
    const { fetching, errorMsg } = this.state;
    const { auth } = this.props;

    if (auth.id) {
      return <Redirect to={{pathname: '/'}} />
    }

    return (
      <LoginForm onSubmit={this.submit} fetching={fetching} errorMsg={errorMsg} />
    )
  }

  componentDidMount() {
    try {
      window._hmt && window._hmt.push(['_trackPageview', window.location.pathname]);
    } catch (e) {
      console.error(e);
    }
  }

  submit = (values) => {
    if (this.state.fetching) return;

    this.setState({ fetching: true, errorMsg: '' });

    api.login(values).then(json => {
      const { history, loginSuccess } = this.props;
      const { pathname } = history.location;
      loginSuccess(json.data);
      if (pathname !== '/user/login') {
        history.push(pathname);
      } else {
        history.push('/');
      }
    }).catch(error => {
      this.setState({ fetching: false, errorMsg: error.message });
    });
  }
}

export default connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => ({
    loginSuccess: (user) => dispatch(actions.loginSuccess(user)),
  })
)(Login)
