import React, { Component } from "react";
import PropTypes from "prop-types";

import "./DisplevelChooser.css";

export default class DisplevelChooser extends Component {
  handleInputChange(name, e) {
    this.props.onChange(name, e.target.checked);
  }

  render() {
    const inputs = this.props.displevels.map((name, i) => (
      <label key={i} htmlFor={`displevel_${name}`}>
        <input
          id={`displevel_${name}`}
          type="checkbox"
          checked={this.props.disabledDisplevels.indexOf(name) === -1}
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
  disabledDisplevels: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};
