import React, { Component } from "react";
import { getWidgetDefinition } from "./widgets/widgetDefinitions";

class MiniCanvas extends Component {
  componentForWidget(widget) {
    return getWidgetDefinition(widget.type).component;
  }

  render() {
    return (
      <div className="Canvas">
        {this.props.widgets.map((widget, i) => {
          const Widget = this.componentForWidget(widget);
          const { x, y, device, attribute, params } = widget;

          return (
            <div
              key={i}
              className={"Widget"}
              style={{ left: x, top: y }}
            >
              <Widget
                device={device}
                attribute={attribute}
                params={params}
                mode="edit"
              />
            </div>
          );
        })}
      </div>
    );
  }
}

// "Canvas widget" is a fairly misleading name
// It is a widget consisting of a canvas, not a widget residing in one

function complexWidgetComponent(canvas) {
  return class ComplexWidget extends Component {
    render() {
      return <MiniCanvas widgets={canvas.widgets} />;
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
