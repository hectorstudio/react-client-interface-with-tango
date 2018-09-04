import React from 'react';
import cx from 'classnames';
import { Button } from 'react-bootstrap';
import './AttributeInput.css';

const ENTER_KEY = 13;
const MOVING = 3;
const READY = 2;
const ISSUE = 1;


export default class AttributeInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      edited: false, 
      badEntry: false
    };
    this.handleKey = this.handleKey.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.refs.motorValue.value = nextProps.value.toFixed(this.props.decimalPoints);
      this.refs.motorValue.defaultValue = nextProps.value.toFixed(this.props.decimalPoints);
      this.setState({ edited: false });
    }
  }

  handleKey(e) {
    e.preventDefault();
    e.stopPropagation();
  
    this.setState({ edited: true });
    const value = e.target.valueAsNumber;
    const min = this.props.minvalue;
    const max = this.props.maxvalue;
    if(value && ((min && min > value) || (max && value > max))){
      this.setState({ badEntry: true });
    }else if(value){
      this.setState({ badEntry: false });
      if ([ENTER_KEY].includes(e.keyCode) && this.props.state === READY) {
        this.setState({ edited: false });
        this.props.save(e.target.valueAsNumber);
        this.refs.motorValue.value = this.props.value.toFixed(this.props.decimalPoints);
      } else if (this.props.state === this.state.MOVING) {
        this.setState({ edited: false });
        this.refs.motorValue.value = this.props.value.toFixed(this.props.decimalPoints);
      }
    }
  }

  render() {
    const { value, motorName, decimalPoints, minvalue, maxvalue } = this.props;
    const valueCropped = value.toFixed(decimalPoints);

    let inputCSS = cx('form-control rw-input', {
      'input-bg-edited': this.state.edited && !this.state.badEntry,
      'input-bg-moving': this.props.state === MOVING,
      'input-bg-ready': this.props.state === READY,
      'input-bg-fault': this.props.state <= ISSUE || this.state.badEntry
    });

    return (
        <div className="AttributeInput motor-input-container">
          <form className="form-group" onSubmit={this.handleKey} noValidate>
            <div
              className="rw-widget rw-numberpicker rw-widget-no-right-border"
              style={ { width: '90px', display: 'inline-block' } }
            >
              <input
                ref="motorValue"
                className={inputCSS}
                onKeyUp={this.handleKey}
                type="number"
                defaultValue={valueCropped}
                name={motorName}
                disabled={this.props.state !== 2 || this.props.disabled}
              />
            </div>
          </form>
        </div>
      );
  }
}