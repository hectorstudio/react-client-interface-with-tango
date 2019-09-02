import React from "react";
import { CommandInput } from "../types";

import { configure, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import commandExecutor from "./CommandExecutor";

configure({ adapter: new Adapter() });

describe("CommandExecutor", () => {
  let myCommandInput: CommandInput;

  it("renders without crashing", () => {
    myCommandInput = {
      device: "sys/tg_test/1",
      command: "configureArray({})",
      output: "",
      execute: () => null
    };

    const element = React.createElement(commandExecutor.component, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: {
        title: "Press this button",
        requireConfirmation: false,
        command: myCommandInput,
        displayOutput: true,
        cooldown: 0
      }
    });
    expect(render(element).html()).toContain("Press this button");
  });
});
