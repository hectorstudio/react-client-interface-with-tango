import React from "react";

const Label = ({ mode, params: { text } }) => (
  <div
    style={{
      border: mode === "edit" ? "1px dashed gray" : "",
      padding: "0.5em"
    }}
  >
    {text ||
      (mode === "edit" || mode === "library" ? <i>Your Text Here</i> : null)}
  </div>
);

export default Label;
