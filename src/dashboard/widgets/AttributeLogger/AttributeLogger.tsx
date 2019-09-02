import React, { Component, Fragment, CSSProperties, ReactNode } from "react";
import { WidgetProps } from "../types";
import { WidgetDefinition, AttributeInputDefinition, BooleanInputDefinition, NumberInputDefinition} from "../../types";
import AttributeLog from "./Logs/Logs";

//This interface is how parameters are passed from the WidgetDefinition
//into the widget - if you expand or change the widget definition this
//will most likely need to change as well
type Inputs =  {
  showDevice: BooleanInputDefinition;
  logIfChanged: BooleanInputDefinition;
  linesDisplayed: NumberInputDefinition;
  attribute: AttributeInputDefinition;
}
type Props = WidgetProps<Inputs>;

export class AttributeLogger extends Component<Props> {
  // adding in state as we need to store the log that is specific
  // to this instance of the AttributeLogger. This may well have
  // a better long term home but this fixes the problem of loggers 'sharing'
  // a global log.
  state = {
    valueLog: []
  };

  public render() {
    const { attribute } = this.props.inputs;
    const device = attribute.device || "device";
    const attributeName = attribute.attribute || "attribute"

    React.useLayoutEffect = React.useEffect;

    //gatekeeper - otherwise we end up logging before we start running.
    //All we need to display at this stage is the static info about the
    //widget.
    if (this.props.mode !== "run") {
      //clear the log if we edit
      return <span style={{ fontStyle: "italic" }}>value</span>;
    }

    const style: CSSProperties = { padding: "0.5em", whiteSpace: "nowrap" };
    const value = this.value();
    const valueLog = this.state.valueLog;

    //distinguish between showing the device name or not
    return this.props.inputs.showDevice ? (
      <div style={style}>
        <Fragment>
          <AttributeLog
            tangoDB="testdb"
            values={value}
            valueLog={valueLog}
            deviceName={device}
            attributeName={attributeName}
          />
        </Fragment>
      </div>
    ) : (
      <div style={style}>
        <Fragment>
          <AttributeLog tangoDB="testdb" values={value} attributeName={attributeName} valueLog={valueLog} />
        </Fragment>
      </div>
    );
  }

  // check the last message in the log against the current message - safest to assume if in doubt
  // that it is differen (i.e if it is the first message or the last message was not readable)
  // open question should we change the timestamp to show it has been updated?
  private isDifferentToLastMessage(currMessage: string, valueLog: any) {
    let messageChanged = true;
    let lastLoggedRow = valueLog[valueLog.length - 1];
    if (typeof lastLoggedRow !== "undefined") {
      messageChanged = lastLoggedRow.value !== currMessage;
    }
    return messageChanged;
  }

  private logValue(): string {
    const {
      attribute: { value }
    } = this.props.inputs;

    if (value) return value;
    else return "";
  }

  private value(): ReactNode {
    if (this.props.mode !== "run") {
      return <span style={{ fontStyle: "italic" }}>value</span>;
    }

    const {
      attribute: { value, unit }
    } = this.props.inputs;

    let result: ReactNode;
    if (Number(parseFloat(value)) === value) {
      result = value;
    } else {
      result = value === undefined ? null : String(value);
    }
    const unitSuffix = unit ? ` ${unit} ` : "";
    return (
      <>
        {result}
        {unitSuffix}
      </>
    );
  }

  // this feels like a hack there should be a more elegant way to force
  // a reload of the log data *once* each time the attribute changes
  componentDidUpdate(prevProps) {
    if (
      prevProps.inputs.attribute.timestamp !==
        this.props.inputs.attribute.timestamp ||
      prevProps.inputs.attribute.value !== this.props.inputs.attribute.value
    ) {
      this.reloadLog();
    }
  }

  // routine that does the work of creating the current log window
  // and pushing the updated log into the state.
  reloadLog = () => {
    const { attribute } = this.props.inputs;
    const currMessage = this.logValue();

    const valueLog = this.state.valueLog;

    var newLog: any[] = this.state.valueLog;

    //We don't need to do all this jiggerypokery unless the user is interested
    //in this value
    if (
      this.props.inputs.logIfChanged === false ||
      this.isDifferentToLastMessage(currMessage, valueLog)
    ) {
      //add the new value to the bottom and then drop the oldest ones to give us a log
      //of a suitable length. This may need tweaked once the scroll is working

      // when switch between run and edit a single empty log line is added because render is called
      // this is a crude way to stop this hapopening
      const timestamp = (attribute.timestamp * 1000)

      if (currMessage !== "") {
        if (this.props.inputs.linesDisplayed - valueLog.length > 0) {
          newLog = [
            ...valueLog,
            { timestamp: timestamp, value: currMessage }
          ];
        } else {
          newLog = [
            ...valueLog.slice(1),
            { timestamp: timestamp, value: currMessage }
          ];
        }
        this.setState({ valueLog: newLog });
      }
    }
  };
}

// defines the inputs on the RHS used to manage the widget
const definition: WidgetDefinition<Inputs> = {
  type: "ATTRIBUTE_LOGGER",
  name: "Attribute Logger",
  defaultWidth: 50,
  defaultHeight: 20,
  inputs: {
    attribute: {
      type: "attribute",
      label: "Attribute to log",
      dataFormat: "scalar",
      required: true
    },
    linesDisplayed: {
      type: "number",
      label: "Lines Logged",
      default: 50
    },
    showDevice: {
      type: "boolean",
      label: "Show Device",
      default: false
    },
    logIfChanged: {
      type: "boolean",
      label: "Log if changed",
      default: false
    }
  }
};

export default { component: AttributeLogger, definition };
