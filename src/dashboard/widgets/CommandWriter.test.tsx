import React from "react";
import { CommandInput } from "../types";

import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import commandWriter from "./CommandWriter";

configure({ adapter: new Adapter() });

describe("CommandWriter", () => {
  let myCommandInput: CommandInput; // CommandInputWithParameter;

  it("renders without crashing", () => {
    myCommandInput = {
      device: "sys/tg_test/1",
      command: "configureArray",
      // parameter: "",
      output: "",
      // dataType: "String",
      execute: () => null
    };

    const element = React.createElement(commandWriter.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: {
        title: "Press this button",
        requireConfirmation: true,
        command: myCommandInput,
        displayOutput: true,
        cooldown: 0,
        showDevice: true,
        showCommand: true
      }
    });
    expect(shallow(element).html()).toContain("sys/tg_test/1/configureArray");
  }); //renders without crashing

  it("renders with parameter", () => {
    myCommandInput = {
      device: "sys/tg_test/1",
      command: "DevString",
      parameter: "hello world",
      output: "",
      // dataType: "String",
      execute: () => null
    };

    const element = React.createElement(commandWriter.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: {
        title: "Press this button",
        requireConfirmation: true,
        command: myCommandInput,
        displayOutput: true,
        cooldown: 0,
        showDevice: true,
        showCommand: true
      }
    });
    expect(shallow(element).html()).toContain("hello world");
  }); //renders with parameter

  it("calls onSubmit prop function when form is submitted", () => {
    const onSubmitFn = jest.fn();
    const wrapper = mount(<form onSubmit={onSubmitFn} />);
    const form = wrapper.find("form");
    form.simulate("submit");
    expect(onSubmitFn).toHaveBeenCalledTimes(1);
  }); //Test onSubmit

  it("calls onChange prop function when form is changed", () => {
    const onChangeFn = jest.fn();
    const wrapper = mount(<form onChange={onChangeFn} />);
    const form = wrapper.find("form");
    form.simulate("change");
    expect(onChangeFn).toHaveBeenCalledTimes(1);
  }); //Test onChange
}); //CommandWriter
