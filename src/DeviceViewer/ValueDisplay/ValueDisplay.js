import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, Tooltip, YAxis } from 'recharts';

import MotorInput from './MotorInput';
import './ValueDisplay.css';

const ScalarValueDisplay = ({value, datatype, name, deviceName, writable, setDeviceAttribute}) => {
  value = Array.isArray(value) ? value.join('\n') : value;

  if (datatype === 'DevString') {
    if (value.match(/(  )|(^ )|\t/)) {
      return <pre>{value}</pre>;
    }
  }

  if(writable==="WRITE"){
    return<MotorInput
      save={setDeviceAttribute.bind(this, deviceName, name)}
      saveStep={null}
      step={1}
      value={value}
      motorName={name}
      label={name}
      suffix="&deg;"
      decimalPoints="2"
      state={2}
      stop={null}
      disabled={false}
    />
  }else{
    return value;
  }
}

const SpectrumValueDisplay = ({value, datatype}) => {
  if (datatype === 'DevString') {
    return value.join('\n');
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

  getIndicesForCoord(x, y, width) {
    var index = y * (width * 4) + x * 4;
    return index;
  }

  updateCanvas(){
    const canvas = document.getElementById(this.props.name);
    const context = canvas.getContext('2d');
    const imgLength = this.props.value.length;

    const imgData = context.createImageData(imgLength, imgLength);
    canvas.width  = imgLength;
    canvas.height = imgLength;

    this.props.value.forEach((outerArray, y) => {
      outerArray.forEach((value, x) => {
        var index = this.getIndicesForCoord(x,y, imgData.width);
        imgData.data[index+0] = parseInt(value, 10);
        imgData.data[index+1] = parseInt(value, 10);
        imgData.data[index+2] = parseInt(value, 10);
        imgData.data[index+3] = parseInt(value, 10); 
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
    return <span className="no-value">No value</span>;
  }

  const InnerDisplay = {
    'IMAGE': ImageValueDisplay,
    'SCALAR': ScalarValueDisplay,
    'SPECTRUM': SpectrumValueDisplay,
  }[dataformat];

  return <InnerDisplay value={value} datatype={datatype} name={name} deviceName={deviceName} writable={writable} setDeviceAttribute={setDeviceAttribute}/>;
};

export default ValueDisplay;
