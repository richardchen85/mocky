import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, Alert } from 'antd';
import "./index.css";

const FormItem = Form.Item;

class SignUp extends PureComponent {
  static propTypes = {
    form: PropTypes.any,
    onSubmit: PropTypes.func,
    fetching: PropTypes.bool,
    errorMsg: PropTypes.string,
  }

  state = {
    confirmDirty: false,
  }

  render() {
    const { form: { getFieldDecorator }, fetching, errorMsg } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className="signUp-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: '请输入邮箱', whitespace: true },
              { min: 5, message: '邮箱至少5个字符' },
              { type: 'email', message: '请输入正确的邮箱' },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              placeholder="邮箱"
              maxLength={50}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('nickname', {
            rules: [
              { required: true, message: '请输入昵称', whitespace: true },
              { min: 5, message: '昵称至少5个字符' },
              { type: 'string', pattern: /^\w+$/i, message: '昵称只能是数字、字母和下划线组成' },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              placeholder="昵称"
              maxLength={20}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { validator: this.validateToNextPassword },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="密码"
              maxLength={12}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirm', {
            rules: [
              { required: true, message: '请再次输入密码' },
              { validator: this.compareToFirstPassword },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="确认密码"
              maxLength={12}
              onBlur={this.handleConfirmBlur}/>
          )}
        </FormItem>
        {errorMsg && <FormItem><Alert message={errorMsg} type="error"/></FormItem>}
        <FormItem>
          <Button type="primary" htmlType="submit" loading={fetching} className="signUp-form-button">注册</Button>
        </FormItem>
        <FormItem>
          已有账号？<Link to={{ pathname: '/user/login' }}>立即登录</Link>
        </FormItem>
      </Form>
    );
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不符');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }
}

export default Form.create()(SignUp);
