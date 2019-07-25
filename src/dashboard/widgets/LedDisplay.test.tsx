import React from "react";
import { AttributeInput } from "./types";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { LedReadOnly } from "./LedDisplay";

configure({ adapter: new Adapter() });

describe("LedReadOnly", () => {
  let myAttributeInput: AttributeInput;

  it("renders without crashing", () => {
    myAttributeInput = {
      device: "sys/tg_test/1",
      attribute: "short_scalar",
      history: [],
      dataType: "",
      dataFormat: "",
      isNumeric: true,
      unit: "",
      write: []
    };
    expect(shallow(<LedReadOnly inputs={myAttributeInput} />).html()).toContain(
      "led"
    );
  });

  it("hide the attribute name if showDevice is not set", () => {
    let myAttributeInput = {
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
        value: 100
      }
    };

    expect(
      shallow(<LedReadOnly mode="run" inputs={myAttributeInput} />).html()
    ).not.toContain("double_scalar");
  });

  it("displays the attribute name if showDevice is set", () => {
    let myAttributeInput = {
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
        value: 100
      }
    };

    expect(
      shallow(<LedReadOnly mode="run" inputs={myAttributeInput} />).html()
    ).toContain("double_scalar");
  });

  it("displays green-led if condition is not met", () => {
    let myAttributeInput = {
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
        value: 100
      }
    };

    expect(
      shallow(<LedReadOnly mode="run" inputs={myAttributeInput} />).html()
    ).toContain("green-led");
  });

  it("displays an orange led if condition is met", () => {
    let myAttributeInput = {
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
        value: 10
      }
    };

    expect(
      shallow(<LedReadOnly mode="run" inputs={myAttributeInput} />).html()
    ).toContain("orange-led");
  });

  it("displays an red led if condition is met", () => {
    let myAttributeInput = {
      classColor: "red-led",
      relation: "<",
      compare: 20,
      showDevice: "true",
      attribute: {
        attribute: "double_scalar",
        dataFormat: "scalar",
        dataType: "DevDouble",
        device: "sys/tg_test/1",
        isNumeric: true,
        timestamp: 123456,
        unit: "",
        value: 10
      }
    };

    expect(
      shallow(<LedReadOnly mode="run" inputs={myAttributeInput} />).html()
    ).toContain("red-led");
  });
});
