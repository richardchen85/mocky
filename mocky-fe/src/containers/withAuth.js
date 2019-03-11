import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {actions} from '../redux/auth';

export default function withAuth(WrappedComponent) {
  const WithAuth = props => {
    if (!props.auth || !props.auth.id) {
      return <Redirect to="/user/login"/>;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuth.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  return connect(
    state => ({
      auth: state.auth.user
    }),
    {
      logout: actions.logout,
    }
  )(WithAuth);
}
