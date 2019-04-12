import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './AttributeInput.css';
import { connect } from 'react-redux';
import { getIsLoggedIn } from "../../../../../shared/user/state/selectors";

const ENTER_KEY = 13;
const MOVING = 3;
const READY = 2;
const ISSUE = 1;

class AttributeInput extends React.Component {
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
      this.refs.motorValue.value = nextProps.value;
      this.refs.motorValue.defaultValue = nextProps.value;
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
    if(value != null && ((min != null && min > value) || (max != null && value > max))){
      this.setState({ badEntry: true });
    }else if(value != null){
      this.setState({ badEntry: false });
      if ([ENTER_KEY].includes(e.keyCode) && this.props.state === READY) {
        this.setState({ edited: false });
        this.props.save(e.target.valueAsNumber);
        this.refs.motorValue.value = this.props.value;
        this.refs.motorTargetValue.blur();
      } else if (this.props.state === this.state.MOVING) {
        this.setState({ edited: false });
        this.refs.motorValue.value = this.props.value;
      }
    }
  }

  render() {
    const { value, motorName, writeValue, isLoggedIn } = this.props;

    const valueCropped = value;
    const writeValueCropped = writeValue ? writeValue : '';

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
              style={ { width: '100%', display: 'inline-block' } }
            >
              <input
                disabled
                className={inputCSS}
                ref="motorValue"
                type="number"
                defaultValue={valueCropped}
                name={motorName}
                style={{width: '200px', display: 'inline-block'}}
              />

              {isLoggedIn && <input
                className={inputCSS}
                onKeyUp={this.handleKey}
                type="number"
                ref="motorTargetValue"
                placeholder={`Set target`}
                defaultValue={writeValueCropped}
                disabled={this.props.state !== 2 || this.props.disabled}
                style={{width: '200px', display: 'inline-block', marginLeft: '10px'}}
              />}
            </div>
          </form>
        </div>
      );
  }
}

AttributeInput.propTypes = {
  disabled: PropTypes.bool,
  maxvalue: PropTypes.any,
  minvalue: PropTypes.any,
  motorName: PropTypes.string,
  save: PropTypes.func,
  state: PropTypes.number,
  value: PropTypes.number,
  isLoggedIn: PropTypes.bool
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getIsLoggedIn(state)
  };
}

export default connect(mapStateToProps)(AttributeInput);
