# How to create a widget

A widget is a bundle consisting of two objects: a definition and a React component. The bundle is typically exported from a file:

    const definition = ...;
    class TheComponent extends React.Component ...

    export default { definition, component: TheComponent };

The definition is a declarative object describing the basic characteristics of a widget, and the inputs that it receives. In the component for the widget, the inputs are made available through a prop named `input`.

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

## Type-Safe Widget Props

If widgets are implemented in TypeScript, type-safe component props, including widget inputs, can be obtained using the `WidgetProps` type mapping. The following steps illustrate how to adapt the widget described in the example above to TypeScript.

Create a type alias for the input definitions. Note that it's important that you use the `type` keyword; an interface won't work due to current limitations in TypeScript.

    type Inputs = {
      device: DeviceInputDefinition;
      position: AttributeInputDefinition;
      turnRight: CommandInputDefinition;
      turnLeft: CommandInputDefinition;
    }

Add the following type annotation to your `widgetDefinition`:

    const definition: WidgetDefinition<Inputs> = { // ...

Create a type alias for the component props using `WidgetProps` and `Inputs`:

    type Props = WidgetProps<Inputs>;

Now `Props` is a type alias corresponding to the props your component expects, with fairly high type accuracy. For example, if you type `props.inputs.pos`, your IDE will autocomplete to "position" and infer the right type. This is very helpful when developing and can reduce errors drastically. Use it the same way you would normally do with typed component props, i.e.

    class TheComponent extends React.Component<Props> {
      public constructor(props: Props) {
        // ...
      }
    }

for class-based components, or

    function TheComponent(props: Props) {
      // ....
    }

for function-based components.

## Widget Definition

| Key | Type | Description
|-|-|-
| type | string | Type identifier for the widget. Must be unique (e.g. "ATTRIBUTE_PLOT".)
| name | string | The name of the widget shown to the user (e.g. "Attribute Plot".)
| defaultWidth | number | Default width (in number of tiles)
| defaultHeight | number | Default height (in number of tiles)
| inputs || An object where the keys are input names and the values are any of the input definitions below.

## Input Definitions

A question mark (e.g. `label?`) denotes an optional field.

### Base Input Definition

All input definitions derive from a base definition, which means that the below fields are available in all input types.

| Key | Type | Description
|-|-|-
| type | string | The type of input. Can assume the following values: boolean, number, string, complex, select, attribute, color, device, command
| label? | string | Label shown to the user in the widget inspector. If it's an empty string, no label is shown.
| default? | - | Default value of the input. The type depends on the type of input.
| required? | boolean | Whether the input is required for the widget to be valid or not. A dashboard cannot start with invalid widgets.

The following input types have no fields in addition to the above:
* "boolean". Manifests itself as a checkbox.
* "string". Manifests itself as a string input field.
* "color". Manifests itself as a color picker.

### Number Input Definition

Manifests itself as an input field where the user can enter a numeric value.

| Key | Type | Description
|-|-|-
| nonNegative? | boolean | If true, the user can't enter negative values.

### Select Input Definition

Manifests itself as a drop-down select with a predefined set of options.

| Key | Type | Description
|-|-|-
| options | Array of { name: string, value: any } | The available options, where `name` is the value shown to the user for each option.

### Complex Input Definition

An input that consists of muliple other inputs.

| Key | Type | Description
|-|-|-
| inputs | - | Input mapping with the same structure as the top-level widget definition one.
| repeat | boolean | If true, the complex input becomes an array of complex inputs. The user can add any number of inputs to this array.

### Device Input Definition

Manifests itself as an input where the user can select any of the devices in the database.

| Key | Type | Description
|-|-|-
| publish | string | If true, the device name is made available to other inputs as a variable (see example at the top.)

In the component, the input is an object with the following structure:

| Key | Type | Description
|-|-|-
| name | string | The device name
| alias | string | The device alias, or null if none

### Attribute Input Definition

An input representing a device attribute. Unless bound to a certain attribute, it manifests itself as an input where the user can select a device attribute.

| Key | Type | Description
|-|-|-
| dataFormat? | string | Restricts the attributes shown to the users by data format. Permitted values: "scalar" or "spectrum" or "image"
| dataType? | string | If "numeric", only numeric attributes are shown.
| device? | string | If set, the input is bound to this device.
| attribute? | string | If set, the input is bound to this attribute.
| invalidates? | string[] | If set, a list of input names that will be invalidated when writing to the attribute. These inputs have to be attribute inputs in the root. See [Invalidation](#invalidation).

In the component, the input is an object with the following structure:

| Key | Type | Description
|-|-|-
| device | string | The device name
| attribute | string | The attribute name
| value | | The current value of the attribute
| writeValue | | The current write value of the attribute
| unit | string | The attribute unit, or null if none
| write | function | A function which writes a value to the attribute when executed. Signature:<br>`(value: any) => Promise<boolean>`

### Command Input Definition

An input representing a device command. Unless bound to a certain command, it manifests itself as an input where the user can select a device command.

| Key | Type | Description
|-|-|-
| device? | string | If set, the input is bound to this device.
| command? | string | If set, the input is bound to this command.
| intype? | string | If set, only commands with this intype are shown to the user.
| invalidates? | string[] | If set, a list of input names that will be invalidated when executing the command. These inputs have to be attribute inputs in the root.

In the component, the input is an object with the following structure:

| Key | Type | Description
|-|-|-
| device | string | The device name
| command | string | The command name
| execute | function | A function which executes the command when executed. Currently doesn't take input parameters. Signature:<br>`() => Promise<any>`

## Invalidation

An attribute input can be *invalidated*, which forces a refresh of its value and metadata outside of the event stream. This is used when there is a relationship between attributes and commands or other attributes, which should be immediately reflected in the UI to produce a consistent user experience. Invalidation is achieved by adding an `invalidates` field to the definition of the input that causes the invalidation – see [Attribute Input Definition](#attribute-input-definition) and [Comand Input Definition](#command-input-definition).

### Example

A device exposes a command `TurnOff` and an attribute `Power`. Executing `TurnOff` makes `Power` go to zero, which should be reflected immediately. This is achieved as follows:

    {
      …
      inputs: {
        device: {
          type: "device",
          publish: "$device"
        },
        power: {
          type: "attribute",
          device: "$device",
          attribute: "Power"
        },
        turnOff: {
          type: "command",
          device: "$device",
          command: "TurnOff",
          invalidates: ["power"]
        }
      }
    }

Notice that each string in the `invalidates` array refers to the name of an *input*, not of an attribute.
