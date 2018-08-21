import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, Tooltip, YAxis } from 'recharts';

import AttributeInput from '../AttributeInput/AttributeInput';
import './ValueDisplay.css';

const DevStringValueDisplay = ({value}) => {
  const values = [].concat(value);
  return values.map((val, i) => <p key={i}>{val}</p>);
}

const ScalarValueDisplay = ({value, datatype, name, deviceName, writable, setDeviceAttribute}) => {
  if (datatype === 'DevString' || datatype === 'DevEncoded') {
    const joined = Array.isArray(value) ? value.join('\n') : value;
    
    // Heuristic to check whether value is meant to be read in preformatted monospace
    // Example attribute: `Status' of `lab/adlinkiods/ao'
    if (joined.match(/(\n  )|\t/)) {
      return <pre>{value}</pre>;
    } else {
      return <DevStringValueDisplay value={value}/>;
    }
  }

  if(writable === "WRITE" || writable === "READ_WITH_WRITE"){
    return<AttributeInput
      save={setDeviceAttribute.bind(this, deviceName, name)}
      value={value}
      motorName={name}
      decimalPoints="2"
      state={2}
      disabled={false}
    />
  }else{
    return value;
  }
}

const SpectrumValueDisplay = ({value, datatype}) => {
  if (datatype === 'DevString') {
    return <DevStringValueDisplay value={value}/>;
  }

  const values = datatype === 'DevBoolean'
    ? value.map(val => val ? 1 : 0)
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

class ImageValueDisplay extends React.Component {
  imageWidth() {
    return this.props.value[0].length;
  }

  imageHeight() {
    return this.props.value.length;
  }

  imageMax() {
    const max = arr => arr.reduce((a, b) => Math.max(a, b));
    const maxes = this.props.value.map(max);
    return max(maxes);
  }

  getIndicesForCoord(x, y) {
    var index = y * this.imageWidth() * 4 + x * 4;
    return index;
  }

  updateCanvas(){
    const canvas = document.getElementById(this.props.name);
    const context = canvas.getContext('2d');

    const image = this.props.value;
    const imgWidth = this.imageWidth();
    const imgHeight = this.imageHeight();

    const imgData = context.createImageData(imgWidth, imgHeight);
    canvas.width  = imgWidth;
    canvas.height = imgHeight;

    const max = this.imageMax();

    image.forEach((outerArray, y) => {
      outerArray.forEach((value, x) => {
        const index = this.getIndicesForCoord(x,y, imgData.width);
        const normal = 255 * (value / (max === 0 ? 1 : max));
        imgData.data[index+0] = normal;
        imgData.data[index+1] = normal;
        imgData.data[index+2] = normal;
        imgData.data[index+3] = 255;
      });
    });

    context.putImageData(imgData, 0, 0);
  }

  componentDidMount() {
    this.updateCanvas();
  }

  
  render() {
    if(document.getElementById(this.props.name)){
      this.updateCanvas();
    }
    return <canvas id={this.props.name} />
  }
}

const ValueDisplay = ({value, deviceName, writable, setDeviceAttribute,  datatype, dataformat, name}) => {
  if (value === null) {
    return <span className="ValueDisplay no-value">No value</span>;
  }

  const InnerDisplay = {
    'IMAGE': ImageValueDisplay,
    'SCALAR': ScalarValueDisplay,
    'SPECTRUM': SpectrumValueDisplay,
  }[dataformat];

  const className = ['ValueDisplay', dataformat.toLowerCase(), datatype].join(' ');

  return (
    <div className={className}>
      <InnerDisplay
        value={value}
        datatype={datatype}
        name={name}
        deviceName={deviceName}
        writable={writable}
        setDeviceAttribute={setDeviceAttribute}
      />
    </div>
  );
};

export default ValueDisplay;
