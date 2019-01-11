import React, { Component } from "react";
import { connect } from "react-redux";

import {
  getIsLoggedIn,
  getLoginDialogVisible,
  getAwaitingResponse,
  getLoginFailure
} from "../selectors/user";

import { closeLoginDialog, login } from "../actions/typedActionCreators";
import LoginModal from "../LogInOut/LoginModal/LoginModal";

class LoginDialog extends Component {
  render() {
    return this.props.isVisible ? (
      <LoginModal
        awaitingResponse={this.props.awaitingResponse}
        loginFailure={this.props.loginFailure}
        onLogin={this.props.onLogin}
        onClose={this.props.onClose}
      />
    ) : null;
  }
}

function mapStateToProps(state) {
  return {
    isVisible: getLoginDialogVisible(state),
    isLoggedIn: getIsLoggedIn(state),
    awaitingResponse: getAwaitingResponse(state),
    loginFailure: getLoginFailure(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLogin: (username, password) => dispatch(login(username, password)),
    onClose: () => dispatch(closeLoginDialog())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginDialog);
