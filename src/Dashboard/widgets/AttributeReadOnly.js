import React from "react";

const AttributeReadOnly = ({
  device,
  attribute,
  libraryMode,
  mode,
  value,
  params: { scientific, showDevice, showAttribute }
}) => {
  const displayValue =
    value == null ? "-" : scientific ? Number(value).toExponential(2) : value;

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
    ) : labels.length === 1 ? (
      labels[0]
    ) : null;

  return (
    <div style={{ backgroundColor: "#eee", padding: "0.5em" }}>
      {label}
      {showDevice || showAttribute ? ": " : ""}
      {mode === "library" || mode === "edit" ? <i>value</i> : displayValue}
    </div>
  );
};

export default AttributeReadOnly;
