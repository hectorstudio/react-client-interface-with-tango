import React, { Component, StatelessComponent } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import classNames from "classnames";
import sort from "alphanum-sort";
import queryString from "query-string";
import ScrollIntoViewIfNeeded from "./ScrollIntoView.js";

import { fetchDeviceNames } from "../actions/tango";
import {
  setDeviceFilter,
  toggleExpandDomain,
  toggleExpandFamily
} from "../actions/deviceList";

import {
  getFilter,
  getFilteredDeviceNames,
  getHasDevices,
  getExpandedDomains,
  getExpandedFamilies
} from "../selectors/deviceList";

import { getDeviceNamesAreLoading } from "../selectors/loadingStatus";

import "./DeviceList.css";

import { unique } from "../utils";

interface IDeviceEntryProps {
  tangoDB: string;
  domain: string;
  family: string;
  member: string;
  isSelected: boolean;
  filter?: string;
}

const DeviceEntry: StatelessComponent<IDeviceEntryProps> = ({
  tangoDB,
  domain,
  family,
  member,
  isSelected,
  filter
}) => {
  const pathname = `/${tangoDB}/devices/${domain}/${family}/${member}`;
  const to =
    filter == null
      ? pathname
      : {
          pathname,
          search: `?filter=${filter}`
        };

  return (
    <Link to={to} onClick={e => e.stopPropagation()}>
      <div className={classNames("entry", { selected: isSelected })}>
        {member}
      </div>
    </Link>
  );
};

const ExpanderArrow: StatelessComponent<{ isExpanded: boolean }> = ({
  isExpanded
}) => (
  <span className={classNames("expander-arrow", { expanded: isExpanded })} />
);

interface IProps {
  location: any;

  tangoDB: string;
  deviceNames: string[];
  currentDeviceName?: string;
  hasDevices: boolean;
  filter: string;
  loading: boolean;

  expandedDomains: string[];
  expandedFamilies: string[];

  onRequireDeviceNames: (tangoDB: string) => void;
  onSetFilter: (filter: string) => void;
  onToggleDomain: (domain: string) => void;
  onToggleFamily: (domain: string, family: string) => void;
}

class DeviceList extends Component<IProps> {
  public constructor(props: IProps) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleToggleDomain = this.handleToggleDomain.bind(this);
    this.handleToggleFamily = this.handleToggleFamily.bind(this);
  }

  public componentWillMount() {
    const tangoDB = this.props.tangoDB;
    this.props.onRequireDeviceNames(tangoDB);
  }

  public componentDidMount() {
    const filter = this.parseFilter();
    this.props.onSetFilter(filter || "");
  }

  public componentDidUpdate(prevProps) {
    const filter = this.parseFilter();
    if (filter !== this.parseFilter(prevProps)) {
      this.props.onSetFilter(filter || "");
    }
  }

  public render() {
    const { filter, tangoDB } = this.props;

    const triplets = this.props.deviceNames.map(name => name.split("/"));
    const domains = unique(triplets.map(([domain, ,]) => domain));

    const entries = domains.map(domain => {
      const families = unique(
        triplets
          .filter(([domain2, ,]) => domain2 === domain)
          .map(([, family]) => family)
      );

      const subEntries = families.map(family => {
        const members = sort(
          triplets
            .filter(
              ([domain2, family2]) => domain2 === domain && family2 === family
            )
            .map(([, , member]) => member)
        );

        const subSubEntries = members.map(member => {
          const name = `${domain}/${family}/${member}`;
          const parsedFilter = this.parseFilter();

          return (
            <ScrollIntoViewIfNeeded
              key={name}
              isSelected={name === this.props.currentDeviceName}
            >
              <li key={name}>
                <DeviceEntry
                  isSelected={name === this.props.currentDeviceName}
                  tangoDB={tangoDB}
                  domain={domain}
                  family={family}
                  member={member}
                  filter={parsedFilter}
                />
              </li>
            </ScrollIntoViewIfNeeded>
          );
        });

        const key = `${domain}/${family}`;
        const innerIsExpanded =
          filter.length > 0 || this.props.expandedFamilies.indexOf(key) !== -1;

        return (
          <li
            key={key}
            onClick={this.handleToggleFamily.bind(null, domain, family)}
          >
            <ExpanderArrow isExpanded={innerIsExpanded} />
            {family}
            {innerIsExpanded && <ul>{subSubEntries}</ul>}
          </li>
        );
      });

      const isExpanded =
        filter.length > 0 || this.props.expandedDomains.indexOf(domain) !== -1;

      return (
        <li key={domain} onClick={this.handleToggleDomain.bind(null, domain)}>
          <ExpanderArrow isExpanded={isExpanded} />
          {domain}
          {isExpanded && <ul>{subEntries}</ul>}
        </li>
      );
    });

    const className = classNames("device-list", {
      "has-search": filter.length > 0
    });
    return (
      <div className={className}>
        <div className="form-group search">
          <form>
            <input
              name="filter"
              className="form-control"
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={this.handleTextChange}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              title={`Filter on multiple terms, or prefix the query with 'glob:' to perform globbing, e.g. glob:sys/tg_test/+(1|2|3) or glob:sys/**`}
            />
          </form>
        </div>
        <div className="list">
          <ul>{entries}</ul>
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

  private handleToggleFamily(
    domain: string,
    family: string,
    event: React.MouseEvent
  ) {
    event.stopPropagation();
    event.preventDefault();
    this.props.onToggleFamily(domain, family);
  }

  private parseFilter(props?) {
    const search = (props || this.props).location.search;
    return queryString.parse(search).filter;
  }
}

function mapStateToProps(state) {
  return {
    deviceNames: getFilteredDeviceNames(state),
    hasDevices: getHasDevices(state),
    filter: getFilter(state),
    loading: getDeviceNamesAreLoading(state),

    expandedDomains: getExpandedDomains(state),
    expandedFamilies: getExpandedFamilies(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onRequireDeviceNames: tangoDB => dispatch(fetchDeviceNames(tangoDB)),
    onSetFilter: filter => dispatch(setDeviceFilter(filter)),

    onToggleDomain: domain => dispatch(toggleExpandDomain(domain)),
    onToggleFamily: (domain, family) =>
      dispatch(toggleExpandFamily(domain, family))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceList);
