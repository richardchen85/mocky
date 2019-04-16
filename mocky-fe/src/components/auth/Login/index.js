import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, Checkbox, Alert } from 'antd';
import './index.css';

const FormItem = Form.Item;

class Login extends PureComponent {
  static propTypes = {
    form: PropTypes.any,
    onSubmit: PropTypes.func,
    fetching: PropTypes.bool,
    errorMsg: PropTypes.string,
  };

  render() {
    const {
      form: { getFieldDecorator },
      fetching,
      errorMsg,
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: '请输入邮箱' },
              { min: 5, message: '邮箱至少5个字符' },
              { type: 'email', message: '请输入正确的邮箱' },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="邮箱"
              maxLength={50}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6个字符' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
              maxLength={12}
            />
          )}
        </FormItem>
        {errorMsg && (
          <FormItem>
            <Alert message={errorMsg} type="error" />
          </FormItem>
        )}
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>30天免登录</Checkbox>)}
          <Button type="primary" htmlType="submit" loading={fetching} className="login-form-button">
            登录
          </Button>
        </FormItem>
        <FormItem>
          没有用户？<Link to={{ pathname: '/user/signUp' }}>立即注册</Link>
          <Link to={{ pathname: '/user/findPassword' }} style={{ marginLeft: 40 }}>
            找回密码
          </Link>
        </FormItem>
      </Form>
    );
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };
}

export default Form.create()(Login);
