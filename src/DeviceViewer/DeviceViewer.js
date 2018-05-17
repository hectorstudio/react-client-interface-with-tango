import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as tangoActions from '../actions/tango';
import React from 'react';
import './DeviceViewer.css';


class deviceViewer extends React.Component {


  renderProperty(data, index) {
    return <div key={index}>{data.name} : 1</div>;
  }

  renderAttributes(data, index) {
    return <div key={index}>{data.name} : 1</div>;
  }

  render() {
    return (
      <div className="device-viewer">
        <div className="list">
        <h1>Properties</h1>
        {this.props.info.properties ? this.props.info.properties.map((prop, i) => this.renderProperty(prop, i)) : 
          <p>No Data</p>
        }
        <h1>Attributes</h1>
        {this.props.info.attributes ? this.props.info.attributes.map((prop, i) => this.renderAttributes(prop, i)) : 
          <p>No Data</p>
        }
        </div>
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