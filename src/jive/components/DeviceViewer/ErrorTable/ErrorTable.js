import React, { Component } from "react";

export default class ErrorTable extends Component {
  render() {
    const errors = this.props.errors || [];
    return (
      <pre>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </pre>
    );
  }
}
