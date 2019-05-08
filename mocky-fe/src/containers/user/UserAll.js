import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageLayout from '../../components/PageLayout';
import { types, namespace } from '../../redux/model/userAll';
import UserList from '../../components/user/UserList';

class UserAllContainer extends PureComponent {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    const { auth, logout } = this.props;

    return (
      <PageLayout auth={auth} logout={logout}>
        <UserList {...this.props} onStatusChange={this.changeStatus} />
      </PageLayout>
    );
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    this.props.dispatch({ type: types.fetchList });
  };

  changeStatus = (id, status) => {
    this.props.dispatch({ type: types.changeStatus, payload: { id, status: Number(status) } });
  };
}

export default connect(state => ({
  ...state[namespace],
}))(UserAllContainer);
