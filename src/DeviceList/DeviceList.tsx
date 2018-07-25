import React, { Component, StatelessComponent } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';

import { fetchDeviceNames} from '../actions/tango';
import { setDeviceFilter } from '../actions/deviceList';

import {
  getFilter,
  getFilteredDeviceNames,
  getHasDevices,
} from '../selectors/deviceList';

import {
  getCurrentDeviceName,
} from '../selectors/devices';

import './DeviceList.css';
import { getDeviceNamesAreLoading } from '../selectors/loadingStatus';

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
    const {
      deviceNames,
      filter,
    } = this.props;

    const entries = deviceNames.map((name, i) =>
      <DeviceEntry
        isSelected={name === this.props.currentDeviceName}
        key={i} name={name}
      />
    );

    return (
      <div className="device-list">
        <div className="form-group search">
          <input className="form-control" type="text" placeholder="Search..." value={filter} onChange={this.handleTextChange}/>
        </div>
        <div className="list">
          {entries}
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
