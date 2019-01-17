import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, Tooltip, YAxis } from 'recharts';
import PropTypes from 'prop-types'

import AttributeInput from '../AttributeInput/AttributeInput';
import { JSONTree } from './JSONTree';

import './ValueDisplay.css';

function parseJSONObject(str) {
  try {
    const obj = JSON.parse(str);
    return typeof(obj) === "object" ? obj : null;
  } catch (err) {
    return null;
  }
}

function looksLikeMonospace(str) {
  return str.match(/(\n  )|\t|    /);
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
}

const ScalarValueDisplay = ({value, datatype, name, writable, setDeviceAttribute, minvalue, maxvalue}) => {
  if (datatype === 'DevString') {
    return <DevStringValueDisplay value={value}/>;
  } else if (datatype === 'DevEncoded') {
    const [type, payload] = value;
    if (type !== 'json') {
      return `Unsupported encoding '${type}'`;
    }

    const json = JSON.stringify(JSON.parse(payload), 4);
    const lines = json.split('\n');
    return <DevStringValueDisplay value={lines}/>;

  }else if(writable === "WRITE" || writable === "READ_WITH_WRITE" && datatype === 'DevDouble' || datatype === 'DevShort'
  || datatype === 'DevFloat' || datatype === 'DevLong' || datatype === 'DevULong' || datatype === 'DevULong64' || datatype === 'DevUShort' || datatype === 'DevLong64' || datatype === 'DevUChar'){
    return<AttributeInput
      save={setDeviceAttribute.bind(this, name)}
      value={Number(value)}
      motorName={name}
      decimalPoints="2"
      state={2}
      disabled={false}
      maxvalue={maxvalue}
      minvalue={minvalue} 
    />
  }else{
    return String(value);
  }
}
ScalarValueDisplay.propTypes = {
  datatype: PropTypes.string,
  maxvalue: PropTypes.any,
  minvalue: PropTypes.any,
  name: PropTypes.string,
  setDeviceAttribute: PropTypes.func,
  value: PropTypes.any,
  writable: PropTypes.string,
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

SpectrumValueDisplay.propTypes = {
  value: PropTypes.any,
  datatype: PropTypes.string,
}

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

ImageValueDisplay.propTypes = {
  datatype: PropTypes.string,
  maxvalue: PropTypes.any,
  minvalue: PropTypes.any,
  name: PropTypes.string,
  setDeviceAttribute: PropTypes.func,
  value: PropTypes.any,
  writable: PropTypes.string,
}

const ValueDisplay = ({value, writable, setDeviceAttribute,  datatype, dataformat, name, minvalue, maxvalue}) => {
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
  writable: PropTypes.string,
}

export default ValueDisplay;
