import React from "react";
import "./snippets.css";

export const QualityIndicatorLight = ({quality}) => {
    const sub =
      {
        ATTR_VALID: "valid",
        ATTR_INVALID: "invalid",
        ATTR_CHANGING: "changing",
        ATTR_ALARM: "alarm",
        ATTR_WARNING: "warning"
      }[quality] || "invalid";
  
    return (
      <span className={`QualityIndicator ${sub}`} title={quality}>
        ●{" "}
      </span>
    );
  };

  export const QualityIndicatorLabel = ({ state }) => {
    const classSuffixes = {
      ON: "on",
      OFF: "off",
      CLOSE: "close",
      OPEN: "open",
      INSERT: "insert",
      EXTRACT: "extract",
      MOVING: "moving",
      STANDBY: "standby",
      FAULT: "fault",
      INIT: "init",
      RUNNING: "running",
      ALARM: "alarm",
      DISABLE: "disable",
      UNKNOWN: "unknown"
    };
    const classSuffix = classSuffixes[state] || "invalid";
    return <span style={{verticalAlign: "text-top"}} className={`state state-${classSuffix}`}>{state}</span>;
  }