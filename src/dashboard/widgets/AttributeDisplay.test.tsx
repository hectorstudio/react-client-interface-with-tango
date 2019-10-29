import React from "react";
import { AttributeInput } from "../types";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AttributeDisplay from "./AttributeDisplay";

interface Input {
  showDevice: boolean;
  showAttribute: boolean;
  scientificNotation: boolean;
  precision: number;
  showEnumLables: boolean;
  attribute: AttributeInput;
}

configure({ adapter: new Adapter() });

describe("AttributeDisplayTests", () => {
  let myAttributeInput: AttributeInput;
  let myInput: Input;
  var writeArray: any = [];
  var date = new Date();
  var timestamp = date.getTime();

  it("renders all false without crashing", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "short_scalar",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      enumlabels: [],
      write: writeArray,
      value: "",
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: false,
      showAttribute: false,
      scientificNotation: false,
      precision: 2,
      showEnumLables: false,
      attribute: myAttributeInput
    };

    const element = React.createElement(AttributeDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("AttributeDisplay");
  });

  it("renders all true without crashing", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "short_scalar",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      enumlabels: [],
      write: writeArray,
      value: "",
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      showAttribute: true,
      scientificNotation: true,
      precision: 2,
      showEnumLables: true,
      attribute: myAttributeInput
    };

    const element = React.createElement(AttributeDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("AttributeDisplay");
  });

  it("renders in edit mode before device and attribute are set", () => {
    // @ts-ignore: Deliberately set up for test without device or attribute
    myAttributeInput = {
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      enumlabels: [],
      write: writeArray,
      value: [],
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      showAttribute: true,
      scientificNotation: true,
      precision: 2,
      showEnumLables: true,
      attribute: myAttributeInput
    };
    const element = React.createElement(AttributeDisplay.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("AttributeDisplay");
  });

  it("does not display the device name if showDevice is not set", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "double_spectrum",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      enumlabels: [],
      write: writeArray,
      value: [],
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: false,
      showAttribute: true,
      scientificNotation: true,
      precision: 2,
      showEnumLables: true,
      attribute: myAttributeInput
    };

    const element = React.createElement(AttributeDisplay.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).not.toContain("sys/tg_test/1");
  });

  it("does not display the device name if showAttribute is not set", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "double_spectrum",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      enumlabels: [],
      write: writeArray,
      value: [],
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      showAttribute: false,
      scientificNotation: true,
      precision: 2,
      showEnumLables: true,
      attribute: myAttributeInput
    };

    const element = React.createElement(AttributeDisplay.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).not.toContain("double_spectrum");
  });

  it("handles an undefined value", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "double_spectrum",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      enumlabels: [],
      write: writeArray,
      value: undefined,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      showAttribute: true,
      scientificNotation: true,
      precision: 2,
      showEnumLables: true,
      attribute: myAttributeInput
    };

    const element = React.createElement(AttributeDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("sys/tg_test/1/double_spectrum");
  });

  it("handles an null value", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "double_spectrum",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      enumlabels: [],
      write: writeArray,
      value: null,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      showAttribute: true,
      scientificNotation: true,
      precision: 2,
      showEnumLables: true,
      attribute: myAttributeInput
    };

    const element = React.createElement(AttributeDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("sys/tg_test/1/double_spectrum");
  });

});
