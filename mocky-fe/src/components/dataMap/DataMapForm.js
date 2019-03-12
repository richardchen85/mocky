import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select, Switch } from 'antd';
import dataMapFroms from '../../constants/dataMapFroms';

const formItemProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

class DataMapForm extends PureComponent {
  static propTypes = {
    saving: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  state = {
    from: this.props.data.from,
  }

  render() {
    const { saving, data, onCancel, form: { getFieldDecorator } } = this.props;
    const noFrom = this.state.from === dataMapFroms.froms[0].key;

    return (
      <Modal
        visible={true}
        title="编辑数据映射规则"
        maskClosable={false}
        confirmLoading={saving}
        onCancel={onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item label="名称" {...formItemProps}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入映射名称！' }],
              initialValue: data.name
            })(
              <Input maxLength={50}/>
            )}
          </Form.Item>
          <Form.Item label="匹配来源" {...formItemProps}>
            {getFieldDecorator('from', {
              rules: [{ required: true, message: '请选择匹配来源！' }],
              initialValue: String(data.from)
            })(
              <Select onChange={this.onFromChanged}>
                {dataMapFroms.froms.map(d => (
                  <Select.Option key={d.key}>{d.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {!noFrom && (
            <>
              <Form.Item label="匹配规则" {...formItemProps}>
                {getFieldDecorator('match', {
                  rules: [{ required: true, message: '请输入匹配规则！' }],
                  initialValue: data.match
                })(
                  <Input maxLength={100}/>
                )}
              </Form.Item>
              <Form.Item label="使用正则" {...formItemProps}>
                {getFieldDecorator('regex', {
                  valuePropName: 'checked',
                  initialValue: Boolean(data.regex)
                })(
                  <Switch/>
                )}
              </Form.Item>
            </>
          )}
          <Form.Item label="mock_id" {...formItemProps}>
            {getFieldDecorator('mock_id', {
              rules: [{ required: noFrom, message: '请输入要映射的mock_id！' }],
              initialValue: data.mock_id
            })(
              <Input maxLength={50}/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  onFromChanged = (value) => {
    this.setState({
      from: Number(value),
    }, () => {
      this.props.form.setFields({
        mock_id: {
          errors: null
        }
      });
    });
  }

  handleSubmit = () => {
    const { form, onSave, data: { project_id, interface_id, id, } } = this.props;

    form.validateFields((err, values) => {
      var fields = values;
      if (typeof fields.regex !== 'undefined') {
        fields.regex = Number(fields.regex)
      }
      if (!err && onSave) {
        onSave({
          id,
          project_id,
          interface_id,
          ...values,
          from: Number(values.from),
        });
      }
    });
  }
}

export default Form.create()(DataMapForm);
