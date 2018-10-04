import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import "./Dashboard.css";
import { connect } from "react-redux";
import { subscribeDevice } from "../actions/tango";

import { DragSource, DragDropContext, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const editWidgetSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};

function editWidgetCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const WIDGET_DEFINITIONS = [
  {
    type: "ATTRIBUTE_READ_ONLY",
    name: "Read-Only Attribute",
    component: ({ value, params: { scientific } }) => (
      <div style={{ backgroundColor: "#eee", padding: "0.5em" }}>
        {scientific ? Number(value).toExponential(2) : value}
      </div>
    ),
    libraryProps: {
      value: 0,
      params: {}
    },
    params: [
      {
        name: "scientific",
        type: "boolean",
        default: false
      }
    ]
  },

  {
    type: "MOTOR_CONTROL",
    name: "Motor Control",
    component: ({ value }) => (
      <div>
        <button>+</button>
        <button>-</button> <span>Position: </span>
        <span>{value}</span>
      </div>
    ),
    libraryProps: {
      value: 0
    },
    params: []
  },

  {
    type: "LABEL",
    name: "Label",
    component: ({ params: { text } }) => (
      <div style={{ border: "1px solid gray" }}>{text || "(Empty)"}</div>
    ),
    libraryProps: {
      params: { text: "Your Text Here" }
    },
    params: [
      {
        name: "text",
        type: "string",
        default: ""
      }
    ]
  }
];

function getWidgetDefinition(type) {
  return WIDGET_DEFINITIONS.find(definition => definition.type === type);
}

class RunCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: {}
    };
  }

  connect() {
    const models = this.props.widgets.map(
      ({ device, attribute }) => `${device}/${attribute}`
    );

    this.socket = new WebSocket(
      "ws://localhost:3000/socket?dashboard",
      "graphql-ws"
    );

    const query = `
        subscription newChangeEvent($models: [String]!) {
          changeEvent(models: $models) {
            eventType
            device
            name
            data {
              value
            }
          }
        }`;
    const variables = { models };
    const payload = { query, variables };

    this.socket.addEventListener("message", msg => {
      const data = JSON.parse(msg.data);
      if (data.type === "data") {
        const changeEvent = data.payload.data.changeEvent;
        if (changeEvent == null) {
          return;
        }

        const updatedAttributes = changeEvent.reduce((accum, event) => {
          return {
            [event.device + "/" + event.name]: event.data.value
          };
        }, {});

        const oldAttributes = this.state.attributes;
        const attributes = { ...oldAttributes, ...updatedAttributes };
        this.setState({ attributes });
      }
    });

    this.socket.addEventListener("open", () => {
      const request = JSON.stringify({ type: "start", payload });
      this.socket.send(request);
    });
  }

  componentDidMount() {
    this.connect();
  }

  componentForWidget(widget) {
    return getWidgetDefinition(widget.type).component;
  }

  valueForModel(device, attribute) {
    const model = device + "/" + attribute;
    return this.state.attributes[model];
  }

  render() {
    return (
      <div className="Canvas">
        {this.props.widgets.map((widget, i) => {
          const Widget = this.componentForWidget(widget);
          const { x, y, device, attribute, params } = widget;
          const value = this.valueForModel(device, attribute);

          return (
            <div key={i} className="Widget" style={{ left: x, top: y }}>
              <Widget value={value} params={params} />
            </div>
          );
        })}
      </div>
    );
  }
}

class EditWidget extends Component {
  render() {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div
        className={this.props.isSelected ? "Widget selected" : "Widget"}
        style={{ left: this.props.x, top: this.props.y }}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </div>
    );
  }
}

const types = {
  EDIT_WIDGET: "EDIT_WIDGET",
  LIBRARY_WIDGET: "LIBRARY_WIDGET"
};

EditWidget = DragSource(types.EDIT_WIDGET, editWidgetSource, editWidgetCollect)(
  EditWidget
);

const editCanvasTarget = {
  canDrop(props, monitor) {
    return true;
  },
  drop(props, monitor, component) {
    const { x, y } = monitor.getDifferenceFromInitialOffset();
    const { index } = monitor.getItem();
    props.onMoveWidget(index, x, y);
  }
};

class EditCanvas extends Component {
  constructor(props) {
    super(props);
  }

  componentForWidget(widget) {
    return getWidgetDefinition(widget.type).component;
  }

  placeholderValueForWidget(widget) {
    return getWidgetDefinition(widget.type).libraryProps.value;
  }

  handleSelectWidget(i, event) {
    event.stopPropagation();
    if (this.props.onSelectWidget) {
      this.props.onSelectWidget(i);
    }
  }

  onMoveWidget(index, x, y) {
    this.props.onMoveWidget(index, x, y);
  }

