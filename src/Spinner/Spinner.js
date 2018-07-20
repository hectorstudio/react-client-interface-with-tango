import React, { Component } from 'react';

import './Spinner.css';

export default class Spinner extends Component {
    render() {
        const {size} = this.props;
        const style = {
            borderWidth: 0.8 * (size *0.23) + 'em',
            width: size + 'em', 
            height: size + 'em'
        }
        return <div className="spinner" style={style}/>;
    }
}

