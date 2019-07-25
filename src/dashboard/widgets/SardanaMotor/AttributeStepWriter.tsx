import React, { Component, Fragment } from "react";

import "./AttributeStepWriter.css";

interface State {
  stepSize: number;
}
interface Props {
  value: number;
  mode: string;
  state: string;
  onSetPosition: (value: number) => void;
}

export class AttributeStepWriter extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      stepSize: 0.1
    };
  }

  public render() {
    const { stepSize } = this.state;
    const { state } = this.props;
    return (
      <Fragment>
        <div className="attributeStepWriter">
          <input
            className="input"
            type="number"
            value={this.state.stepSize}
            onChange={e =>
              this.setState({ stepSize: parseFloat(e.target.value) })
            }
          />
          <button
            disabled={state === "MOVING"}
            className="btn"
            onClick={() => this.props.onSetPosition(stepSize)}
          >
            +
          </button>
          <button
            disabled={state === "MOVING"}
            className="btn"
            onClick={() => this.props.onSetPosition(stepSize * -1.0)}
          >
            -
          </button>
        </div>
      </Fragment>
    );
  }
}
