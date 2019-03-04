import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

class GroupTabTitle extends PureComponent {
  static propTypes = {
    group: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  render() {
    const { group, active, onEdit, onDelete } = this.props;
    const classes = ['tabs-item', 'sortable', active && 'active'];

    return (
      <li className={classes.join(' ')} data-id={group.id}>
        <span onClick={this.handleClick}>{group.name}</span>
        <Icon type="edit" title="修改" onClick={() => onEdit(group)} />
        <Icon type="delete" title="删除" onClick={() => onDelete(group)} />
      </li>
    )
  }

  handleClick = () => {
    const { group, active, onClick } = this.props;
    !active && onClick(group.id);
  }
}

export default GroupTabTitle;