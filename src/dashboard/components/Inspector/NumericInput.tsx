import React, { Component } from "react";

interface Props {
  className: string;
  value: number;
  onChange: (value: number) => void;
}

interface State {
  value: string;
  invalid: boolean;
}

export default class NumericInput extends Component<Props, State> {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = { value: String(value), invalid: isNaN(value) };
  }

  public componentDidUpdate(prevProps) {
    const { value } = this.props;
    const asString = String(value);
    if (asString !== String(prevProps.value)) {
      this.setState({ value: asString });
    }
  }

  public render() {
    return (
      <input
        style={this.state.invalid ? { border: "1px solid red" } : {}}
        className={this.props.className || ""}
        value={this.state.value}
        onChange={event => {
          const value = event.target.value;
          const asNumber = Number(value);
          const invalid = value === "" || isNaN(asNumber);

          this.setState({ value, invalid });

          if (!invalid) {
            this.props.onChange(asNumber);
          }
        }}
      />
    );
  }
}
