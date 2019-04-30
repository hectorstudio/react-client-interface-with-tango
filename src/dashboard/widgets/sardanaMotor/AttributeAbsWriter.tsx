import React, { Component, Fragment } from "react";

import "./AttributeAbsWriter.css";

interface State {
  currentValue: any;
}
interface Props {
  value: number;
  mode: string;
  state: string;
  onSetPosition: (value: number) => void;
}

export class AttributeAbsWriter extends Component<Props, State> {
  public inputRef: any;

  public constructor(props: Props) {
    super(props);
    this.inputRef = React.createRef();
    const { value, mode } = this.props;
    this.state = {
      currentValue: value
    };
  }

  public render() {
      const { currentValue } = this.state;
      const { state } = this.props;
    return (
      <Fragment>
        <div style={{marginRight: "0.2em"}} className="attributeAbsWriter">Absolute value:</div>
        <div className="attributeAbsWriter">
          <input
            className="input"
            value={currentValue}
            type="number"
            onChange={e => this.setState({ currentValue: e.target.value })}
            onKeyPress={e => {
              if (e.key === "Enter" && state !== "MOVING") {
                this.props.onSetPosition(parseFloat(currentValue));
              }
            }}
          />
          <button
          disabled={state === "MOVING"}
            className="btn"
            onClick={() =>
              this.props.onSetPosition(parseFloat(this.state.currentValue))
            }
          >
            Set
          </button>
        </div>
      </Fragment>
    );
  }
}
