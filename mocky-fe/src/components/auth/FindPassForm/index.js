import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Alert } from 'antd';
import './index.css';
import { EMAIL_CODE_COUNTDOWN } from '../../../constants/common';
import { post } from '../../../utils/fetch';
import { SEMD_MAIL } from '../../../constants/url';
import {Link} from "react-router-dom";

const FormItem = Form.Item;

class FindPassForm extends PureComponent {
  static propTypes = {
    form: PropTypes.any,
    onSubmit: PropTypes.func,
    fetching: PropTypes.bool,
    errorMsg: PropTypes.string,
  };

  state = {
    emailSending: false,
    counting: 0,
    confirmDirty: false,
  };

  render() {
    const { counting, emailSending } = this.state;
    const {
      form: { getFieldDecorator },
      fetching,
      errorMsg,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    return (
      <Form onSubmit={this.handleSubmit} className="findPass-form" {...formItemLayout}>
        <FormItem label={'邮箱'}>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: '请输入邮箱', whitespace: true },
              { min: 5, message: '邮箱至少5个字符' },
              { type: 'email', message: '请输入正确的邮箱' },
            ],
          })(<Input maxLength={50} />)}
        </FormItem>
        <FormItem label={'邮箱验证码'}>
          {getFieldDecorator('mail_code', {
            rules: [{ required: true, message: '请输入邮件验证码', whitespace: true }],
          })(<Input maxLength={20} />)}
          <Button htmlType={'button'} disabled={!!counting} onClick={this.sendMailCode} loading={emailSending}>
            {!!counting ? `请${counting}秒后再获取新验证码` : '获取邮箱验证码'}
          </Button>
        </FormItem>
        <FormItem label={'新密码'}>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { validator: this.validateToNextPassword },
            ],
          })(<Input type="password" maxLength={12} />)}
        </FormItem>
        <FormItem label={'确认新密码'}>
          {getFieldDecorator('confirm', {
            rules: [{ required: true, message: '请再次输入密码' }, { validator: this.compareToFirstPassword }],
          })(<Input type="password" maxLength={12} onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        {errorMsg && (
          <FormItem wrapperCol={{ offset: 6 }}>
            <Alert message={errorMsg} type="error" />
          </FormItem>
        )}
        <FormItem wrapperCol={{ offset: 6 }}>
          <Button type="primary" htmlType="submit" loading={fetching} className="signUp-form-button">
            找回密码
          </Button>
        </FormItem>
        <FormItem>
          <Link to={{ pathname: '/user/login' }}>&lt; 返回登录</Link>
        </FormItem>
      </Form>
    );
  }

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不符');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  sendMailCode = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields(['email'], (errors, values) => {
      if (errors) return;
      this.setState({ emailSending: true });
      post(SEMD_MAIL.SEND, { type: 1, email: values.email }, { toastSuccess: true })
        .then(() => {
          this.setState({
            counting: EMAIL_CODE_COUNTDOWN,
            emailSending: false,
          });
          this.startCountDown();
        })
        .catch(() => {
          this.setState({
            emailSending: false,
          });
        });
    });
  };

  startCountDown() {
    setTimeout(() => {
      if (!!this.state.counting) {
        this.setState(
          state => ({
            counting: state.counting - 1,
          }),
          () => {
            !!this.state.counting && this.startCountDown();
          }
        );
      }
    }, 1000);
  }
}

export default Form.create()(FindPassForm);
