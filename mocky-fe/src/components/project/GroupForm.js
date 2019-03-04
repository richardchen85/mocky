import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';

const formItemProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 },
};

class GroupForm extends PureComponent {
  static propTypes = {
    group: PropTypes.object.isRequired,
    saving: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  render() {
    let { saving, group, onCancel, form: { getFieldDecorator } } = this.props;

    return (
      <Modal
        visible={true}
        title="编辑分组"
        maskClosable={false}
        confirmLoading={saving}
        onCancel={onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item label="名称" {...formItemProps}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入分组名称！' }],
              initialValue: group.name
            })(
              <Input maxLength={20} />
            )}
          </Form.Item>
          <Form.Item label="描述" {...formItemProps}>
            {getFieldDecorator('desc', {
              rules: [{ required: true, message: '请输入分组描述！' }],
              initialValue: group.desc || '-'
            })(
              <Input maxLength={50} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  handleSubmit = () => {
    const { form, onSave, group } = this.props;

    form.validateFields((err, values) => {
      if (!err && onSave) {
        onSave(Object.assign({}, group, values));
      }
    });
  }
}

export default Form.create()(GroupForm);