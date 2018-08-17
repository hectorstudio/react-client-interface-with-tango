import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { executeCommand } from '../actions/tango';
import './HomeViewer.css'
import { getCommandOutputState } from '../selectors/commandOutput';
import { queryDeviceCommandOutput } from '../selectors/queries';
import { getServerSummary } from '../selectors/server';


class HomeViewer extends Component {
    componentDidMount() {
        this.props.onFetchStatus();
    }

    render() {
        const output = this.props.output;
        return output ? (
            <div className="HomeViewer">
                {output.map((line, i) => <p key={i}>{line.trim()}</p>)}
            </div>
        ) : null;
    }
}

function mapStateToProps(state) {
    return {
        output: getServerSummary(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onFetchStatus: () => dispatch(executeCommand('DbInfo', '', 'sys/database/2')),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeViewer);
