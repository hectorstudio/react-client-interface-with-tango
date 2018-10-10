import React from "react";
import { LineChart, Line, CartesianGrid, Tooltip, YAxis, XAxis, Label } from 'recharts';


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

  const plotterSampleValues = Array(100)
  .fill(0)
  .map((_, i) => ({
    value: Math.sin(i/100*Math.PI*2) - 0.5*Math.cos(i/25*Math.PI*2),
  }));

  class AttributePlotter extends React.Component {
    constructor(props) {
      super(props);
      const time = (new Date()).getTime();
      this.state = {
        values: [],
        startTime: time,
      };
    }
  
    componentWillReceiveProps(newProps) {
      if (this.props.editMode || this.props.libraryMode) {
        return;
      }
  
      const oldValues = this.state.values;
      const startTime = this.state.startTime;
      const newValue = newProps.value;
      //Difference in seconds between "now" and when the plot was created, rounded to one decimal place.
      const newTime = Math.round( 10 * ((new Date()).getTime() - startTime) / 1000) / 10;
      if (oldValues.length === 0 || newValue !== oldValues.slice(-1)[0].value) {
        const values = [
          ...oldValues,{ value: newValue, time: newTime}
        ];
        this.setState(...this.state, { values });
      }
    }
  
    render() {
      const liveMode = !this.props.editMode && !this.props.libraryMode;
      const values = liveMode
          ? this.state.values
          : plotterSampleValues;
  
      const {nbrDataPoints, width, height, showGrid, yAxisLabel} = this.props.params;
      const lastValues = nbrDataPoints === 0 ? [] : values.slice(-nbrDataPoints);
      return (
        <div
          style={{
            border: "1px solid lightgray",
            padding: "0.25em",
            fontSize: "small"
          }}
        >
          <LineChart data={lastValues} width={width} height={height}>
            {liveMode && <XAxis dataKey="time">
              <Label  offset={-3} position="insideBottom" value="Δs"/>
            </XAxis>}
            <YAxis> 
              {liveMode && <Label angle={-90} position="insideLeft" value={yAxisLabel}/> }
            </YAxis>
            {liveMode && <Tooltip/>}
            {showGrid && <CartesianGrid vertical={false} stroke="#eee" strokeDasharray="5 5" /> }
            <Line dot={false} isAnimationActive={false} type='linear' dataKey="value" stroke="#ff7300" yAxisId={0}/>
          </LineChart>
        </div>
      );
    }
  }

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
  },
  {
    type: "ATTRIBUTE_PLOTTER",
    name: "Attribute plotter",
    component: AttributePlotter,
    fields: ["device", "attribute"],
    params: [
      {
        name: "nbrDataPoints",
        type: "number",
        default: 100,
        description: "№ Entries"
      },
      {
        name: "width",
        type: "number",
        default: 300,
        description: "Width (px)"
      },
      {
        name: "height",
        type: "number",
        default: 200,
        description: "Height (px)"
      },
      {
        name: "yAxisLabel",
        type: "string",
        default: "",
        description: "Label y-axis"
      },
      {
        name: "showGrid",
        type: "boolean",
        default: true,
        description: "Show grid"
      },
    ]
  }
];

export function getWidgetDefinition(type) {
  return WIDGET_DEFINITIONS.find(definition => definition.type === type);
}
