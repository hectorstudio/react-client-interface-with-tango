import React from 'react';
import cx from 'classnames';
import { Button } from 'react-bootstrap';
import './AttributeInput.css';
export default class AttributeInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = { edited: false };
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

    if ([13].includes(e.keyCode) && this.props.state === 2) {
      this.setState({ edited: false });
      this.props.save(e.target.valueAsNumber);
      this.refs.motorValue.value = this.props.value.toFixed(this.props.decimalPoints);
    } else if (this.props.state === 4) {
      this.setState({ edited: false });
      this.refs.motorValue.value = this.props.value.toFixed(this.props.decimalPoints);
    }
  }

  render() {
    const { value, motorName, decimalPoints } = this.props;
    const valueCropped = value.toFixed(decimalPoints);
    let inputCSS = cx('form-control rw-input', {
      'input-bg-edited': this.state.edited,
      'input-bg-moving': this.props.state === 4 || this.props.state === 3,
      'input-bg-ready': this.props.state === 2,
      'input-bg-fault': this.props.state <= 1,
      'input-bg-onlimit': this.props.state === 5
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