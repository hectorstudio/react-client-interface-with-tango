import React from "react";
import PropTypes from 'prop-types'

const AttributeReadOnly = ({
  device,
  attribute,
  libraryMode,
  mode,
  value,
  params: { scientific, showDevice, showAttribute }
}) => {
  const displayValue =
    value == null ? "-" : scientific ? Number(value[0]).toExponential(2) : value[0];

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

AttributeReadOnly.propTypes = {
  attribute: PropTypes.array,
  device: PropTypes.array,
  mode: PropTypes.string,
  params: PropTypes.shape({
    scientific: PropTypes.bool,
    showAttribute: PropTypes.bool,
    showDevice: PropTypes.bool,
  })
}

export default AttributeReadOnly;
