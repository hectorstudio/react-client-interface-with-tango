import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as tangoActions from '../actions/tango';
import React from 'react';
import './DeviceViewer.css';


class deviceViewer extends React.Component {


  renderProperty(data, index) {
    console.log(data)
    return <div key={index}>{data.name} : {data.values}</div>;
  }

  render() {
    console.log(this.props)
    return (
      <div className="device-viewer">
        <div className="list">
        {this.props.info ? Object.keys(this.props.info).map((name, i) => this.renderProperty(this.props.info[i], i)) : 
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