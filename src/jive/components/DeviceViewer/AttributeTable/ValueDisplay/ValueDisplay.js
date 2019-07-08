import React from "react";
import PropTypes from "prop-types";

// Spectrum visualisation is disabled for performance reasons until a more sustainable solution is found. For now, skip importing from reacharts in order to reduce bundle size.
// import { LineChart, Line, CartesianGrid, Tooltip, YAxis } from 'recharts';

import { JSONTree } from "./JSONTree";

import "./ValueDisplay.css";

function parseJSONObject(str) {
  try {
    const obj = JSON.parse(str);
    return typeof obj === "object" ? obj : null;
  } catch (err) {
    return null;
  }
}

function looksLikeMonospace(str) {
  return str.match(/(\n {2})|\t| {4}/);
}

const DevStringValueDisplay = ({ value }) => {
  const values = [].concat(value);

  const valuesAsObjects = values.map(parseJSONObject);
  const allAreObjects = valuesAsObjects.indexOf(null) === -1;

  if (allAreObjects) {
    return valuesAsObjects.map((obj, i) => <JSONTree key={i} data={obj} />);
  }

  const anyLooksLikeMonospace = null != values.find(looksLikeMonospace);
  const extraClass = anyLooksLikeMonospace ? "monospace" : "";

  return values.map((val, i) => (
    <p key={i} className={extraClass}>
      {val}
    </p>
  ));
};

DevStringValueDisplay.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
};

const ScalarValueDisplay = ({ value, datatype }) => {
  switch (datatype) {
    case "DevString":
      return <DevStringValueDisplay value={value} />;

    case "DevEncoded":
      const [type, payload] = value;
      if (type !== "json") {
        return `Unsupported encoding '${type}'`;
      }

      if (parseJSONObject(payload) == null) {
        return <span className="invalid-json">Invalid JSON</span>;
      }

      return <DevStringValueDisplay value={payload} />;
    default:
      return String(value);
  }
};

ScalarValueDisplay.propTypes = {
  datatype: PropTypes.string,
  maxvalue: PropTypes.any,
  minvalue: PropTypes.any,
  name: PropTypes.string,
  setDeviceAttribute: PropTypes.func,
  value: PropTypes.any,
  writeValue: PropTypes.any,
  writable: PropTypes.string
};

const SpectrumValueDisplay = ({ value, datatype }) => {
  if (datatype === "DevString") {
    return <DevStringValueDisplay value={value} />;
  }

  return null;

  // const values = datatype === 'DevBoolean'
  //   ? value.map(val => val ? 1 : 0)
  //   : value;
  // const data = values.map(value => ({value}));
  // const lineType = datatype === 'DevBoolean' ? 'step' : 'linear';

  // return (
  //   <LineChart data={data} width={400} height={300}>
  //     <YAxis/>
  //     <Tooltip/>
  //     <CartesianGrid stroke="#f5f5f5"/>
  //     <Line dot={false} isAnimationActive={false} type={lineType} dataKey="value" stroke="#ff7300" yAxisId={0}/>
  //   </LineChart>
  // );
};

SpectrumValueDisplay.propTypes = {
  value: PropTypes.any,
  datatype: PropTypes.string
};

const ValueDisplay = ({
  value,
  writeValue,
  writable,
  setDeviceAttribute,
  datatype,
  dataformat,
  name,
  minvalue,
  maxvalue
}) => {
  if (value === null) {
    return <span className="ValueDisplay no-value">No value</span>;
  }

  if (value === undefined) {
    return null;
  }

  const InnerDisplay = {
    SCALAR: ScalarValueDisplay,
    SPECTRUM: SpectrumValueDisplay
  }[dataformat];

  const className = ["ValueDisplay", dataformat.toLowerCase(), datatype].join(
    " "
  );

  return (
    <div className={className}>
      <InnerDisplay
        value={value}
        writeValue={writeValue}
        datatype={datatype}
        name={name}
        writable={writable}
        maxvalue={maxvalue}
        minvalue={minvalue}
        setDeviceAttribute={setDeviceAttribute}
      />
    </div>
  );
};

ValueDisplay.propTypes = {
  dataformat: PropTypes.string,
  datatype: PropTypes.string,
  maxvalue: PropTypes.any,
  minvalue: PropTypes.any,
  name: PropTypes.string,
  setDeviceAttribute: PropTypes.func,
  value: PropTypes.any,
  writable: PropTypes.string
};

export default ValueDisplay;
