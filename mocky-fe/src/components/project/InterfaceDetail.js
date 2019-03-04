import React, { PureComponent } from 'react';
import InterfaceInfo from './InterfaceInfo';
import MockList from '../../containers/mock/MockList';
import DataMapList from '../../containers/dataMap/DataMapList';

class InterfaceDetail extends PureComponent {
  render() {
    const { data, projectId } = this.props;

    return (
      <div className="interface-detail">
        <InterfaceInfo projectId={projectId} data={data} />
        <div style={{display:'flex'}}>
          <DataMapList projectId={projectId} interfaceId={data.id} />
          <MockList projectId={projectId} itf={data} />
        </div>
      </div>
    )
  }
}

export default InterfaceDetail;