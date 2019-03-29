import React, { Component } from "react";
import "./DashboardTitle.css";

interface Props {
  title: string;
}
interface State {
  title: string;
}


export default class DashboardTitle extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { title: props.title };
  }
  public render() {
    const { title } = this.state;
    return (
      <span className="dashboard-menu">
        <input
          type="text"
          value={title}
          onChange={e => this.setState({ title: e.target.value })}
        />

      </span>
    );
  }

}
