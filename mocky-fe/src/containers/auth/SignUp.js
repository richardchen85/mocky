import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SignUpForm from '../../components/auth/SignUp';
import { actions } from '../../redux/auth';
import api from '../../api/user';

class SignUp extends PureComponent {
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
      <SignUpForm onSubmit={this.submit} fetching={fetching} errorMsg={errorMsg} />
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
    if (this.state.fetching) {
      return;
    }

    this.setState({ fetching: true, errorMsg: '' });

    api.signUp(values).then(json => {
      const { signUpSuccess, history } = this.props;
      signUpSuccess(json.data);
      history.push('/');
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
    signUpSuccess: (user) => dispatch(actions.loginSuccess(user)),
  })
)(SignUp)
