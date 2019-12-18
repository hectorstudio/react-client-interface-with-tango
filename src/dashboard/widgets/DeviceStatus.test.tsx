import React from "react";
import { DeviceInput, AttributeInput } from "../types";

import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import DeviceStatus from "./DeviceStatus";

configure({ adapter: new Adapter() });

describe("DeviceStatus", () => {
  let myDeviceInput:DeviceInput;
  myDeviceInput = {
    alias: "",
    name: "sys/tg_test/1"
  }
  let myAttributeInput: AttributeInput;
  myAttributeInput = {
    attribute: "state",
    dataFormat: "scalar",
    dataType: "DevState",
    device: "",
    enumlabels: [],
    history: [],
    isNumeric: false,
    timestamp: 1,
    unit: "",
    write: () => {},
    value: "RUNNING",
    writeValue: null,
  }
  it("renders with parameters correctly read", () => {

    const element = React.createElement(DeviceStatus.component, {
      mode: "run",
      t0: 1,
      actualWidth: 500,
      actualHeight: 140,
      inputs: {
        LEDSize: 1,
        showDeviceName: true,
        showStateLED: true,
        showStateString: true,
        textSize: 3,
        device: myDeviceInput,
        state: myAttributeInput,
      }
    });
    const elemNoWhiteSpace = shallow(element).html().replace(/\s/g, '');
    expect(elemNoWhiteSpace).toContain("sys/tg_test/1");
    expect(elemNoWhiteSpace).toContain("RUNNING");
    expect(elemNoWhiteSpace).toContain("darkgreen");
    expect(elemNoWhiteSpace).toContain("height:1em");
    expect(elemNoWhiteSpace).toContain("font-size:3em");
  });

})