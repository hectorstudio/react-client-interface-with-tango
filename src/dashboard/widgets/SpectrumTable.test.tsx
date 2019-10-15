import React from "react";
import { AttributeInput } from "../types";

import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SpectrumTable from "./SpectrumTable";
import LedDisplay from "./LedDisplay";

interface Input {
  showDevice: boolean;
  showAttribute: boolean;
  attribute: AttributeInput;
}

configure({ adapter: new Adapter() });

describe("SpectrumTable", () => {
  let myAttributeInput: AttributeInput;
  let myInput: Input;
  var writeArray: any = [];
  var date = new Date();
  var timestamp = date.getTime();

  it("renders without crashing", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "double_spectrum",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      write: writeArray,
      value: [54],
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
        showDevice: true,
        showAttribute: true,
        attribute: myAttributeInput
    };

    const element = React.createElement(SpectrumTable.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain( "54");
  });

  it("renders all elements in the array into a table", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "double_spectrum",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      write: writeArray,
      value: [34, 54, 65],
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
        showDevice: true,
        showAttribute: true,
        attribute: myAttributeInput
    };

    const element = React.createElement(SpectrumTable.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect((shallow(element).html().match(/<td/g) || []).length).toEqual(3);
  });

  it("renders empty array in run mode", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "double_spectrum",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      write: writeArray,
      value: [],
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
        showDevice: true,
        showAttribute: true,
        attribute: myAttributeInput
    };

    const element = React.createElement(SpectrumTable.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain( "sys/tg_test/1/double_spectrum");
  });

  it("renders in edit mode", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "double_spectrum",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      write: writeArray,
      value: [],
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      showAttribute: true,
      attribute: myAttributeInput
    };
    const element = React.createElement(SpectrumTable.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("sys/tg_test/1/double_spectrum");
  });

  it("renders in edit mode before device and attribute are set", () => {
    // @ts-ignore: Deliberately set up for test without device or attribute
    myAttributeInput = {
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      write: writeArray,
      value: [],
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      showAttribute: true,
      attribute: myAttributeInput
    };
    const element = React.createElement(SpectrumTable.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("<table>");
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
      write: writeArray,
      value: [],
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
        showDevice: false,
        showAttribute: false,
        attribute: myAttributeInput
    };

    const element = React.createElement(SpectrumTable.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).not.toContain("sys/tg_test/1");
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
      write: writeArray,
      value: undefined,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
        showDevice: true,
        showAttribute: true,
        attribute: myAttributeInput
    };

    const element = React.createElement(SpectrumTable.component, {
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
      write: writeArray,
      value: null,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
        showDevice: true,
        showAttribute: true,
        attribute: myAttributeInput
    };

    const element = React.createElement(SpectrumTable.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("sys/tg_test/1/double_spectrum");
  });


});