import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import LoginForm from '../../components/auth/Login';

class Login extends PureComponent {
  render() {
    const { fetching, user, error } = this.props;

    if (user.id) {
      return <Redirect to={{ pathname: '/' }} />;
    }

    return <LoginForm onSubmit={this.submit} fetching={fetching} errorMsg={error} />;
  }

  componentDidMount() {
    try {
      window._hmt && window._hmt.push(['_trackPageview', window.location.pathname]);
    } catch (e) {
      console.error(e);
    }
  }

  submit = values => {
    const { dispatch, fetching } = this.props;
    !fetching && dispatch({ type: 'auth/login', payload: values });
  };
}

export default connect(state => ({
  ...state.auth,
}))(Login);
