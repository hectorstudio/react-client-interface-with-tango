import React from "react";

function randomNumber(limit) {
  return Math.floor(Math.random() * limit);
}

const recorderSampleValues = Array(100)
  .fill(0)
  .map((_, i) => ({
    h: randomNumber(24),
    m: randomNumber(60),
    s: randomNumber(60),
    value: i
  }));

class AttributeRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: []
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.editMode || this.props.libraryMode) {
      return;
    }

    const oldValues = this.state.values;
    const newValue = newProps.value;
    if (oldValues.length === 0 || newValue !== oldValues.slice(-1)[0].value) {
      const now = new Date();
      const values = [
        ...oldValues,
        {
          value: newValue,
          h: now.getHours(),
          m: now.getMinutes(),
          s: now.getSeconds()
        }
      ];
      this.setState({ values });
    }
  }

  padZero(num) {
    const s = String(num);
    return (s.length === 1 ? "0" : "") + s;
  }

  render() {
    const values =
      this.props.editMode || this.props.libraryMode
        ? recorderSampleValues
        : this.state.values;

    const numShow = this.props.params.numShow;
    const lastValues = numShow === 0 ? [] : values.slice(-numShow);
    const numHiding = values.length - lastValues.length;

    return (
      <div
        style={{
          border: "1px solid lightgray",
          padding: "0.25em",
          fontSize: "small"
        }}
      >
        <table style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {lastValues.map(({ h, m, s, value }, i) => (
              <tr key={i}>
                <td style={{ paddingRight: "0.5em" }}>
                  {this.padZero(h)}:{this.padZero(m)}:{this.padZero(s)}
                </td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {values.length === 0 && <div>No values recorded.</div>}
      </div>
    );
  }
}

export const WIDGET_DEFINITIONS = [
  {
    type: "ATTRIBUTE_READ_ONLY",
    name: "Read-Only Attribute",
    component: ({
      device,
      attribute,
      libraryMode,
      editMode,
      value,
      params: { scientific, showDevice, showAttribute }
    }) => {
      const displayValue =
        value == null
          ? "-"
          : scientific
            ? Number(value).toExponential(2)
            : value;

      // Ugly logic to deal with all combinations of options and device/attribute presence
      // This might be simply an unnecessary feature, so don't spend time on improving it yet

      const deviceLabel = device || <i>device</i>;
      const attributeLabel = attribute || <i>attribute</i>;
      const labels = (showDevice ? [deviceLabel] : []).concat(
        showAttribute ? [attributeLabel] : []
      );
      const label =
        labels.length === 2 ? (
          <span>
            {deviceLabel}/{attributeLabel}
          </span>
        ) : (
          labels.length === 1 ? labels[0] : null
        );

      return (
        <div style={{ backgroundColor: "#eee", padding: "0.5em" }}>
          {label}
          {showDevice || showAttribute ? ": " : ""}
          {libraryMode || editMode ? <i>value</i> : displayValue}
        </div>
      );
    },
    fields: ["device", "attribute"],
    params: [
      {
        name: "scientific",
        type: "boolean",
        default: false,
        description: "Sci. Notation"
      },
      {
        name: "showDevice",
        type: "boolean",
        default: false,
        description: "Show Device"
      },
      {
        name: "showAttribute",
        type: "boolean",
        default: true,
        description: "Show Attribute"
      }
    ]
  },

  // {
  //   type: "MOTOR_CONTROL",
  //   name: "Motor Control",
  //   component: ({ value, libraryMode, editMode }) => {
  //     const buttonStyle = { fontSize: "small", padding: "0.5em", width: "2em" };
  //     const buttonStyle2 = { ...buttonStyle, marginLeft: "-1px" };
  //     return (
  //       <div>
  //         <button style={buttonStyle} className="fa fa-plus" />
  //         <button style={buttonStyle2} className="fa fa-minus" />{" "}
  //         <span>Position: </span>
  //         <span>{libraryMode || editMode ? <i>position</i> : value}</span>
  //       </div>
  //     );
  //   },
  //   fields: ["device"],
  //   params: [
  //     {
  //       name: "stepSize",
  //       type: "number",
  //       default: 0,
  //       description: "Step Size"
  //     }
  //   ]
  // },

  {
    type: "LABEL",
    name: "Label",
    component: ({ editMode, libraryMode, params: { text } }) => (
      <div
        style={{
          border: editMode ? "1px dashed gray" : "",
          padding: "0.5em"
        }}
      >
        {text || (editMode || libraryMode ? <i>Your Text Here</i> : null)}
      </div>
    ),
    fields: [],
    params: [
      {
        name: "text",
        type: "string",
        default: "",
        description: "Text"
      }
    ]
  },

  {
    type: "ATTRIBUTE_RECORDER",
    name: "Attribute Recorder",
    component: AttributeRecorder,
    fields: ["device", "attribute"],
    params: [
      {
        name: "numShow",
        type: "number",
        default: 5,
        description: "№ Entries"
      }
    ]
  }
];

export function getWidgetDefinition(type) {
  return WIDGET_DEFINITIONS.find(definition => definition.type === type);
}
