import React, { Component } from "react";

import { Widget } from "../../types";
import { bundleForWidget } from "../../widgets";
import { TILE_SIZE } from "../constants";

import ErrorBoundary from "../ErrorBoundary";

import { attributeEmitter, END, EmittedFrame } from "./emitter";
import {
  extractFullNamesFromWidgets,
  enrichedInputs,
  AttributeValueLookup,
  CommandOutputLookup,
  AttributeMetadataLookup,
  AttributeHistoryLookup
} from "./lib";

import * as TangoAPI from "../api";

const HISTORY_LIMIT = 1000;

const ConnectionLost = () => (
  <div
    style={{
      position: "absolute",
      padding: "1em",
      color: "red",
      fontWeight: "bold",
      zIndex: 1
    }}
  >
    Connection lost. Please refresh your browser.
  </div>
);

interface Props {
  widgets: Widget[];
  tangoDB: string;
}

interface State {
  connectionLost: boolean;
  attributeValues: AttributeValueLookup;
  attributeHistories: AttributeHistoryLookup;
  commandOutputs: CommandOutputLookup;
  attributeMetadata: AttributeMetadataLookup | null;
  t0: number;
}

export default class RunCanvas extends Component<Props, State> {
  private unsubscribe?: () => void;

  public constructor(props: Props) {
    super(props);

    this.state = {
      connectionLost: false,
      attributeValues: {},
      attributeHistories: {},
      commandOutputs: {},
      attributeMetadata: null,
      t0: Date.now() / 1000
    };

    this.writeAttribute = this.writeAttribute.bind(this);
    this.executeCommand = this.executeCommand.bind(this);
    this.handleNewFrame = this.handleNewFrame.bind(this);
  }

  public async componentDidMount() {
    const { widgets, tangoDB } = this.props;
    const fullNames = extractFullNamesFromWidgets(widgets);

    const attributeMetadata = (await TangoAPI.fetchAttributeMetadata(
      tangoDB,
      fullNames
    )) as AttributeMetadataLookup | null;

    const attributeHistories = fullNames.reduce((accum, name) => {
      return { ...accum, [name]: [] };
    }, {});

    this.setState({ attributeMetadata, attributeHistories });

    const startEmission = attributeEmitter(tangoDB, fullNames);
    this.unsubscribe = startEmission(this.handleNewFrame);
  }

  public componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  public render() {
    const { widgets } = this.props;

    const {
      attributeMetadata,
      attributeValues,
      attributeHistories,
      commandOutputs,
      t0
    } = this.state;

    if (attributeMetadata == null) {
      return null;
    }

    return (
      <div className="Canvas run">
        {this.state.connectionLost && <ConnectionLost />}
        {widgets.map(widget => {
          const { component, definition } = bundleForWidget(widget)!;
          const { x, y, id, width, height } = widget;

          const inputs = enrichedInputs(
            widget.inputs,
            definition.inputs,
            attributeMetadata,
            attributeValues,
            attributeHistories,
            commandOutputs,
            this.writeAttribute,
            this.executeCommand
          );

          const actualWidth = width * TILE_SIZE;
          const actualHeight = height * TILE_SIZE;

          const props = { mode: "run", inputs, actualWidth, actualHeight, t0 };
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
    const output = await TangoAPI.executeCommand(
      this.props.tangoDB,
      device,
      command
    );
    const fullName = `${device}/${command}`;
    const commandOutputs = { ...this.state.commandOutputs, [fullName]: output };
    this.setState({ commandOutputs });
    return output;
  }

  private async writeAttribute(device: string, attribute: string, value: any) {
    return await TangoAPI.writeAttribute(
      this.props.tangoDB,
      device,
      attribute,
      value
    );
  }

  private handleNewFrame(frame: EmittedFrame) {
    if (frame === END) {
      this.setState({ connectionLost: true });
      return;
    }

    const { attributeValues, attributeHistories, t0 } = this.state;
    const { device, attribute, value, writeValue, timestamp } = frame;
    const valueRecord = { value, writeValue, timestamp, t0 };

    const fullName = `${device}/${attribute}`;
    const newAttributeValues = {
      ...attributeValues,
      [fullName]: valueRecord
    };

    const attributeHistory = attributeHistories[fullName];
    const newHistory = [...attributeHistory, valueRecord];

    const shortenedHistory =
      newHistory.length > HISTORY_LIMIT
        ? newHistory.slice(-HISTORY_LIMIT)
        : newHistory;

    const newAttributeHistories = {
      ...attributeHistories,
      [fullName]: shortenedHistory
    };

    this.setState({
      attributeValues: newAttributeValues,
      attributeHistories: newAttributeHistories
    });
  }
}
