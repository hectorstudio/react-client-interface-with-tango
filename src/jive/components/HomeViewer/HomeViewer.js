import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { fetchDatabaseInfo } from "../../state/actions/tango";
import { getInfo } from "../../state/selectors/database";

import "./HomeViewer.css";

class HomeViewer extends Component {
  componentDidMount() {
    const { tangoDB } = this.props.match.params;
    this.props.onLoad(tangoDB);
  }

  render() {
    const { info } = this.props;
    return info == null ? null : (
      <div className="HomeViewer">
        {info.split("\n").map((line, i) => (
          <p key={i}>{line.trim()}</p>
        ))}
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
