import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';

import { fetchDeviceNames} from '../actions/tango';
import { setDeviceFilter } from '../actions/deviceList';

import { getFilter } from '../selectors/filtering';
import {
  getFilteredDeviceNames,
  getHasDevices,
  getCurrentDeviceName,
  getDeviceNamesAreLoading
} from '../selectors/devices';

import './DeviceList.css';

const DeviceEntry = ({name, isSelected}) => (
  <Link to={'/devices/'+name}>
    <div className={classNames('entry', {selected: isSelected})}>
      {name}
    </div>
  </Link>
);

class DeviceList extends React.Component {
  componentWillMount() {
    this.props.fetchDeviceNames();
  }

  handleTextChange(event) {
    this.props.setFilter(event.target.value);
  }
  
  render() {
    const entries = this.props.deviceNames.map((name, i) =>
      <DeviceEntry
        isSelected={name === this.props.currentDeviceName}
        key={i} name={name}
      />
    );

    return (
      <div className="device-list">
        {this.props.selectedDevice}
        <div className="search">
          <input type="text" placeholder="Search" value={this.props.filter} onChange={event => this.handleTextChange(event)} />
        </div>
        <div className="list">
        {this.props.loading && entries}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deviceNames: getFilteredDeviceNames(state),
    currentDeviceName: getCurrentDeviceName(state),
    hasDevices: getHasDevices(state),
    filter: getFilter(state),
    loading: getDeviceNamesAreLoading(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDeviceNames: () => dispatch(fetchDeviceNames()),
    setFilter: filter => dispatch(setDeviceFilter(filter)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceList);
