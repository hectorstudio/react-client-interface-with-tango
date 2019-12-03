import React from "react";
import { CommandInput } from "../types";

import { configure, shallow } from "enzyme";
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
        cooldown: 0,
        textColor: "black",
        backgroundColor: "white",
        size: 1,
        font: "Helvetica"
      }
    });
    const tmp = shallow(element).html()  || ""
    const elemNoWhiteSpace = tmp.replace(/\s/g, '');
    expect(elemNoWhiteSpace).toContain("background-color:black");
    expect(elemNoWhiteSpace).toContain("background-color:white");
    expect(elemNoWhiteSpace).toContain("font-size:1em");
    expect(elemNoWhiteSpace).toContain("font-family:Helvetica");
    expect(elemNoWhiteSpace).toContain("Pressthisbutton");
  });
});
