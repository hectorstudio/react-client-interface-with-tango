import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as tangoActions from '../actions/tango';
import React from 'react';
import './DeviceList.css';


class deviceList extends React.Component {


    componentWillMount() {
     this.props.tangoActions.getDevices();
   }


  renderData(name, index) {
    return <div key={index} onClick={() => this.props.tangoActions.getDeviceProperties(name)}>{name}</div>;
  }
  
  
  render() {
    return (
      <div className="device-list">
        <div className="list">
        {this.props.devices ? Object.keys(this.props.devices).map((name, i) => this.renderData(name, i)) : 
          <p>No Data</p>
        }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    devices: state.deviceList.devices
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
)(deviceList);