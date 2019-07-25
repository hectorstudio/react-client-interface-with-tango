import React, { Component } from "react";

export default class ErrorBoundary extends Component<
  {},
  { error: Error | null }
> {
  public constructor(props) {
    super(props);
    this.state = { error: null };
  }

  public componentDidCatch(error) {
    this.setState({ error });
  }

  public render() {
    if (this.state.error == null) {
      return this.props.children;
    }

    return (
      <div style={{ backgroundColor: "#ff8888" }}>
        {String(this.state.error)}
      </div>
    );
  }
}
