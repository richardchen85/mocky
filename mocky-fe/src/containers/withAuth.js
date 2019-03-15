import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default function withAuth(WrappedComponent) {
  const WithAuth = props => {
    if (!props.auth || !props.auth.id) {
      return <Redirect to="/user/login" />;
    }

    const logout = () => {
      props.dispatch({ type: 'auth/logout' });
    };

    return <WrappedComponent {...props} logout={logout} />;
  };

  WithAuth.propTypes = {
    auth: PropTypes.object.isRequired,
  };

  return connect(state => ({ auth: state.auth.user }))(WithAuth);
}
