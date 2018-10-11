import React, { Component } from "react";
import { getWidgetDefinition } from "../widgets/widgetDefinitions";

class MiniCanvas extends Component {
  componentForWidget(widget) {
    return getWidgetDefinition(widget.type).component;
  }

  deviceForWidget(widget) {
    return widget.device === '__parent__'? this.props.device : widget.device;
  }

  valueForWidget(widget) {
    if (this.props.mode !== "run") {
      return null;
    }
    
    const device = this.deviceForWidget(widget);
    const attribute = widget.attribute;
    const key = `${device}/${attribute}`;
    return this.props.attributes[key];
  }

  render() {
    const widgets = this.props.widgets;
    if (widgets.length === 0) {
      return <span>Empty</span>;
    }

    const minX = widgets.map(({ x }) => x).reduce((a, b) => Math.min(a, b));
    const minY = widgets.map(({ y }) => y).reduce((a, b) => Math.min(a, b));

    return (
      <div className="Canvas" style={{ width: "300px", height: "200px" }}>
        {widgets.map((widget, i) => {
          const Widget = this.componentForWidget(widget);
          const device = this.deviceForWidget(widget);
          const value = this.valueForWidget(widget);
          const { x, y, attribute, params } = widget;

          return (
            <div
              key={i}
              className={"Widget"}
              style={{ left: x - minX, top: y - minY }}
            >
              <Widget
                device={device}
                attribute={attribute}
                params={params}
                mode={this.props.mode}
                value={value}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

function complexWidgetComponent(canvas) {
  return class ComplexWidget extends Component {
    render() {
      return (
        <MiniCanvas
          device={this.props.device}
          widgets={canvas.widgets}
          attributes={this.props.attributes}
          mode={this.props.mode}
        />
      );
    }
  };
}

export function complexWidgetDefinition(canvas) {
  const { id, name } = canvas;
  return {
    type: `CANVAS_${id}`,
    name,
    component: complexWidgetComponent(canvas),
    fields: ["device"],
    params: []
  };
}
