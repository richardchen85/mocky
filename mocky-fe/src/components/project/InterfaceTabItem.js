import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

class InterfaceTabItem extends PureComponent {
  static propTypes = {
    data: PropTypes.any.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
  }

  render() {
    const { data, active, onEdit, onDelete } = this.props;

    return (
      <>
        <div className={["interface-item sortable", active && 'active'].join(' ')} data-id={data.id}>
          <span onClick={this.handleChange}>{data.name}</span>
          <div className="btns">
            <Icon type="edit" title="修改" onClick={() => onEdit(data)}/>
            <Icon type="delete" title="删除" onClick={() => onDelete(data)}/>
          </div>
        </div>
      </>
    )
  }

  handleChange = () => {
    const { active, data, onClick } = this.props;
    !active && onClick(data.id);
  }
}

export default InterfaceTabItem;
