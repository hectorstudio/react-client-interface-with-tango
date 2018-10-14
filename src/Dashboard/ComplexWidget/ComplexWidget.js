import React, { Component } from "react";
import { getWidgetDefinition } from "../widgets/widgetDefinitions";

class MiniCanvas extends Component {
  componentForWidget(widget) {
    return getWidgetDefinition(widget.type).component;
  }

  deviceForWidget(widget) {
    return widget.device === "__parent__" ? this.props.device : widget.device;
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

    const isLibrary = this.props.mode === "library";

    const style = isLibrary
      ? {
          position: "relative",
          height: "100px",
          overflow: "hidden",
          background: `repeating-linear-gradient(
            rgb(232, 239, 249),
            rgb(232, 239, 249) 1px,
            rgba(0, 0, 0, 0) 1px,
            rgba(0, 0, 0, 0) 15px
          ),
          repeating-linear-gradient(
            90deg,
            rgb(232, 239, 249),
            rgb(232, 239, 249) 1px,
            rgba(0, 0, 0, 0) 1px,
            rgba(0, 0, 0, 0) 15px
          )`
        }
      : { width: "300px", height: "200px" };

    const FadeOut = () => (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          boxShadow: "inset -10px -10px 20px 0px white",
          zIndex: 10000
        }}
      />
    );

    return (
      <div style={style}>
        {isLibrary && <FadeOut />}
        <div className="Canvas">
          {widgets.map((widget, i) => {
            const Widget = this.componentForWidget(widget);
            const device = this.deviceForWidget(widget);
            const value = this.valueForWidget(widget);
            const { x, y, attribute, params } = widget;

            return (
              <div
                key={i}
                className={"Widget"}
                style={{
                  position: "absolute",
                  left: x - minX,
                  top: y - minY
                }}
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
