import React, { Component, ReactNode, useState } from "react";
import cx from "classnames";

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
  DeviceMetadata
} from "../../runtime/enrichment";

import {
  extractFullNamesFromWidgets,
  extractDeviceNamesFromWidgets
} from "../../runtime/extraction";

import "./RunCanvas.css";

const HISTORY_LIMIT = 1000;

interface RuntimeErrorDescriptor {
  type: "warning" | "error";
  message: string;
}

function RuntimeErrors(props: { errors: RuntimeErrorDescriptor[] }) {
  const [hiddenErrors, setHiddenErrors] = useState({});
  const [hidingErrors, setHidingErrors] = useState({});

  const { errors } = props;
  if (errors.length === 0) {
    return null;
  }

  function hideError(i: number) {
    setHidingErrors({ ...hidingErrors, [i]: true });
    setTimeout(() => {
      setHiddenErrors({ ...hiddenErrors, [i]: true });
    }, 500);
  }

  let offset = 0;
  return errors.length === 0 ? null : (
    <div className="RuntimeErrors">
      {errors.map((error, i) => {
        const isHidden = hiddenErrors.hasOwnProperty(i);
        const isHiding = hidingErrors.hasOwnProperty(i);

        const shape = error.type === "error" ? "circle" : "triangle";
        const color = error.type === "error" ? "red" : "orange";

        const top = 0.5 + 5.5 * offset + "em";
        offset += isHidden || isHiding ? 0 : 1;

        return isHidden ? null : (
          <div
            key={i}
            className={cx("RuntimeError", { hiding: isHiding })}
            style={{ top }}
            onClick={hideError.bind(null, i)}
          >
            <i style={{ color }} className={`fa fa-exclamation-${shape}`} />
            <div className="message">{error.message}</div>
          </div>
        );
      })}
    </div>
  );
}

function ErrorWidget({ error }) {
  return (
    <div
      style={{
        backgroundColor: "pink",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "small"
      }}
    >
      <span className="fa fa-exclamation-triangle" />
      ️️ {String(error)}
    </div>
  );
}

interface Props {
  widgets: Widget[];
  tangoDB: string;
}

interface State {
  attributeValues: Record<string, AttributeValue>;
  attributeHistories: Record<string, AttributeValue[]>;
  commandOutputs: Record<string, any>;
  attributeMetadata: Record<string, AttributeMetadata> | null;
  deviceMetadata: Record<string, DeviceMetadata> | null;
  t0: number;
  runtimeErrors: RuntimeErrorDescriptor[];
  unrecoverableError: boolean;
  hasInitialized: boolean;
}

export default class RunCanvas extends Component<Props, State> {
  private unsubscribe?: () => void;

  public constructor(props: Props) {
    super(props);

    this.state = {
      attributeValues: {},
      attributeHistories: {},
      commandOutputs: {},
      attributeMetadata: null,
      deviceMetadata: null,
      t0: Date.now() / 1000,
      hasInitialized: false,
      unrecoverableError: false,
      runtimeErrors: []
    };

    this.resolveAttributeValue = this.resolveAttributeValue.bind(this);
    this.resolveDeviceMetadata = this.resolveDeviceMetadata.bind(this);
    this.resolveAttributeMetadata = this.resolveAttributeMetadata.bind(this);
    this.resolveAttributeHistories = this.resolveAttributeHistories.bind(this);
    this.resolveCommandOutputs = this.resolveCommandOutputs.bind(this);

    this.writeAttribute = this.writeAttribute.bind(this);
    this.executeCommand = this.executeCommand.bind(this);

    this.handleInvalidation = this.handleInvalidation.bind(this);
    this.handleNewFrame = this.handleNewFrame.bind(this);
  }

  public componentDidMount() {
    this.initialize();
  }

  private async initialize() {
    const { widgets, tangoDB } = this.props;
    const fullNames = extractFullNamesFromWidgets(widgets);

    const attributeMetadata = await TangoAPI.fetchAttributeMetadata(
      tangoDB,
      fullNames
    );

    if (attributeMetadata == null) {
      return this.reportUnrecoverableRuntimeError(
        "Failed to fetch attribute metadata. This dashboard cannot run."
      );
    }

    const deviceNames = extractDeviceNamesFromWidgets(widgets);
    const deviceMetadata = await TangoAPI.fetchDeviceMetadata(
      tangoDB,
      deviceNames
    );

    if (deviceMetadata == null) {
      return this.reportUnrecoverableRuntimeError(
        "Failed to fetch device metadata. This dashboard cannot run."
      );
    }

    const attributeHistories = fullNames.reduce((accum, name) => {
      return { ...accum, [name]: [] };
    }, {});

    this.setState({ deviceMetadata, attributeMetadata, attributeHistories });

    const startEmission = attributeEmitter(tangoDB, fullNames);
    this.unsubscribe = startEmission(this.handleNewFrame);

    this.setState({ hasInitialized: true });
  }

