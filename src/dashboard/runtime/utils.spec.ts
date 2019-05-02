import { publishedDevices, resolveDevice } from "./utils";
import { InputDefinitionMapping, InputMapping } from "../types";

test("publishing devices", () => {
  const inputs: InputMapping = {
    device1: "device one",
    device2: "device two"
  };

  const definitions: InputDefinitionMapping = {
    device1: {
      type: "device",
      publish: "$device1"
    },
    device2: {
      type: "device",
      publish: "$device2"
    }
  };

  const published = publishedDevices(inputs, definitions);
  expect(published["$device1"]).toBe("device one");
  expect(published["$device2"]).toBe("device two");
});

test("resolving published device", () => {
  const published = {
    $device: "some device"
  };

  const resolved = resolveDevice(published, "another device", "$device");
  expect(resolved).toBe("some device");

  const nonResolved = resolveDevice(published, "another device");
  expect(nonResolved).toBe("another device");
});

test("throw when publishing name that doesn't start with $", () => {
  const inputs: InputMapping = {
    device: "a device"
  };

  const definitions: InputDefinitionMapping = {
    device: { type: "device", publish: "a name" }
  };

  expect(() => publishedDevices(inputs, definitions)).toThrow();
});
