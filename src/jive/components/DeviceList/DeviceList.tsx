import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cx from "classnames";
import queryString from "query-string";

import { setDeviceFilter } from "../../state/actions/deviceList";

import {
  getFilter,
  getFilteredDeviceNames
} from "../../state/selectors/deviceList";

import { fetchDeviceNames } from "../../state/actions/tango";
import { getDeviceNamesAreLoading } from "../../state/selectors/loadingStatus";

import TreeView, { ExpansionState } from "./TreeView";
import ScrollIntoViewIfNeeded from "./ScrollIntoView";

import "./DeviceList.css";

function namesToTreeData(names: string[]) {
  const tree = {};
  for (const name of names) {
    const components = name.split("/");
    let target = tree;
    for (const component of components) {
      if (!target.hasOwnProperty(component)) {
        target[component] = {};
      }
      target = target[component];
    }
  }
  return tree;
}

function initialExpansionState(deviceName?: string) {
  if (deviceName == null) {
    return {};
  }

  const path = deviceName.split("/").reverse();
  return path.reduce((accum, curr) => {
    return {
      [curr]: [true, accum]
    };
  }, {});
}

interface Props {
  location: any;

  tangoDB: string;
  deviceNames: string[];
  currentDeviceName?: string;
  filter: string;
  loading: boolean;

  onRequireDeviceNames: (tangoDB: string) => void;
  onSetFilter: (filter: string) => void;
}

interface State {
  expansionState: ExpansionState;
}

class DeviceList extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    const expansionState = initialExpansionState(props.currentDeviceName);
    this.state = { expansionState };

    this.handleTextChange = this.handleTextChange.bind(this);
  }

  public componentWillMount() {
    const tangoDB = this.props.tangoDB;
    this.props.onRequireDeviceNames(tangoDB);

    const filter = this.parseFilter(this.props);
    if (filter != null) {
      this.props.onSetFilter(filter);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const filter = this.parseFilter();
    if (filter != null && filter !== this.parseFilter(prevProps)) {
      this.props.onSetFilter(filter);
    }
  }

  public render() {
    const { deviceNames, currentDeviceName, filter, tangoDB } = this.props;
    const treeData = namesToTreeData(deviceNames);

    return (
      <div className={cx("DeviceList", { "has-search": filter.length > 0 })}>
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
          <TreeView
            data={treeData}
            renderLeaf={path => {
              const instance = path.slice(-1)[0];
              const deviceName = path.join("/");
              const selected = deviceName === currentDeviceName;

              const pathname = `/${tangoDB}/devices/${deviceName}`;
              const extra =
                filter.length > 0 ? { search: `?filter=${filter}` } : {};
              const to = { pathname, ...extra };

              return (
                <ScrollIntoViewIfNeeded isSelected={selected}>
                  <Link className={cx("entry", { selected })} to={to}>
                    {instance}
                  </Link>
                </ScrollIntoViewIfNeeded>
              );
            }}
            expansion={this.state.expansionState}
            onChangeExpansion={expansionState =>
              this.setState({ expansionState })
            }
            expandAll={filter.length > 0}
          />
        </div>
      </div>
    );
  }

  private handleTextChange(e) {
    this.props.onSetFilter(e.target.value);
  }

  // There must be an easier way to do this. What's the point of queryString.parse returning string | string[]?
  private parseFilter(props?: Props): string | null {
    const search = (props || this.props).location.search;
    const { filter } = queryString.parse(search);

    if (filter == null) {
      return null;
    }

    if (Array.isArray(filter)) {
      return filter.join("");
    }

    return filter;
  }
}

function mapStateToProps(state) {
  return {
    deviceNames: getFilteredDeviceNames(state),
    filter: getFilter(state),
    loading: getDeviceNamesAreLoading(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onRequireDeviceNames: (tangoDB: string) =>
      dispatch(fetchDeviceNames(tangoDB)),
    onSetFilter: (filter: string) => dispatch(setDeviceFilter(filter))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceList);
