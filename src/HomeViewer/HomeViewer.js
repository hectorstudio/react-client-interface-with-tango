import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { executeCommand } from '../actions/tango';
import { getServerSummary } from '../selectors/server';
import PropTypes from 'prop-types'

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

HomeViewer.propTypes = {
    summary : PropTypes.arrayOf(PropTypes.string),
    onLoad :  PropTypes.func,
}

function mapDispatchToProps(dispatch) {
    return {
        onLoad: () => dispatch(executeCommand('DbInfo', '', 'sys/database/2')),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeViewer);
