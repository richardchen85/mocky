import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import LoginForm from '../../components/auth/Login';
import { types } from '../../redux/model/auth';
import MKFooter from '../../components/MKFooter';

class Login extends PureComponent {
  render() {
    const { fetching, user, error } = this.props;

    if (user.id) {
      return <Redirect to={{ pathname: '/' }} />;
    }

    return (
      <div className="page-auth">
        <LoginForm onSubmit={this.submit} fetching={fetching} errorMsg={error} />
        <MKFooter />
      </div>
    );
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
    !fetching && dispatch({ type: types.login, payload: values });
  };
}

export default connect(state => ({
  ...state.auth,
}))(Login);
