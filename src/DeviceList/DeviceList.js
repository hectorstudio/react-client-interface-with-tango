import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as tangoActions from '../actions/tango';
import React from 'react';
import './DeviceList.css';

import { getDeviceNames, getHasDevices } from '../selectors/deviceList';

const DeviceEntry = ({name, onClick}) => (
  <div onClick={() => onClick(name)}>
    {name}
  </div>
);

class deviceList extends React.Component {

  componentWillMount() {
    this.props.tangoActions.getDevices();
  }
  
  render() {
    return (
      <div className="device-list">
        <div className="list">
        {
          this.props.hasDevices
          ? this.props.deviceNames.map((name, i) => <DeviceEntry name={name} onClick={() => this.props.tangoActions.getDeviceProperties(name)}/>)
          : <p>No Data</p>
        }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deviceNames: getDeviceNames(state),
    hasDevices: getHasDevices(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    tangoActions: bindActionCreators(tangoActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(deviceList);