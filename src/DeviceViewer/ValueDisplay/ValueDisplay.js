import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, Tooltip, YAxis } from 'recharts';

import './ValueDisplay.css';

const ScalarValueDisplay = ({value, datatype}) =>
  datatype === 'DevString' && value.length > 50000
  ? 'Value too big to display.'
  : value;

const SpectrumValueDisplay = ({value, datatype}) => {
  if (datatype === 'DevString') {
    return 'DevString spectra are not yet supported.';
  }

  const values = datatype === 'DevBoolean'
    ? value.map(s => Number(s === 'True'))
    : value;
  const data = values.map(value => ({value}));
  const lineType = datatype === 'DevBoolean' ? 'step' : 'linear';

  return (
    <LineChart data={data} width={400} height={300}>
      <YAxis/>
      <Tooltip/>
      <CartesianGrid stroke="#f5f5f5"/>
      <Line dot={false} isAnimationActive={false} type={lineType} dataKey="value" stroke="#ff7300" yAxisId={0}/>
    </LineChart>
  );
};

const ImageValueDisplay = ({value, datatype}) =>
  'Images are not supported.';

const ValueDisplay = ({value, datatype, dataformat}) => {
  if (value === null) {
    return <span className="no-value">No value</span>;
  }

  const InnerDisplay = {
    'IMAGE': ImageValueDisplay,
    'SCALAR': ScalarValueDisplay,
    'SPECTRUM': SpectrumValueDisplay,
  }[dataformat];

  return <InnerDisplay value={value} datatype={datatype}/>;
};

export default ValueDisplay;
