import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';
import UserSelect from '../UserSelect';

const formItemProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

class ProjectEdit extends PureComponent {
  render() {
    let {
      fetching,
      project,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;
    project = project || {};
    const members = project.members
      ? project.members.map(user => {
          return { key: user.id, label: user.nickname };
        })
      : [];

    return (
      <Modal
        visible={true}
        title="编辑项目"
        maskClosable={false}
        confirmLoading={fetching}
        onCancel={onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item label="名称" {...formItemProps}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入项目名称！' }],
              initialValue: project.name,
            })(<Input maxLength={50} />)}
          </Form.Item>
          <Form.Item label="描述" {...formItemProps}>
            {getFieldDecorator('desc', {
              rules: [{ required: true, message: '请输入项目描述！' }],
              initialValue: project.desc,
            })(<Input maxLength={100} />)}
          </Form.Item>
          <Form.Item label="成员" {...formItemProps}>
            {getFieldDecorator('members', {
              initialValue: members,
            })(<UserSelect style={{ width: 350 }} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  handleSubmit = () => {
    const { form, onOk, project } = this.props;

    form.validateFields((err, values) => {
      if (!err && onOk) {
        onOk({
          id: project ? project.id : null,
          ...values,
          members: values.members.map(d => parseInt(d.key, 10)),
        });
      }
    });
  };
}

export default Form.create()(ProjectEdit);
