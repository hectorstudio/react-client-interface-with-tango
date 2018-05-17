import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classNames from 'classnames';

import * as tangoActions from '../actions/tango';
import * as deviceListActions from '../actions/deviceList';
import './DeviceList.css';

import {
  getFilteredDeviceNames,
  getHasDevices,
  getFilter,
  getSelectedDeviceName
} from '../selectors/deviceList';

const DeviceEntry = ({name, onClick, isSelected}) => (
  <div className={classNames('entry', {selected: isSelected})} onClick={() => onClick(name)}>
    {name}
  </div>
);

class DeviceList extends React.Component {
  componentWillMount() {
    this.props.tangoActions.getDevices();
  }

  handleTextChange(event) {
    this.props.deviceListActions.setDeviceFilter(event.target.value)
  }
  
  render() {
    const entries = this.props.deviceNames.map((name, i) =>
      <DeviceEntry
        isSelected={name === this.props.selectedDeviceName}
        key={i} name={name}
        onClick={() => this.props.tangoActions.getDeviceInfo(name)}
      />
    );

    return (
      <div className="device-list">
        {this.props.selectedDevice}
        <div className="search">
          <input type="text" placeholder="Search" value={this.props.filter} onChange={event => this.handleTextChange(event)} />
        </div>
        <div className="list">
        {
          this.props.hasDevices
          ? entries
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
    selectedDeviceName: getSelectedDeviceName(state),
    hasDevices: getHasDevices(state),
    filter: getFilter(state)
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
)(DeviceList);
