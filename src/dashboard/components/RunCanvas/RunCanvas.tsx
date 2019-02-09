import React, { Component } from "react";
import { connect } from "react-redux";

import { RootState } from "../../state/reducers";
import { Widget } from "../../types";
import { bundleForWidget } from "../../widgets";
import { TILE_SIZE } from "../constants";

import ErrorBoundary from "../ErrorBoundary";

import { changeEventEmitter } from "./emitter";
import { extractFullNamesFromWidgets, enrichedInputs } from "./lib";
import { executeCommand } from "../api";
import { getWidgets } from "src/dashboard/state/selectors";

interface Props {
  widgets: Widget[];
  tangoDB: string;
}

interface State {
  attributeValues: { [fullName: string]: any };
  commandOutputs: { [fullName: string]: any };
}

class RunCanvas extends Component<Props, State> {
  private unsub?: () => void;

  public constructor(props) {
    super(props);
    this.state = { attributeValues: {}, commandOutputs: {} };
    this.executeCommand = this.executeCommand.bind(this);
  }

  public componentDidMount() {
    const { widgets, tangoDB } = this.props;
    const fullNames = extractFullNamesFromWidgets(widgets);
    const emit = changeEventEmitter(tangoDB, fullNames);
    this.unsub = emit(frame => {
      const { device, attribute, value } = frame;
      const fullName = `${device}/${attribute}`;
      const attributeValues = {
        ...this.state.attributeValues,
        [fullName]: value
      };
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
                height: actualHeight,
                overflow: "hidden"
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
    const fullName = `${device}/${command}`;
    const commandOutputs = { ...this.state.commandOutputs, [fullName]: output };
    this.setState({ commandOutputs });
  }
}

function mapStateToProps(state: RootState) {
  return {
    widgets: getWidgets(state)
  };
}

export default connect(mapStateToProps)(RunCanvas);
