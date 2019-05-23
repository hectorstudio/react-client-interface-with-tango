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
    deviceMetadataLookup() {
      return {
        alias: "an alias"
      };
    }
  };

  const spy = jest.spyOn(context, "deviceMetadataLookup");
  const { device } = enrichedInputs(inputs, inputDefinitions, context);

  expect(device.alias).toBe("an alias");
  expect(spy).toHaveBeenCalledWith("device1");
});

test("attribute values", () => {
  const context = {
    attributeValuesLookup() {
      return {
        value: "a value",
        writeValue: "a write value",
        timestamp: 12345
      };
    }
  };

  const spy = jest.spyOn(context, "attributeValuesLookup");
  const { attribute } = enrichedInputs(inputs, inputDefinitions, context);

  expect(spy).toHaveBeenCalledWith("device2/attribute2");
  expect(attribute.value).toBe("a value");
  expect(attribute.writeValue).toBe("a write value");
  expect(attribute.timestamp).toBe(12345);
});

test("attribute write", async () => {
  const context = {
    async onWrite() {
      return;
    }
  };

  const spy = jest.spyOn(context, "onWrite");
  const { attribute } = enrichedInputs(inputs, inputDefinitions, context);

  await attribute.write("a write value");
  expect(spy).toHaveBeenCalledWith("device2", "attribute2", "a write value");
});

test("command execution", async () => {
  const context = {
    async onExecute() {
      return;
    }
  };

  const spy = jest.spyOn(context, "onExecute");
  const { command } = enrichedInputs(inputs, inputDefinitions, context);

  const argin = Math.random();
  await command.execute(argin);
  expect(spy).toHaveBeenCalledWith("device3", "command3", argin);
});

test("device input by default resolves to { name: <device name> }", () => {
  const { device } = enrichedInputs(inputs, inputDefinitions);
  expect(device).toEqual({ name: "device1" });
});

test("attribute.isNumeric by default resolves to false", () => {
  const { attribute } = enrichedInputs(inputs, inputDefinitions);
  expect(attribute.isNumeric).toBe(false);
});

test("attribute.dataType by default resolves to undefined", () => {
  const { attribute } = enrichedInputs(inputs, inputDefinitions);
  expect(attribute.dataType).toBe(undefined);
});

test("attribute.dataFormat by default resolves to undefined", () => {
  const { attribute } = enrichedInputs(inputs, inputDefinitions);
  expect(attribute.dataFormat).toBe(undefined);
});