  public componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  public render() {
    const { widgets } = this.props;
    const { t0, hasInitialized, unrecoverableError } = this.state;

    if (!hasInitialized) {
      return null;
    }

    const executionContext = {
      deviceMetadataLookup: this.resolveDeviceMetadata,
      attributeMetadataLookup: this.resolveAttributeMetadata,
      attributeValuesLookup: this.resolveAttributeValue,
      attributeHistoryLookup: this.resolveAttributeHistories,
      commandOutputLookup: this.resolveCommandOutputs,
      onWrite: this.writeAttribute,
      onExecute: this.executeCommand,
      onInvalidate: this.handleInvalidation
    };

    const widgetsToRender = unrecoverableError
      ? []
      : widgets.map(widget => {
          const { component, definition } = bundleForWidget(widget);
          const { x, y, id, width, height } = widget;

          const actualWidth = width * TILE_SIZE;
          const actualHeight = height * TILE_SIZE;

          let element: ReactNode;
          try {
            const inputs = enrichedInputs(
              widget.inputs,
              definition.inputs,
              executionContext
            );
            const props = {
              mode: "run",
              inputs,
              actualWidth,
              actualHeight,
              t0
            };
            element = React.createElement(component, props);
          } catch (error) {
            element = <ErrorWidget error={error} />;
          }

          const left = 1 + x * TILE_SIZE;
          const top = 1 + y * TILE_SIZE;

          return (
            <div
              key={id}
              className="Widget"
              style={{
                left,
                top,
                width: actualWidth,
                height: actualHeight,
                overflow: "hidden"
              }}
            >
              <ErrorBoundary>{element}</ErrorBoundary>
            </div>
          );
        });

    return (
      <div className="Canvas run">
        <RuntimeErrors errors={this.state.runtimeErrors} />
        {widgetsToRender}
      </div>
    );
  }

  private resolveAttributeValue(name: string) {
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

  private reportRuntimeWarning(message: string) {
    const error: RuntimeErrorDescriptor = { type: "warning", message };
    const runtimeErrors = [...this.state.runtimeErrors, error];
    this.setState({ runtimeErrors });
  }

  private reportUnrecoverableRuntimeError(message: string): void {
    const error: RuntimeErrorDescriptor = { type: "error", message };
    const runtimeErrors = [...this.state.runtimeErrors, error];
    this.setState({ runtimeErrors, unrecoverableError: true });
  }

  private async executeCommand(
    device: string,
    command: string,
    parameter: string
  ): Promise<void> {
    let result: any;

    result = await TangoAPI.executeCommand(
      this.props.tangoDB,
      device,
      command,
      parameter
    );
    if (result == null || result.ok === false) {
      return this.reportRuntimeWarning(
        `Couldn't execute command "${command}" on device "${device}".`
      );
    }

    const fullName = `${device}/${command}`;
    const { output } = result;

    const commandOutputs = {
      ...this.state.commandOutputs,
      [fullName]: output
    };

    this.setState({ commandOutputs });
  }

  private async writeAttribute(
    device: string,
    attribute: string,
    value: any
  ): Promise<void> {
    let result: any;
    try {
      result = await TangoAPI.writeAttribute(
        this.props.tangoDB,
        device,
        attribute,
        value
      );
    } catch (err) {
      return;
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
    } else {
      this.reportRuntimeWarning(
        `Couldn't set attribute "${attribute}" on "${device}" to ${JSON.stringify(
          value
        )}`
      );
    }
  }

  private async handleInvalidation(fullNames: string[]) {
    const attributes = await TangoAPI.fetchAttributesValues(
      this.props.tangoDB,
      fullNames
    );

    for (const attribute of attributes) {
      const { device, name, value, writevalue, timestamp } = attribute;
      this.recordAttribute(device, name, value, writevalue, timestamp);
    }
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
      this.reportUnrecoverableRuntimeError(
        "Lost connection to socket. Please refresh your browser."
      );
      return;
    }

    const { device, attribute, value, writeValue, timestamp } = frame;
    this.recordAttribute(device, attribute, value, writeValue, timestamp);
  }
}
