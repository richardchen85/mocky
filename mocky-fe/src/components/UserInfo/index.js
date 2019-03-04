import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { Icon } from 'antd';
import './index.css';
import api from '../../api/user';

class UserInfo extends PureComponent {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  }

  doLogout = () => {
    api.logout().then(() => {
      this.props.logout();
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    const { auth } = this.props;

    return (
      <div className="userinfo">
        {/* <button className="btn new-project">
          <Icon type="plus-circle" /> 新建项目
        </button> */}
        <span className="nickname">{auth.id ? auth.nickname : '未登录'}</span>
        { auth.id && <button className="btn logout" onClick={this.doLogout}>退出</button> }
      </div>
    )
  }
}

export default UserInfo;