import React, { Component } from 'react';

import './Dashboard.css';

const WIDGETS = [
    {x: 10, y: 10, type: 'COMMAND'},
    {x: 40, y: 100, type: 'COMMAND'},
    {x: 100, y: 100, type: 'COMMAND'},
];

function widgetToComponent(widget) {
    return (
        <div className="Widget" style={{left: widget.x, top: widget.y}}>
            {widget.type}
        </div>
    );
}

export default class Dashboard extends Component {
    render() {
        return <div className="Dashboard">
            {WIDGETS.map(widgetToComponent)}
        </div>;
    }
}
