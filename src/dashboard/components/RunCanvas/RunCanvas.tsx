import React, { Component } from "react";

import { Widget } from "../../types";
import { bundleForWidget } from "../../widgets";
import { TILE_SIZE } from "../constants";

import ErrorBoundary from "../ErrorBoundary";

import { attributeEmitter, END, EmittedFrame } from "./emitter";
import * as TangoAPI from "../api";

import {
  AttributeValue,
  enrichedInputs,
  AttributeMetadata,
  DeviceMetadata,
  ExecutionContext
} from "../../runtime/enrichment";

import {
  extractFullNamesFromWidgets,
  extractDeviceNamesFromWidgets
} from "../../runtime/extraction";

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
  attributeValues: Record<string, AttributeValue>;
  attributeHistories: Record<string, AttributeValue[]>;
  commandOutputs: Record<string, any>;
  attributeMetadata: Record<string, AttributeMetadata> | null;
  deviceMetadata: Record<string, DeviceMetadata> | null;
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
      deviceMetadata: null,
      t0: Date.now() / 1000
    };

    this.resolveAttributeValue = this.resolveAttributeValue.bind(this);
    this.resolveDeviceMetadata = this.resolveDeviceMetadata.bind(this);
    this.resolveAttributeMetadata = this.resolveAttributeMetadata.bind(this);
    this.resolveAttributeHistories = this.resolveAttributeHistories.bind(this);
    this.resolveCommandOutputs = this.resolveCommandOutputs.bind(this);

    this.writeAttribute = this.writeAttribute.bind(this);
    this.executeCommand = this.executeCommand.bind(this);
    this.handleNewFrame = this.handleNewFrame.bind(this);
  }

  public async componentDidMount() {
    const { widgets, tangoDB } = this.props;
    const fullNames = extractFullNamesFromWidgets(widgets);

    const attributeMetadata = await TangoAPI.fetchAttributeMetadata(
      tangoDB,
      fullNames
    );

    const deviceNames = extractDeviceNamesFromWidgets(widgets);
    const deviceMetadata = await TangoAPI.fetchDeviceMetadata(
      tangoDB,
      deviceNames
    );

    const attributeHistories = fullNames.reduce((accum, name) => {
      return { ...accum, [name]: [] };
    }, {});

    this.setState({ deviceMetadata, attributeMetadata, attributeHistories });

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
    const { deviceMetadata, attributeMetadata, t0 } = this.state;

    if (deviceMetadata == null) {
      return null;
    }

    if (attributeMetadata == null) {
      return null;
    }

    const executionContext = {
      deviceMetadataLookup: this.resolveDeviceMetadata,
      attributeMetadataLookup: this.resolveAttributeMetadata,
      attributeValuesLookup: this.resolveAttributeValue,
      attributeHistoryLookup: this.resolveAttributeHistories,
      commandOutputLookup: this.resolveCommandOutputs,
      onWrite: this.writeAttribute,
      onExecute: this.executeCommand
    };

    return (
      <div className="Canvas run">
        {this.state.connectionLost && <ConnectionLost />}
        {widgets.map(widget => {
          const { component, definition } = bundleForWidget(widget)!;
          const { x, y, id, width, height } = widget;

          const inputs = enrichedInputs(
            widget.inputs,
            definition.inputs,
            executionContext
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

  private resolveAttributeValue(name) {
    return this.state.attributeValues[name] || {};
  }

  private resolveDeviceMetadata(name: string) {
    const { deviceMetadata } = this.state;
    if (deviceMetadata == null) {
      throw new Error("trying to resolve device metadata before initialised");
    }
    return deviceMetadata[name];
  }

  private resolveAttributeMetadata(name: string) {
    const { attributeMetadata } = this.state;
    if (attributeMetadata == null) {
      throw new Error(
        "trying to resolve attribute metadata before initialised"
      );
    }
    return attributeMetadata[name];
  }

  private resolveAttributeHistories(name: string) {
    return this.state.attributeHistories[name] || [];
  }

  private resolveCommandOutputs(name: string) {
    return this.state.commandOutputs[name];
  }

  private async executeCommand(
    device: string,
    command: string
  ): Promise<boolean> {
    let output;
    try {
      output = await TangoAPI.executeCommand(
        this.props.tangoDB,
        device,
        command
      );
    } catch (err) {
      // Possibly display a visual indication of the error
      return false;
    }

    const fullName = `${device}/${command}`;
    const commandOutputs = {
      ...this.state.commandOutputs,
      [fullName]: output
    };

    this.setState({ commandOutputs });
    return true;
  }

  private async writeAttribute(
    device: string,
    attribute: string,
    value: any
  ): Promise<boolean> {
    let result;
    try {
      result = await TangoAPI.writeAttribute(
        this.props.tangoDB,
        device,
        attribute,
        value
      );
    } catch (err) {
      // Possibly display a visual indication of the error
      return false;
    }

    const { ok, attribute: attributeAfter } = result;
    if (ok) {
      this.recordAttribute(
        device,
        attribute,
        attributeAfter.value,
        attributeAfter.writevalue,
        attributeAfter.timestamp
      );
    }

    return ok;
  }

  private recordAttribute(
    device: string,
    attribute: string,
    value: any,
    writeValue: any,
    timestamp: number
  ): void {
    const { attributeValues, attributeHistories } = this.state;
    const valueRecord = { value, writeValue, timestamp };

    const fullName = `${device}/${attribute}`;
    const newAttributeValues = {
      ...attributeValues,
      [fullName]: valueRecord
    };

    const attributeHistory = attributeHistories[fullName];
    const newHistory = [...attributeHistory, valueRecord];

    if (attributeHistory.length > 0) {
      const lastFrame = attributeHistory.slice(-1)[0];

      if (lastFrame.timestamp == null) {
        throw new Error("timestamp is missing");
      }

      if (lastFrame.timestamp >= timestamp) {
        return;
      }
    }

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

  private handleNewFrame(frame: EmittedFrame): void {
    if (frame === END) {
      this.setState({ connectionLost: true });
      return;
    }

    const { device, attribute, value, writeValue, timestamp } = frame;
    this.recordAttribute(device, attribute, value, writeValue, timestamp);
  }
}
