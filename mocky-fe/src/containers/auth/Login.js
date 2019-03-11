import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import LoginForm from '../../components/auth/Login';
import {actions} from '../../redux/auth';

class Login extends PureComponent {
  render() {
    const {fetching, user, error} = this.props;

    if (user.id) {
      return <Redirect to={{pathname: '/'}}/>
    }

    return (
      <LoginForm onSubmit={this.submit} fetching={fetching} errorMsg={error}/>
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
    const {login, fetching} = this.props;
    !fetching && login(values);
  }
}

export default connect(
  state => ({
    ...state.auth,
  }),
  {
    login: actions.login,
  }
)(Login)
