import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { executeCommand } from '../actions/tango';
import { getServerSummary } from '../selectors/server';

import './HomeViewer.css'

class HomeViewer extends Component {
    componentDidMount() {
        this.props.onLoad();
    }

    render() {
        const summary = this.props.summary;
        return summary ? (
            <div className="HomeViewer">
                {summary.map((line, i) => <p key={i}>{line.trim()}</p>)}
            </div>
        ) : null;
    }
}

function mapStateToProps(state) {
    return {
        summary: getServerSummary(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLoad: () => dispatch(executeCommand('DbInfo', '', 'sys/database/2')),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeViewer);
