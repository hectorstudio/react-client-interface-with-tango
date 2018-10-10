import React from "react";

const Label = ({ editMode, libraryMode, params: { text } }) => (
  <div
    style={{
      border: editMode ? "1px dashed gray" : "",
      padding: "0.5em"
    }}
  >
    {text || (editMode || libraryMode ? <i>Your Text Here</i> : null)}
  </div>
);

export default Label;
