import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { fetchDatabaseInfo } from "../../state/actions/tango";
import { getInfo } from "../../state/selectors/database";
import Logs from "../DeviceViewer/Logs/Logs";
import "./HomeViewer.css";

class HomeViewer extends Component {
  componentDidMount() {
    const { tangoDB } = this.props.match.params;
    this.props.onLoad(tangoDB);
  }

  render() {
    const { info } = this.props;
    const { tangoDB } = this.props.match.params;
    return info == null ? null : (
      <div className="HomeViewer">
        <div>
          {info.split("\n").map((line, i) => (
            <p key={i}>{line.trim()}</p>
          ))}
        </div>
        <hr />
        <Logs deviceName="" tangoDB={tangoDB} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    info: getInfo(state)
  };
}

HomeViewer.propTypes = {
  info: PropTypes.string,
  onLoad: PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return {
    onLoad: tangoDB => dispatch(fetchDatabaseInfo(tangoDB))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeViewer);
