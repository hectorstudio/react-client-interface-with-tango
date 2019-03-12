import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Spinner.css';

export default class Spinner extends Component {
    render() {
        const {size} = this.props;
        const style = {
            borderWidth: 0.8 * (size *0.23) + 'em',
            width: size + 'em', 
            height: size + 'em'
        }
        return <div className="Spinner" style={style}/>;
    }
}

Spinner.propTypes = {
    size: PropTypes.number,
}

