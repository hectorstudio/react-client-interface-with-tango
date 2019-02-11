# Description

With this device explorer built on TangoGQL, you can:

1. View a list of all Tango devices
2. View and modify device properties
3. View and modify device attributes
4. View and execute device commands

# Usage

1. Clone the repository.
2. Run `npm install`.
3. Modify the `proxy` setting in `package.json` to reflect the location of the TangoGQL instance.
4. Type `npm start`.

# Authors

WebJive was written by the KITS Group at MAX IV Laboratory.

---

# How to create a widget

A widget is a bundle consisting of two objects: a definition and a component. The bundle is typically exported from a file:

    const definition = ...;
    class TheComponent extends React.Component ...

    export default { definition, component: TheComponent };

The definition is a declarative object describing the basic characteristics of a widget, and the inputs that it receives. In the React component for the widget, the inputs are made available through a prop named `input`.

Formal definitions are given below, but we'll start with an example demonstrating the basic idea. Note how the device is set in a single input, which publishes it to a variable that's available to the other inputs.

    const definition = {
      type: "MOTOR_CONTROL",
      name: "Motor Control",
      defaultWidth: 10,
      defaultHeight: 20,
      inputs: {
        device: {
          type: "device",
          publish: "$device",
        },
        position: {
          type: "attribute",
          device: "$device",
          attribute: "Position"
        },
        turnRight: {
          type: "command",
          device: "$device",
          command: "TurnRight"
        },
        turnLeft: {
          type: "command",
          device: "$device",
          command: "TurnLeft"
        }
      }
    }

The render method of the component implementation may look something like this:

    render() {
      const {
        position,
        turnRight,
        turnLeft
      } = this.props.inputs;

      return (
        <div>
          Position: {position.value}
          <button onClick={turnLeft}>Left</button>
          <button onClick={turnRight}>Right</button>
        </div>
      );
    }

The widget is then simply bundled:

    const bundle = { definition, component };

## Widget Definition

| Key | Type | Description
|-|-|-|-
| type | string | Type identifier for the widget. Must be unique (e.g. "ATTRIBUTE_PLOT".)
| name | string | The name of the widget shown to the user (e.g. "Attribute Plot".)
| defaultWidth | number | Default width (in number of tiles)
| defaultHeight | number | Default height (in number of tiles)
| inputs || An object where the keys are input names and the values are any of the input definitions below.

## Input Definitions

A question mark (e.g. `label?`) denotes an optional field.

### Base Input Definition
| Key | Type | Description
|-|-|-|-
| type | string | The type of input. Can assume the following values: boolean, number, string, complex, select, attribute, color, device, command
| label? | string | Label shown to the user in the widget inspector. If it's an empty string, no label is shown.
| default? | - | Default value of the input. The type depends on the type of input.
| required? | boolean | Whether the input is required for the widget to be valid or not. A dashboard cannot start with invalid widgets.

The following input types have no fields in addition to the above:
* "boolean". Manifests itself as a checkbox.
* "number". Manifests itself as a numeric input field.
* "string". Manifests itself as a string input field.
* "color". Manifests itself as a color picker.

### Select Input Definition

Manifests itself as a drop-down select with a predefined set of options.

| Key | Type | Description
|-|-|-|-
| options | Array of { name: string, value: any } | The available options, where `name` is the value shown to the user for each option.

### Complex Input Definition

An input that consists of muliple other inputs.

| Key | Type | Description
|-|-|-|-
| inputs | - | Input mapping with the same structure as the top-level widget definition one.
| repeat | boolean | If true, the complex input becomes an array of complex inputs. The user can add any number of inputs to this array.

### Device Input Definition

Manifests itself as an input where the user can select any of the devices in the database.

| Key | Type | Description
|-|-|-|-
| publish | string | If true, the device name is made available to other inputs as a variable (see example at the top.)

### Attribute Input Definition

An input representing a device attribute. Unless bound to a certain attribute, it manifests itself as an input where the user can select a device attribute.

| Key | Type | Description
|-|-|-|-
| dataFormat? | string | Restricts the attributes shown to the users by data format. Permitted values: "scalar" or "spectrum" or "image"
| dataType? | string | If "numeric", only numeric attributes are shown.
| device? | string | If set, the input is bound to this device.
| attribute? | string | If set, the input is bound to this attribute.

In the component, the input is an object with the following structure:

| Key | Type | Description
|-|-|-|-
| device | string | The device name
| attribute | string | The attribute name
| value | | The current value of the attribute
| write | function | A function which writes a value to the attribute when executed (NOT IMPLEMENTED.)

### Command Input Definition

An input representing a device command. Unless bound to a certain command, it manifests itself as an input where the user can select a device command.

| Key | Type | Description
|-|-|-|-
| device? | string | If set, the input is bound to this device.
| command? | string | If set, the input is bound to this command.
| intype? | string | If set, only commands with this intype are shown to the user.

In the component, the input is an object with the following structure:

| Key | Type | Description
|-|-|-|-
| device | string | The device name
| command | string | The command name
| execute | function | A function which executes the command when executed.
