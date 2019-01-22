import React, { Component } from "react";
import { connect } from "react-redux";

import { IRootState } from "../../state/reducers";
import { IWidget } from "../../types";
import { componentForWidget, definitionForWidget, bundleForWidget } from "../../newWidgets";
import { TILE_SIZE } from "../constants";

import { changeEventEmitter } from "./emitter";
import { extractModelsFromWidgets, enrichedInputs } from "./lib";

interface IProps {
  widgets: IWidget[];
  tangoDB: string;
}

interface IState {
  attributes: { [model: string]: any };
}

class RunCanvas extends Component<IProps, IState> {
  private unsub?: () => void;

  public constructor(props) {
    super(props);
    this.state = { attributes: {} };
  }

  public componentDidMount() {
    const { widgets, tangoDB } = this.props;
    const models = extractModelsFromWidgets(widgets);
    const emit = changeEventEmitter(tangoDB, models);
    this.unsub = emit(event => {
      const {
        device,
        name,
        data: { value }
      } = event;
      const model = `${device}/${name}`;
      const attributes = { ...this.state.attributes, [model]: value };
      this.setState({ attributes });
    });
  }

  public componentWillUnmount() {
    if (this.unsub) {
      this.unsub();
    }
  }

  public render() {
    const { widgets } = this.props;

    return (
      <div className="Canvas run">
        {widgets.map((widget, i) => {
          const { component, definition } = bundleForWidget(widget)!;
          const { x, y } = widget;

          const inputs = enrichedInputs(widget.inputs, definition.inputs, this.state.attributes);
          const props = { mode: "run", inputs };

          // ???
          const element = React.createElement(component as any, props);
          return (
            <div
              key={i}
              className="Widget"
              style={{ left: 1 + x * TILE_SIZE, top: 1 + y * TILE_SIZE }}
            >
              {element}
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state: IRootState) {
  return {
    widgets: state.widgets.widgets
  };
}

export default connect(mapStateToProps)(RunCanvas);

// import React, { Component } from "react";
// import PropTypes from "prop-types";

// import { getWidgetDefinition } from "../../utilsOld";
// import { widget, widgetDefinition, subCanvas } from "../../propTypes";

// class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { error: null };
//   }

//   componentDidCatch(error) {
//     this.setState({ error });
//   }

//   render() {
//     if (this.state.error == null) {
//       return this.props.children;
//     }

//     return (
//       <div style={{ backgroundColor: "#ff8888" }}>
//         {String(this.state.error)}
//       </div>
//     );
//   }
// }

// export default class RunCanvas extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       attributes: {}
//     };
//   }

//   modelsForSubcanvas(canvas, parent) {
//     return canvas.widgets
//       .map((widget, i) => {
//         const deviceSource = widget.device[0] === "__parent__" ? parent : widget;
//         return [deviceSource.device, widget.attribute];
//       })
//       .filter(([device, attribute]) => device != null && attribute != null)
//       .reduce((r, [device, attribute]) => {
//         attribute.map((attrib) => r.push(`${device}/${attrib}`));
//         return r;
//       }, []);
//   }

//   isSubcanvasWidget(widget) {
//     return this.definitionForWidget(widget).__canvas__ != null;
//   }

//   connect() {
//     const canvasModels = this.props.widgets
//       .filter(widget => widget.device != null)
//       .filter(widget => this.isSubcanvasWidget(widget))
//       .map(widget => {
//         const canvasIndex = this.definitionForWidget(widget).__canvas__;
//         const canvas = this.props.subCanvases[canvasIndex];
//         return this.modelsForSubcanvas(canvas, widget);
//       })
//       .reduce((accum, curr) => [...accum, ...curr], []);

//     let widgetModels = this.props.widgets.filter(({ canvas }) => canvas == null);
//     let tmp = [];
//     widgetModels.map(({ device, attribute }) => {
//       device.map((name, i) => {
//         if(device != null && attribute[i] != null){
//           tmp.push(`${name}/${attribute[i]}`)
//         }
//       })
//     });

//     widgetModels = tmp;
//     const models = [...canvasModels, ...widgetModels].filter(
//       // Unique
//       (val, idx, arr) => arr.indexOf(val) === idx
//     );
//     console.log(models);
//     function socketUrl(tangoDB) {
//       const loc = window.location;
//       const protocol = loc.protocol.replace("http", "ws");
//       return protocol + "//" + loc.host + "/" + tangoDB + "/socket";
//     }

//     this.socket = new WebSocket(socketUrl(this.props.tangoDB) + "?dashboard", "graphql-ws");
//     const query = `
//           subscription newChangeEvent($models: [String]!) {
//             changeEvent(models: $models) {
//               eventType
//               device
//               name
//               data {
//                 value
//                 time
//               }
//             }
//           }`;
//     const variables = { models };
//     const payload = { query, variables };

//     this.socket.addEventListener("message", msg => {
//       const data = JSON.parse(msg.data);
//       if (data.type === "data") {
//         const changeEvent = data.payload.data.changeEvent;
//         if (changeEvent == null) {
//           return;
//         }

//         const updatedAttributes = changeEvent.reduce((accum, event) => {
//           const { value, time } = event.data;
//           const model = event.device + "/" + event.name;
//           return {
//             ...accum,
//             [model]: {
//               value,
//               time
//             }
//           };
//         }, {});

//         const oldAttributes = this.state.attributes;
//         const attributes = { ...oldAttributes, ...updatedAttributes };
//         this.setState({ attributes });
//       }
//     });

//     this.socket.addEventListener("open", () => {
//       const request = JSON.stringify({ type: "start", payload });
//       this.socket.send(request);
//     });
//   }

//   componentDidMount() {
//     this.connect();
//   }

//   componentWillUnmount() {
//     this.socket.close();
//   }

//   definitionForWidget(widget) {
//     return getWidgetDefinition(this.props.widgetDefinitions, widget.type);
//   }

//   entryForModel(device, attribute) {
//     const values = device.map((deviceName,i) => {
//       const model = deviceName + "/" + attribute[i];
//       return this.state.attributes[model] || {};
//     })
//     return values;
//   }

//   valueForModel(device, attribute) {
//     return this.entryForModel(device, attribute).map(({value}) => value);
//   }

//   timeForModel(device, attribute) {
//     return this.entryForModel(device, attribute).map(({time}) => new Date(time));
//   }

//   render() {
//     return (
//       <div className="Canvas run">
//         {this.props.widgets.map((widget, i) => {
//           const definition = this.definitionForWidget(widget);
//           const Widget = definition.component;
//           const { x, y, device, attribute, params } = widget;
//           const value = this.valueForModel(device, attribute);
//           const time = this.timeForModel(device, attribute);
//           const extraProps =
//             definition.__canvas__ != null
//               ? { attributes: this.state.attributes }
//               : {};

//           return (
//             <div key={i} className="Widget" style={{ left: x, top: y }}>
//               <ErrorBoundary>
//                 <Widget
//                   mode="run"
//                   device={device}
//                   attribute={attribute}
//                   value={value}
//                   time={time}
//                   params={params}
//                   {...extraProps}
//                 />
//               </ErrorBoundary>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }
// }

// RunCanvas.propTypes = {
//   subCanvases: PropTypes.arrayOf(subCanvas),
//   widgetDefinitions: PropTypes.arrayOf(widgetDefinition),
//   widgets: PropTypes.arrayOf(widget)
// };
