import React, { Component } from "react";
import { connect } from "react-redux";

import { IRootState } from "../../state/reducers";
import { IWidget } from "../../types";
import { bundleForWidget } from "../../newWidgets";
import { TILE_SIZE } from "../constants";

import ErrorBoundary from "../ErrorBoundary";

import { changeEventEmitter } from "./emitter";
import { extractModelsFromWidgets, enrichedInputs } from "./lib";

interface IProps {
  widgets: IWidget[];
  tangoDB: string;
}

interface IState {
  attributeValues: { [model: string]: any };
}

class RunCanvas extends Component<IProps, IState> {
  private unsub?: () => void;

  public constructor(props) {
    super(props);
    this.state = { attributeValues: {} };
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
        {widgets.map((widget, i) => {
          const { component, definition } = bundleForWidget(widget)!;
          const { x, y, width, height } = widget;

          const inputs = enrichedInputs(
            widget.inputs,
            definition.inputs,
            this.state.attributeValues,
            (device, command) => alert(`${device} | ${command}`)
          );

          const actualWidth = width * TILE_SIZE;
          const actualHeight = height * TILE_SIZE;

          const props = { mode: "run", inputs, actualWidth, actualHeight };
          const element = React.createElement(component as any, props); // How to avoid the cast?

          return (
            <div
              key={i}
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
}

function mapStateToProps(state: IRootState) {
  return {
    widgets: state.widgets.widgets
  };
}

export default connect(mapStateToProps)(RunCanvas);
