import React, { Component } from "react";
import { connect } from "react-redux";

import { getCurrentDeviceErrors } from "../../selectors/currentDevice";

class ErrorTable extends Component {
  render() {
    const errors = this.props.errors || [];
    return (
      <pre>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </pre>
    );
  }
}

function mapStateToProps(state) {
  return { errors: getCurrentDeviceErrors(state) };
}

export default connect(mapStateToProps)(ErrorTable);
