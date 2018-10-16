### Widgets Definitions

This is a non-final, work-in-progress description of the data structures involved in composing a widget definition.

A widget *definition* is the blueprint of a widget (a "class", as opposed to a widget in a dashboard (an "instance".)

A WidgetDefinition[] array is supplied at the top-level of three different components:
1. In the RunCanvas, in order to instantiate widgets that can be fed values from the corresponding Tango devices.
2. In the EditCanvas, in order to instantiate widgets that can be moved around and modified in the editor.
3. In the library sidebar, in order display a list of available widget types and instantiate a preview of each.

### WidgetDefinition

| key | type | description
|-|-|-
| type | string | Unique identifier for widget, e.g. "ATTRIBUTE_PLOTTER".
| name | string | Human-readable name of widget, e.g. "Attribute Plotter".
| component | WidgetComponent | Reference to React component class, e.g. AttributePlotter.
| fields | ("device" &#124; "attribute")[] | A list of fields required by the widget in order to connect*. Each field gets an input element in the field section of the widget inspector.
| params | WidgetParam[] | A list of configurable params exposed by the widget**. Each param gets an input element in the param section of the widget inspector.

\* Fields are core attributes of a widget. All widgets expose a subset of a limited number of fields. Currently the only permitted fields are "device" and "attribute".
\** Params are attributes that are particular to each widget and up to the developer to define and use.

### WidgetParam

| key | type | description
|-|-|-
| name | string | Name identifying the param, e.g. "showGrid".
| type | "boolean" &#124; "string" &#124; "number" | The type of the param, used among other things to determine the input element of the param in the editor inspector. A boolean gets a checkbox etc.
| default | any | Default value, e.g. false
| description | string | Human-readable description, e.g. "Show Grid"

Tentative, non-implemented keys:
| key | type | description
|-|-|-
| validation | ? | Could be used to restrict the set of permitted values on configuration level.
