import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as tangoActions from '../actions/tango';
import * as deviceListActions from '../actions/deviceList';
import React from 'react';
import './DeviceList.css';

import { getFilteredDeviceNames, getHasDevices } from '../selectors/deviceList';

const DeviceEntry = ({name, onClick}) => (
  <div onClick={() => onClick(name)}>
    {name}
  </div>
);

class deviceList extends React.Component {

  componentWillMount() {
    this.props.tangoActions.getDevices();
  }

  handleTextChange(event) {
    this.props.deviceListActions.setDeviceFilter(event.target.value)
  }
  
  render() {
    return (
      <div className="device-list">
        <div className="search">
          <input type="text" onChange={event => this.handleTextChange(event)} />
        </div>
        <div className="list">
        {
          this.props.hasDevices
          ? this.props.deviceNames.map((name, i) => <DeviceEntry key={i} name={name} onClick={() => this.props.tangoActions.getDeviceProperties(name)}/>)
          : <p>No Data</p>
        }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deviceNames: getFilteredDeviceNames(state),
    hasDevices: getHasDevices(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    tangoActions: bindActionCreators(tangoActions, dispatch),
    deviceListActions: bindActionCreators(deviceListActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(deviceList);