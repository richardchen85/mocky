import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select } from 'antd';
import contentTypes from '../../constants/contentTypes';

const formItemProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

class InterfaceForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    saving: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  render() {
    let {
      saving,
      data,
      groups,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Modal
        visible={true}
        title="编辑接口"
        maskClosable={false}
        confirmLoading={saving}
        onCancel={onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item label="名称" {...formItemProps}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入接口名称！' }],
              initialValue: data.name,
            })(<Input maxLength={50} />)}
          </Form.Item>
          <Form.Item label="描述" {...formItemProps}>
            {getFieldDecorator('desc', {
              rules: [{ required: true, message: '请输入接口描述！' }],
              initialValue: data.desc,
            })(<Input maxLength={100} />)}
          </Form.Item>
          <Form.Item label="分组" {...formItemProps}>
            {getFieldDecorator('group_id', {
              initialValue: String(data.group_id),
            })(
              <Select>
                {groups.map(group => (
                  <Select.Option key={group.id}>{group.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="请求路径" {...formItemProps}>
            {getFieldDecorator('url', {
              rules: [
                { required: true, message: '请输入接口请求路径！' },
                { pattern: /^\/.*/, message: '请求路径必须以 / 开头！' },
              ],
              initialValue: data.url,
            })(<Input maxLength={100} placeholder="只填路径部分，如：/home/index" />)}
          </Form.Item>
          <Form.Item label="请求类型" {...formItemProps}>
            {getFieldDecorator('method', {
              rules: [{ required: true, message: '请输入接口类型！' }],
              initialValue: data.method || 'get',
            })(
              <Select>
                <Select.Option key={'get'}>get</Select.Option>
                <Select.Option key={'post'}>post</Select.Option>
                <Select.Option key={'put'}>put</Select.Option>
                <Select.Option key={'delete'}>delete</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="内容格式" {...formItemProps}>
            {getFieldDecorator('content_type', {
              rules: [{ required: true, message: '请输入接口类型！' }],
              initialValue: (data.content_type && String(data.content_type)) || '1',
            })(
              <Select>
                {contentTypes.types.map(type => (
                  <Select.Option key={type.key}>{type.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="jsonp回调key" {...formItemProps}>
            {getFieldDecorator('jsonp_callback', {
              initialValue: data.jsonp_callback,
            })(<Input placeholder="callback" maxLength={50} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  handleSubmit = () => {
    const { form, onSave, data } = this.props;

    form.validateFields((err, values) => {
      if (!err && onSave) {
        let content_type = parseInt(values.content_type, 10);
        let group_id = parseInt(values.group_id, 10);
        onSave(
          Object.assign({}, data, {
            ...values,
            content_type,
            group_id,
          })
        );
      }
    });
  };
}

export default Form.create()(InterfaceForm);
