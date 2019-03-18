import React from 'react';
import { connect } from 'react-redux';
import { Alert, Form, Modal } from 'antd';
import UserSelect from '../../components/UserSelect';

function TransferForm(props) {
  const { show, saving, project_id, error, form, dispatch } = props;

  function handleSubmit() {
    form.validateFields((err, { user }) => {
      if (!err) {
        dispatch({ type: 'projectDetail/saveTransfer', payload: { project_id, user_id: Number(user.key) } });
      }
    });
  }

  function handleCancel() {
    props.dispatch({ type: 'projectDetail/setTransfer', payload: { show: false } });
  }

  return (
    <Modal
      visible={show}
      title="转移项目"
      maskClosable={false}
      confirmLoading={saving}
      width={400}
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <Form>
        <Alert
          type="warning"
          message="注意：拥有权转移过后，您将没有当前项目的修改权限，若想继续查看该项目，请先将自己添加到项目成员！"
          style={{ marginBottom: 15 }}
        />
        <Form.Item>
          {form.getFieldDecorator('user', {
            rules: [{ required: true, message: '请输入项目的新拥有者！' }],
          })(<UserSelect placeholder="转移给？" mode={null} />)}
        </Form.Item>
        {error && (
          <Form.Item>
            <Alert message={error} type="error" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

const FormWrapped = Form.create()(TransferForm);

export default connect(state => ({ ...state.projectDetail.transfer }))(FormWrapped);
