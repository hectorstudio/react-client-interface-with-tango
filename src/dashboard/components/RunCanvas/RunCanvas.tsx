import React, { Component } from "react";
import { connect } from "react-redux";

import { IRootState } from "../../state/reducers";
import { IWidget } from "../../types";
import { bundleForWidget } from "../../widgets";
import { TILE_SIZE } from "../constants";

import ErrorBoundary from "../ErrorBoundary";

import { changeEventEmitter } from "./emitter";
import { extractModelsFromWidgets, enrichedInputs } from "./lib";
import { executeCommand } from "../api";
import { getWidgets } from "src/dashboard/state/selectors";

interface IProps {
  widgets: IWidget[];
  tangoDB: string;
}

interface IState {
  attributeValues: { [model: string]: any };
  commandOutputs: { [model: string]: any };
}

class RunCanvas extends Component<IProps, IState> {
  private unsub?: () => void;

  public constructor(props) {
    super(props);
    this.state = { attributeValues: {}, commandOutputs: {} };
    this.executeCommand = this.executeCommand.bind(this);
  }

  public componentDidMount() {
    const { widgets, tangoDB } = this.props;
    const models = extractModelsFromWidgets(widgets);
    const emit = changeEventEmitter(tangoDB, models);
    this.unsub = emit(event => {
      const {
        device,
        name,
        data: { value }
      } = event;
      const model = `${device}/${name}`;
      const attributeValues = { ...this.state.attributeValues, [model]: value };
      this.setState({ attributeValues });
    });
  }

  public componentWillUnmount() {
    if (this.unsub) {
      this.unsub();
    }
  }

  public render() {
    const { widgets } = this.props;

    return (
      <div className="Canvas run">
        {widgets.map(widget => {
          const { component, definition } = bundleForWidget(widget)!;
          const { x, y, id, width, height } = widget;

          const inputs = enrichedInputs(
            widget.inputs,
            definition.inputs,
            this.state.attributeValues,
            this.state.commandOutputs,
            (device, command) => this.executeCommand(device, command)
          );

          const actualWidth = width * TILE_SIZE;
          const actualHeight = height * TILE_SIZE;

          const props = { mode: "run", inputs, actualWidth, actualHeight };
          const element = React.createElement(component as any, props); // How to avoid the cast?

          return (
            <div
              key={id}
              className="Widget"
              style={{
                left: 1 + x * TILE_SIZE,
                top: 1 + y * TILE_SIZE,
                width: actualWidth,
                height: actualHeight
              }}
            >
              <ErrorBoundary>{element}</ErrorBoundary>
            </div>
          );
        })}
      </div>
    );
  }

  private async executeCommand(device: string, command: string) {
    const output = await executeCommand(this.props.tangoDB, device, command);
    const model = `${device}/${command}`;
    const commandOutputs = { ...this.state.commandOutputs, [model]: output };
    this.setState({ commandOutputs });
  }
}

function mapStateToProps(state: IRootState) {
  return {
    widgets: getWidgets(state)
  };
}

export default connect(mapStateToProps)(RunCanvas);
