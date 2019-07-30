import React, { Component, Fragment, CSSProperties, ReactNode } from "react";
import { WidgetProps } from "../types";
import { WidgetDefinition, AttributeInput } from "../../types";
import Logs from "./Logs/Logs";

//import { getDevice } from "../jive/component/state/reducers/devices"
//import { getDevice } from "./Logs/devices"
//import { getDeviceIsLoading } from "./Logs/loadingStatus";
//import { getDisabledDisplevels } from "./Logs/deviceDetail";

/*function LoggerContent() {
  return <Logs tangoDB={tangoDB} deviceName={device.name}/>
};*/

/*//Check to see if can use Logs import correctly
var  readLogToShow = Logs.displayName
console.log(readLogToShow)
*/

/*
function mapDispatchToProps(dispatch, ownProps) {
  const { tangoDB } = ownProps;
  return {
    onRequireDevice: device => dispatch(fetchDevice(tangoDB, device)),
    onDisplevelChange: (displevel, value) => {
      const action = value
        ? enableDisplevel(displevel)
        : disableDisplevel(displevel);
      dispatch(action);
    }
  };
}

logToDisplay = LoggerContent();
*/


interface Input {
  showDevice: boolean;
  precision: number;
  attribute: AttributeInput;
}

type Props = WidgetProps<Input>;

class AttributeReadOnly extends Component<Props> {
  public render() {
    const { device, name } = this.deviceAndAttribute();

    const value = this.value();
    const style: CSSProperties = { padding: "0.5em", whiteSpace: "nowrap" };
    const inner = this.props.inputs.showDevice ? (
      <Fragment>
        {device}/{name}: {value}
      </Fragment>
    ) : (
      <Fragment>
        {name}: {value}
      </Fragment>
    );

    return <div style={style}>{inner}</div>;
  }

  private value(): ReactNode {
    if (this.props.mode !== "run") {
      return <span style={{ fontStyle: "italic" }}>value</span>;
    }

    const {
      attribute: { value, unit },
      precision
    } = this.props.inputs;

    let result: ReactNode;
    if (Number(parseFloat(value)) === value) {
      result = value.toFixed(precision);
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

  private deviceAndAttribute(): { device: string; name: string } {
    const { attribute } = this.props.inputs;
    const device = attribute.device || "device";
    const name = attribute.attribute || "attribute";
    return { device, name };
  }
}

const definition: WidgetDefinition = {
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
    
/*     precision: {
      type: "number",
      label: "Precision",
      default: 2
    }, */
/*     showDevice: {
      type: "boolean",
      label: "Device Name",
      default: true
    } */
  }
};

export default { component: AttributeReadOnly, definition };
