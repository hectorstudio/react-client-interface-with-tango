import React, { Component, StatelessComponent } from 'react';
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

interface IDeviceEntryProps {
  name: string,
  isSelected: boolean,
}

const DeviceEntry: StatelessComponent<IDeviceEntryProps> = ({name, isSelected}) => (
  <Link to={'/devices/'+name}>
    <div className={classNames('entry', {selected: isSelected})}>
      {name}
    </div>
  </Link>
);

interface IValueProps {
  deviceNames: string[],
  currentDeviceName?: string,
  hasDevices: boolean,
  filter: string,
  loading: boolean,
}

interface IHandlerProps {
  onFetchDeviceNames: () => void,
  onSetFilter: (filter: string) => void,
}

type IDeviceListProps = IValueProps & IHandlerProps;

class DeviceList extends Component<IDeviceListProps> {
  public constructor(props: IDeviceListProps) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  public componentWillMount() {
    this.props.onFetchDeviceNames();
  }
  
  public render() {
    const entries = this.props.deviceNames.map((name, i) =>
      <DeviceEntry
        isSelected={name === this.props.currentDeviceName}
        key={i} name={name}
      />
    );

    return (
      <div className="device-list">
        <div className="search">
          <input type="text" placeholder="Search" value={this.props.filter} onChange={this.handleTextChange} />
        </div>
        <div className="list">
        {this.props.loading && entries}
        </div>
      </div>
    );
  }

  private handleTextChange(event) {
    this.props.onSetFilter(event.target.value);
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
    onFetchDeviceNames: () => dispatch(fetchDeviceNames()),
    onSetFilter: filter => dispatch(setDeviceFilter(filter)),
  };
}

export default connect<IValueProps, IHandlerProps>(
  mapStateToProps,
  mapDispatchToProps
)(DeviceList);
