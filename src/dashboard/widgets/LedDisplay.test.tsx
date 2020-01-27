import React from "react";
import { AttributeInput } from "../types";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LedDisplay from "./LedDisplay";

interface Input {
  showAttributeValue: boolean;
  showAttributeName: boolean;
  showDeviceName: boolean;
  compare: number;
  relation: string;
  attribute: AttributeInput;
  trueColor: string;
  falseColor: string;
  ledSize: number;
  textSize: number;
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
      enumlabels: [],
      write: writeArray,
      value: "",
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
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
      enumlabels: [],
      write: writeArray,
      value: "",
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("led");
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
      value: "",
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "edit",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("led");
  });

  it("renders if the value is not set ", () => {
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
      value: undefined,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
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

  it("hide the device name if showDeviceName is not set", () => {
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
      value: 10,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: false,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).not.toContain("sys/tg_test/1");
  });

  it("show the device name if showDeviceName is set", () => {
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
      value: 10,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("sys/tg_test/1");
  });

  it("hide the attribute name if showAttributeName is not set", () => {
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
      value: 10,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: false,
      showDeviceName: false,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).not.toContain("short_scalar");
  });

  it("show the attribute name if showAttributeName is set", () => {
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
      value: 10,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("short_scalar");
  });

  it("hide the attribute value if showAttributeValue is not set", () => {
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
      value: 1000000,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: false,
      showAttributeName: false,
      showDeviceName: false,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).not.toContain(1000000);
  });

  it("show the attribute value if showAttributeValue is set", () => {
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
      value: 1000000,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain(1000000);
  });

  it("displays true colored led if condition is met", () => {
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
      value: 10,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#00ff00",
      falseColor: "#ff0000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("00ff00");
  });

  it("displays false colored led if condition is not met", () => {
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
      value: 30,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#00ff00",
      falseColor: "#ff0000",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("ff0000");
  });

  it("displays value in white (when background is dark)", () => {
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
      value: 30,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#fefefe",
      falseColor: "#010101",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("ffffff");
  });

  it("displays value in black (when background is light)", () => {
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
      value: 30,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#010101",
      falseColor: "#fefefe",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("000000");
  });

  it("it handles an undefined relation", () => {
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
      value: 10,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "¯_(ツ)_/¯",
      attribute: myAttributeInput,
      trueColor: "#000000",
      falseColor: "#ffffff",
      ledSize: 2,
      textSize: 2
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

  it("displays true colored LED if less than or equal condition is met", () => {
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
      value: 20,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<=",
      attribute: myAttributeInput,
      trueColor: "#000000",
      falseColor: "#ffffff",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("000000");
  });

  it("displays true colored LED if greater than  condition is met", () => {
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
      value: 30,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: ">",
      attribute: myAttributeInput,
      trueColor: "#000000",
      falseColor: "#ffffff",
      ledSize: 2,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).html()).toContain("000000");
  });

  it("it handles a null value", () => {
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
      value: null,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#ffffff",
      falseColor: "#000000",
      ledSize: 2,
      textSize: 2
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

  it("displays correct LED size", () => {
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
      value: 10,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#00ff00",
      falseColor: "#ff0000",
      ledSize: 10,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).find("Led").get(0).props.ledSize).toBe("10em");
  });

  it("displays correct text size", () => {
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
      value: 10,
      writeValue: "",
      timestamp: timestamp
    };

    myInput = {
      showAttributeValue: true,
      showAttributeName: true,
      showDeviceName: true,
      compare: 20,
      relation: "<",
      attribute: myAttributeInput,
      trueColor: "#00ff00",
      falseColor: "#ff0000",
      ledSize: 10,
      textSize: 2
    };

    const element = React.createElement(LedDisplay.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: myInput
    });
    expect(shallow(element).children().first().get(0).props.style).toHaveProperty(
      'fontSize',
      '2em',
    );
  });
});
