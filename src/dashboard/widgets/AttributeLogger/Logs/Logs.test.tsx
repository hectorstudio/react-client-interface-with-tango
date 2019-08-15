import React from "react";
import { configure, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { AttributeLog } from "./Logs";

configure({ adapter: new Adapter() });

describe("Logs", () => {
  it("renders without crashing when no logs are available", () => {
    const myLogs = React.createElement(AttributeLog, {});
    expect(render(myLogs).html()).toContain("No logs available");
  });

  it("displays a log if one is provided", () => {
    const myLogs = React.createElement(AttributeLog, {
      deviceName: "test device",
      values: "The current status",
      valueLog: [
        { timestamp: 12345, value: "Message 1" },
        { timestamp: 222222, value: "Message 2" },
        { timestamp: 333333, value: "The current status" }
      ]
    });
    //to show the test device

    const result = render(myLogs).html();
    expect(result).toContain("on test device");
    //to have the messages from the list (oldest and newest tested)
    expect(result).toContain("Message 1");
    expect(result).toContain("The current status");
  });

  it("displays 'on device ...' only if a device name is proviced ", () => {
    const myLogs = React.createElement(AttributeLog, {
      values: "The current status",
      valueLog: [{ timestamp: 12345, value: "Message 1" }]
    });

    //to show the test device
    expect(render(myLogs).html()).toEqual(expect.not.stringContaining("on "));
  });

  it("displays a log if one is provided  - but only if values is not null", () => {
    const myLogs = React.createElement(AttributeLog, {
      deviceName: "test device",
      values: null,
      valueLog: [
        { timestamp: 12345, value: "Message 1" },
        { timestamp: 222222, value: "Message 2" },
        { timestamp: 333333, value: "The current status" }
      ]
    });
    //to show the test device

    const result = render(myLogs).html();
    expect(result).toContain("test device");
    //to have the messages from the list (oldest and newest tested)
    expect(result).toContain("No logs available");
    expect(result).toEqual(expect.not.stringContaining("Message 1"));
  });
});