  render() {
    const { connectMoveDropTarget, connectLibraryDropTarget } = this.props;

    return connectLibraryDropTarget(
      connectMoveDropTarget(
        <div
          className="Canvas edit"
          onClick={this.handleSelectWidget.bind(this, -1)}
        >
          {this.props.widgets.map((widget, i) => {
            const Widget = this.componentForWidget(widget);
            const { x, y, device, attribute, params } = widget;
            const value = this.placeholderValueForWidget(widget);

            return (
              <EditWidget
                index={i}
                key={i}
                isSelected={this.props.selectedWidgetIndex === i}
                x={x}
                y={y}
                onClick={this.handleSelectWidget.bind(this, i)}
              >
                <Widget value={value} params={params} />
              </EditWidget>
            );
          })}
        </div>
      )
    );
  }
}

EditCanvas = DropTarget(
  types.EDIT_WIDGET,
  editCanvasTarget,
  (connect, monitor) => ({
    connectMoveDropTarget: connect.dropTarget()
  })
)(EditCanvas);

EditCanvas = DropTarget(
  types.LIBRARY_WIDGET,
  {
    canDrop(props, monitor) {
      return true;
    },
    drop(props, monitor, component) {
      const {x: x1, y: y1} = ReactDOM.findDOMNode(component).getBoundingClientRect();
      const {x: x2, y: y2} = monitor.getClientOffset();
      props.onAddWidget(monitor.getItem().definition, x2 - x1, y2 - y1);
    }
  },
  (connect, monitor) => ({
    connectLibraryDropTarget: connect.dropTarget()
  })
)(EditCanvas);

class LibraryWidget extends Component {
  render() {
    const definition = this.props.definition;
    const Widget = definition.component;

    return (
      <div className="LibraryWidget">
        <span style={{ fontSize: "10px", fontWeight: "bold" }}>
          {definition.name}
        </span>
        {this.props.connectDragSource(
          <div>
            <Widget {...definition.libraryProps} />
          </div>
        )}
      </div>
    );
  }
}

const libraryWidgetSource = {
  beginDrag(props) {
    return {
      definition: props.definition
    };
  }
};

function libraryWidgetCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

LibraryWidget = DragSource(
  types.LIBRARY_WIDGET,
  libraryWidgetSource,
  libraryWidgetCollect
)(LibraryWidget);

class Library extends Component {
  render() {
    return (
      <div className="Inspector">
        {WIDGET_DEFINITIONS.map((definition, i) => {
          return <LibraryWidget key={i} definition={definition} />;
        })}
      </div>
    );
  }
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "edit",
      sidebar: "library", // Belongs in edit component
      selectedWidgetIndex: -1, // Belongs in edit component
      widgets: [
        {
          type: "ATTRIBUTE_READ_ONLY",
          x: 30,
          y: 100,
          device: "sys/tg_test/1",
          attribute: "double_scalar",
          params: {
            scientific: true
          }
        },

        {
          type: "ATTRIBUTE_READ_ONLY",
          x: 70,
          y: 180,
          device: "sys/tg_test/1",
          attribute: "ulong_scalar",
          params: {
            scientific: false
          }
        }
      ]
    };
    this.toggleMode = this.toggleMode.bind(this);
    this.handleMoveWidget = this.handleMoveWidget.bind(this);
    this.handleAddWidget = this.handleAddWidget.bind(this);
  }

  toggleMode() {
    const mode = { edit: "run", run: "edit" }[this.state.mode];
    this.setState({ mode });
  }

  handleMoveWidget(index, x, y) {
    const widgets = [...this.state.widgets];
    const oldWidget = widgets[index];
    const widget = { ...oldWidget, x: oldWidget.x + x, y: oldWidget.y + y };
    widgets.splice(index, 1, widget);
    this.setState({ widgets });
  }

  handleAddWidget(definition, x, y) {
    const params = definition.params.map(param => ({
      [param.name]: param.default
    }));
    const widget = {
      type: definition.type,
      x,
      y,
      device: "",
      attribute: "",
      params
    };
    const widgets = [...this.state.widgets, widget];
    this.setState({ widgets });
  }

  render() {
    const mode = this.state.mode;
    return (
      <div className="Dashboard">
        <div className="Header">
          <button
            onClick={this.toggleMode}
            className={classNames("fa", {
              "fa-play": mode === "edit",
              "fa-pause": mode === "run"
            })}
          />
        </div>
        {mode === "edit" ? (
          <EditCanvas
            widgets={this.state.widgets}
            onMoveWidget={this.handleMoveWidget}
            onSelectWidget={i => this.setState({ selectedWidgetIndex: i })}
            selectedWidgetIndex={this.state.selectedWidgetIndex}
            onAddWidget={this.handleAddWidget}
          />
        ) : (
          <RunCanvas widgets={this.state.widgets} />
        )}
        {mode === "edit" && (
          <div className="Inspector">
            <Library />
          </div>
        )}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Dashboard);
