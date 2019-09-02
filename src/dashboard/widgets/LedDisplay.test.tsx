import React from "react";
import { AttributeInput } from "../types";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LedDisplay from "./LedDisplay";

interface Input {
  showDevice: boolean;
  compare: number;
  relation: string;
  attribute: AttributeInput;
  classColor: SelectInputDefinitionOption<"red-led" | "orange-led">;
}

configure({ adapter: new Adapter() });

describe("LedReadOnly", () => {
  let myAttributeInput: AttributeInput;
  let myInput: Input;
  var writeArray: any = [];
  var date = new Date();
  var timestamp = date.getTime();

  it("renders without crashing", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "short_scalar",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      write: writeArray,
      value: "",
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      compare: 20,
      relation: "<",
      classColor: "orange-led",
      attribute: myAttributeInput
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("led");
  });

  it("renders in edit mode", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "short_scalar",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      write: writeArray,
      value: "",
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      compare: 20,
      relation: "<",
      classColor: "orange-led",
      attribute: myAttributeInput
    };
    const element = React.createElement(LedDisplay.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("orange-led");
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
      value: "",
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showDevice: true,
      compare: 20,
      relation: "<",
      classColor: "orange-led",
      attribute: myAttributeInput
    };
    const element = React.createElement(LedDisplay.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("orange-led");
  });

  it("applies the colour-blank class if the value is not set ", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "short_scalar",
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
      compare: 20,
      relation: "<",
      classColor: "orange-led",
      attribute: myAttributeInput
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("led-blank");
  });

  it("hide the attribute name if showDevice is not set", () => {
    myInput = {
      classColor: "orange-led",
      relation: "<",
      compare: 20,
      showDevice: false,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: 100,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).not.toContain("double_scalar");
  });

  it("displays the attribute name if showDevice is set", () => {
    myInput = {
      classColor: "orange-led",
      relation: "<",
      compare: 20,
      showDevice: true,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: 100,
        compare: 20,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };
    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("double_scalar");
  });

  it("displays green-led if condition is not met", () => {
    myInput = {
      classColor: "orange-led",
      relation: "=",
      compare: 19,
      showDevice: true,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: 100,
        compare: 20,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("green-led");
  });

  it("displays an orange led if condition is met", () => {
    myInput = {
      classColor: "orange-led",
      relation: ">=",
      compare: 10,
      showDevice: true,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: 10,
        compare: 20,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("orange-led");
  });

  it("it handles an undefined relation", () => {
    myInput = {
      classColor: "red-led",
      relation: "¯_(ツ)_/¯",
      compare: 20,
      showDevice: true,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: 10,
        compare: 20,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("green-led");
  });

  it("displays an red led if less than or equal condition is met", () => {
    myInput = {
      classColor: "red-led",
      relation: "<=",
      compare: 20,
      showDevice: true,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: 10,
        compare: 20,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("red-led");
  });
  it("displays an red led if greater than  condition is met", () => {
    myInput = {
      classColor: "red-led",
      relation: ">",
      compare: 5,
      showDevice: true,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: 10,
        compare: 20,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("red-led");
  });

  it("it handles an undefined value", () => {
    myInput = {
      classColor: "red-led",
      relation: "<=",
      compare: 20,
      showDevice: true,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: undefined,
        compare: 20,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("green-led");
  });

  it("it handles a null value", () => {
    myInput = {
      classColor: "red-led",
      relation: ">",
      compare: 20,
      showDevice: true,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: null,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("red-led");
  });

  it("it handles an undefined relation", () => {
    myInput = {
      classColor: "red-led",
      relation: "¯_(ツ)_/¯",
      compare: 20,
      showDevice: true,
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: 10,
        writeValue: "",
        history: [],
        write: writeArray
      }
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("green-led");
  });
});
