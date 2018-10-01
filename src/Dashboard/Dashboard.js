import React, { Component } from 'react';

import './Dashboard.css';
import { connect } from 'react-redux';
import { subscribeDevice } from '../actions/tango';

const WIDGETS = [
    {type: 'ATTRIBUTE_READ_ONLY', x: 10, y: 10, device: 'sys/tg_test/1', attribute: 'ampli'},
    // {x: 40, y: 100, type: 'COMMAND'},
    // {x: 100, y: 200, type: 'COMMAND'},
];

class WidgetWrapper extends Component {
    componentDidMount() {
        const {device, attribute} = this.props;
        const model = `${device}/${attribute}`;
        this.subscribe(model);
    }

    render() {
        return (
            <div>
                { this.props.children }
            </div>
        );
    }
}

function widgetToComponent(widget) {
    return (
        <div className="Widget" style={{left: widget.x, top: widget.y}}>
            <WidgetWrapper device={widget.device} attribute={widget.attribute}>
                {widget.type}
            </WidgetWrapper>
        </div>
    );
}

class Dashboard extends Component {
    render() {
        return <div className="Dashboard">
            {WIDGETS.map(widgetToComponent)}
        </div>;
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        subscribe: model => dispatch(subscribeDevice)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
