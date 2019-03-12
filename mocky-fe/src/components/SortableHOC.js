import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom'
import Sortable from 'sortablejs'

class SortableHOC extends PureComponent {
  $sortable = null;

  render() {
    return this.props.children;
  }

  componentDidMount() {
    let { onSortChange } = this.props
    let $sortable = Sortable.create(findDOMNode(this), {
      animation: 100,
      onEnd: (e) => {
        onSortChange && onSortChange(e, $sortable);
      },
      ...this.props
    })
    this.$sortable = $sortable;
  }
}

export class RSortableHandle extends PureComponent {
  render() {
    return <div className='sortable'>
      {this.props.children}
    </div>
  }
}

export default SortableHOC;
