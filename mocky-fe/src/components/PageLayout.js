import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon, Layout } from 'antd';
import UserInfo from './UserInfo';
import MKFooter from './MKFooter';

const { Header, Content, Footer } = Layout;

class PageLayout extends PureComponent {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  render() {
    const { auth, logout } = this.props;

    return (
      <Layout>
        <Header>
          <div className={'top-menu'}>
            <NavLink to={'/'} exact={true}>
              <Icon type="home" />
              首页
            </NavLink>
            {auth.isAdmin && (
              <>
                <NavLink to={'/project/all'}>
                  <Icon type="wallet" />
                  项目
                </NavLink>
                <NavLink to={'/user/all'}>
                  <Icon type="user" />
                  用户
                </NavLink>
              </>
            )}
          </div>
          <UserInfo auth={auth} logout={logout} />
        </Header>
        <Content style={{ backgroundColor: '#fff', padding: 15 }}>{this.props.children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          <MKFooter />
        </Footer>
      </Layout>
    );
  }

  componentDidMount() {
    try {
      window._hmt && window._hmt.push(['_trackPageview', window.location.pathname]);
    } catch (e) {
      console.error(e);
    }
  }
}

export default PageLayout;
