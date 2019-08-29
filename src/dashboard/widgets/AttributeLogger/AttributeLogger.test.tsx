import React from "react";
import { AttributeInput } from "../../types";

import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { AttributeLogger } from "./AttributeLogger";
import { Provider } from "react-redux";
import store from "../../state/store";

configure({ adapter: new Adapter() });

describe("AttributeLogger", () => {
  React.useLayoutEffect = React.useEffect;
  const date = new Date();
  const timestamp = date.getTime();
  const writeArray: any = []; 

  const myAttributeInput: AttributeInput = {
    device: "sys/tg_test/1",
    attribute: "short_scalar",
    history: [],
    dataType: "",
    dataFormat: "",
    isNumeric: true,
    unit: "",
    write: writeArray,
    value: "This is not a love song",
    writeValue: "",
    timestamp: timestamp
  };
  

  it("renders without crashing", () => {
    const element = React.createElement(
      Provider,
      {
        store: store
      },
      React.createElement(AttributeLogger, {
        mode: "run",
        t0: 1,
        actualWidth: 100,
        actualHeight: 100,
        inputs: {
          showDevice: true,
          logIfChanged: true,
          linesDisplayed: 30,
          attribute: myAttributeInput
        }
      })
    );
    expect(mount(element).html()).toContain("This is not a love song");
  });

  it("in edit mode the log is not displayed", () => {
    const element = React.createElement(
      Provider,
      {
        store: store
      },
      React.createElement(AttributeLogger, {
        mode: "edit",
        t0: 1,
        actualWidth: 100,
        actualHeight: 100,
        inputs: {
          showDevice: true,
          logIfChanged: true,
          linesDisplayed: 30,
          attribute: myAttributeInput
        }
      })
    );
    expect(mount(element).html()).toEqual(
      expect.not.stringContaining("AttributeLog")
    );
  });

  it("The list updates when a new value comes in", () => {
    const attributeLogger = React.createElement(AttributeLogger, {
      mode: "run",
      t0: 1,
      actualWidth: 100,
      actualHeight: 100,
      inputs: {
        showDevice: true,
        logIfChanged: true,
        linesDisplayed: 30,
        attribute: myAttributeInput
      }
    });

    //check the status update when the message is different
    const provider = mount(
      <Provider store={store}>{attributeLogger}</Provider>
    );
    expect(provider.html()).toContain("This is not a love song");
    const prevProps = {
      inputs: { attribute: { value: "Old Message", timestamp: 11111 } }
    };

    //check the list population
    const shallowLogger = shallow(attributeLogger);
    const instance = shallowLogger.instance();

    expect(instance.componentDidUpdate)

    if (instance.componentDidUpdate) {
      instance.componentDidUpdate(prevProps, {});

      expect("valueLog" in instance.state);
      const messages = instance.state["valueLog"];
      const message = messages[0];
      expect(
        message.timestamp === timestamp &&
          message.value === "This is not a love song"
      );
    }
  });
});
