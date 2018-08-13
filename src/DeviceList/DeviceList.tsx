import React, { Component, StatelessComponent } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';

import { fetchDeviceNames} from '../actions/tango';
import { setDeviceFilter, toggleExpandDomain, toggleExpandFamily } from '../actions/deviceList';

import {
  getFilter,
  getFilteredDeviceNames,
  getHasDevices,
  getExpandedDomains,
  getExpandedFamilies,
} from '../selectors/deviceList';

import {
  getCurrentDeviceName,
} from '../selectors/currentDevice';

import {
  getDeviceNamesAreLoading
} from '../selectors/loadingStatus';

import './DeviceList.css';

import { unique } from '../utils';

interface IDeviceEntryProps {
  domain: string;
  family: string;
  member: string;
  isSelected: boolean;
}

const DeviceEntry: StatelessComponent<IDeviceEntryProps> = ({domain, family, member, isSelected}) => (
  <Link
    onClick={e => e.stopPropagation()}
    to={`/devices/${domain}/${family}/${member}`}
  >
    <div className={classNames('entry', {selected: isSelected})}>
      {member}
    </div>
  </Link>
);

const ExpanderArrow: StatelessComponent<{isExpanded: boolean, autoExpanded?: boolean}> = ({isExpanded, autoExpanded}) => (
  <span
    className={classNames('expander-arrow', {expanded: isExpanded, auto: autoExpanded})}
  />
);

interface IValueProps {
  deviceNames: string[],
  currentDeviceName?: string,
  hasDevices: boolean,
  filter: string,
  loading: boolean,

  expandedDomains: string[];
  expandedFamilies: string[];
}

interface IHandlerProps {
  onFetchDeviceNames: () => void;
  onSetFilter: (filter: string) => void;
  onToggleDomain: (domain: string) => void;
  onToggleFamily: (domain: string, family: string) => void;
}

type IDeviceListProps = IValueProps & IHandlerProps;

class DeviceList extends Component<IDeviceListProps> {
  public constructor(props: IDeviceListProps) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleToggleDomain = this.handleToggleDomain.bind(this);
    this.handleToggleFamily = this.handleToggleFamily.bind(this);
  }

  public componentWillMount() {
    this.props.onFetchDeviceNames();
  }
  
  public render() {
    const { filter, currentDeviceName } = this.props;
    const selectedTriplet = currentDeviceName ? currentDeviceName.split('/') : null;

    const triplets = this.props.deviceNames.map(name => name.split('/'));
    const domains = unique(triplets.map(([domain,,]) => domain));

    const entries = domains.map(domain => {
      const families = unique(
        triplets
          .filter(([domain2,,]) => domain2 === domain)
          .map(([,family,]) => family)
      );

      const subEntries = families.map(family => {
        const members = unique(
          triplets
            .filter(([,family2,]) => family2 === family)
            .map(([,,member]) => member)
        );
        
        const subSubEntries = members.map(member => {
          const name = `${domain}/${family}/${member}`;
          return (
            <li key={name}>
              <DeviceEntry isSelected={name === this.props.currentDeviceName} domain={domain} family={family} member={member}/>
            </li>
          );
        });

        const key = `${domain}/${family}`;
        const innerAutoExpanded = selectedTriplet != null && selectedTriplet[0] === domain && selectedTriplet[1] === family;
        const innerIsExpanded =
          innerAutoExpanded ||
          this.props.filter.length > 0 ||
          this.props.expandedFamilies.indexOf(key) !== -1;

        return (
          <li
            key={key}
            onClick={this.handleToggleFamily.bind(null, domain, family)}
          >
            <ExpanderArrow isExpanded={innerIsExpanded} autoExpanded={innerAutoExpanded}/>
            {family}
            {innerIsExpanded && <ul>
              {subSubEntries}
            </ul>}
          </li>
        );
      });

      const autoExpanded = selectedTriplet != null && selectedTriplet[0] === domain;
      const isExpanded =
        autoExpanded ||
        this.props.filter.length > 0 ||
        this.props.expandedDomains.indexOf(domain) !== -1;

      return (
        <li
          key={domain}
          onClick={this.handleToggleDomain.bind(null, domain)}
        >
          <ExpanderArrow isExpanded={isExpanded} autoExpanded={autoExpanded}/>
          {domain}
          {isExpanded && <ul>{subEntries}</ul>}
        </li>
      );
    });

    return (
      <div className="device-list">
        <div className="form-group search">
          <input className="form-control" type="text" placeholder="Search..." value={filter} onChange={this.handleTextChange}/>
        </div>
        <div className="list">
          <ul>
            {entries}
          </ul>
        </div>
      </div>
    );
  }

  private handleTextChange(e) {
    this.props.onSetFilter(e.target.value);
  }

  private handleToggleDomain(domain: string, event: React.MouseEvent) {
    event.preventDefault();
    this.props.onToggleDomain(domain);
  }

  private handleToggleFamily(domain: string, family: string, event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.props.onToggleFamily(domain, family);
  }
}

function mapStateToProps(state) {
  return {
    deviceNames: getFilteredDeviceNames(state),
    currentDeviceName: getCurrentDeviceName(state),
    hasDevices: getHasDevices(state),
    filter: getFilter(state),
    loading: getDeviceNamesAreLoading(state),

    expandedDomains: getExpandedDomains(state),
    expandedFamilies: getExpandedFamilies(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFetchDeviceNames: () => dispatch(fetchDeviceNames()),
    onSetFilter: filter => dispatch(setDeviceFilter(filter)),

    onToggleDomain: domain => dispatch(toggleExpandDomain(domain)),
    onToggleFamily: (domain, family) => dispatch(toggleExpandFamily(domain, family)),
  };
}

export default connect<IValueProps, IHandlerProps>(
  mapStateToProps,
  mapDispatchToProps
)(DeviceList);
