import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { submitCommand } from '../actions/tango';
import './HomeViewer.css'
import { getCommandOutputState } from '../selectors/commandOutput';


class HomeViewer extends Component {
    componentDidMount() {
        this.props.submitCommand("DbInfo", "", "sys/database/2");
    }

    render() {
        const response = this.props.commandOutputs["sys/database/2"];
        if (typeof response !== 'undefined') {
            const output = response["DbInfo"]
            return (
                Object.keys(output).map(i =>
                    <div className="output">
                        {output[i] === " " ?
                            <br />
                            :
                            <p key={i} value={i}>{output[i]}</p>
                        }
                    </div>
                )
            )
        } else {
            return ""
        }
    }
}

function mapStateToProps(state) {
    return {
        commandOutputs: getCommandOutputState(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        submitCommand: (command, value, device) => dispatch(submitCommand(command, value, device)),
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(HomeViewer)
);