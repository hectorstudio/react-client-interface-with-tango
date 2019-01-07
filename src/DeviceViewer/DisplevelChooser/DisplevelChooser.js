import React, { Component } from "react";
import PropTypes from "prop-types";

import "./DisplevelChooser.css";

export default class DisplevelChooser extends Component {
  handleInputChange(name, e) {
    if (e.target.checked) {
      this.props.onEnableDisplevel(name);
    } else {
      this.props.onDisableDisplevel(name);
    }
  }

  render() {
    const inputs = this.props.displevels.map((name, i) => (
      <label key={i} htmlFor={`displevel_${name}`}>
        <input
          id={`displevel_${name}`}
          type="checkbox"
          checked={this.props.enabled.indexOf(name) !== -1}
          onChange={this.handleInputChange.bind(this, name)}
        />
        {name}
      </label>
    ));

    return <div className="DisplevelChooser">{inputs}</div>;
  }
}

DisplevelChooser.propTypes = {
  displevels: PropTypes.arrayOf(PropTypes.string),
  enabled: PropTypes.arrayOf(PropTypes.string),
  onEnableDisplevel: PropTypes.func,
  onDisableDisplevel: PropTypes.func
};
