import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';
import CodeArea from '../CodeArea';

const formItemProps = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

class MockForm extends PureComponent {
  static propTypes = {
    mode: PropTypes.any.isRequired,
    saving: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  render() {
    const { mode, saving, data, onCancel, form: { getFieldDecorator } } = this.props;

    return (
      <Modal
        visible={true}
        title="编辑模拟数据"
        maskClosable={false}
        confirmLoading={saving}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        width={1000}
      >
        <Form>
          <Form.Item label="名称" {...formItemProps}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入数据名称！' }],
              initialValue: data.name
            })(
              <Input maxLength={100} />
            )}
          </Form.Item>
          <Form.Item label="HTTP状态码" {...formItemProps}>
            {getFieldDecorator('status_code', {
              rules: [{ required: true, message: '请输入HTTP状态码！' }],
              initialValue: data.status_code || 200
            })(
              <Input maxLength={3} type="number" />
            )}
          </Form.Item>
          <Form.Item label="内容" {...formItemProps}>
            {getFieldDecorator('body', {
              rules: [{ required: true, message: '请输入内容！' }],
              initialValue: data.body
            })(
              <CodeArea mode={mode} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  handleSubmit = () => {
    const { form, onSave, data: { project_id, interface_id, id, } } = this.props;

    form.validateFields((err, values) => {
      if (!err && onSave) {
        onSave({
          id,
          project_id,
          interface_id,
          ...values,
          status_code: Number(values.status_code),
        });
      }
    });
  }
}

export default Form.create()(MockForm);