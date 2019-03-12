import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import UserInfo from './UserInfo';

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
          <div id="logo">mocky</div>
          <UserInfo auth={auth} logout={logout} />
        </Header>
        <Content style={{ backgroundColor: '#fff', padding: 15 }}>{this.props.children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          <p>
            Created by Richard Chen &nbsp;&nbsp;
            <a href="mailto:clq_web@126.com">clq_web@126.com</a>
          </p>
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
