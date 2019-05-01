import { enrichedInputs } from "./enrichment";
import { InputDefinitionMapping, InputMapping } from "../types";

const inputs: InputMapping = {
  device: "device1",
  attribute: {
    device: "device2",
    attribute: "attribute2"
  },
  command: {
    device: "device3",
    command: "command3"
  }
};

const inputDefinitions: InputDefinitionMapping = {
  device: {
    type: "device"
  },
  attribute: {
    type: "attribute"
  },
  command: {
    type: "command"
  }
};

test("device metadata", () => {
  const context = {
    deviceMetadataLookup(name) {
      return {
        alias: name + "_alias"
      };
    }
  };

  const { device } = enrichedInputs(inputs, inputDefinitions, context);
  expect(device.alias).toBe("device1_alias");
});

test("attribute values", () => {
  const context = {
    attributeValuesLookup(name) {
      return {
        value: name + "_value",
        writeValue: name + "_writeValue",
        timestamp: 12345
      };
    }
  };

  const { attribute } = enrichedInputs(inputs, inputDefinitions, context);
  expect(attribute.value).toBe("device2/attribute2_value");
  expect(attribute.writeValue).toBe("device2/attribute2_writeValue");
  expect(attribute.timestamp).toBe(12345);
});

test("attribute write", async () => {
  const context = {
    async onWrite() {
      return true;
    }
  };

  const spy = jest.spyOn(context, "onWrite");
  const { attribute } = enrichedInputs(inputs, inputDefinitions, context);

  const writeValue = Math.random();
  const result = await attribute.write(writeValue);

  expect(spy).toHaveBeenCalledWith("device2", "attribute2", writeValue);
  expect(result).toBe(true);

  spy.mockRestore();
});

test("command execution", async () => {
  const context = {
    async onExecute() {
      return true;
    }
  };

  const spy = jest.spyOn(context, "onExecute");
  const { command } = enrichedInputs(inputs, inputDefinitions, context);

  const argin = Math.random();
  const result = await command.execute(argin);

  expect(spy).toHaveBeenCalledWith("device3", "command3", argin);
  expect(result).toBe(true);

  spy.mockRestore();
});
