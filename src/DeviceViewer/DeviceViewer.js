import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as tangoActions from '../actions/tango';
import React from 'react';
import './DeviceViewer.css';


class deviceViewer extends React.Component {

  render() {
    return (
      <div className="device-viewer">
          Hello World
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    info: state.deviceViewer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    tangoActions: bindActionCreators(tangoActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(deviceViewer);