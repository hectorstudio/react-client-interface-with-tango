import React from "react";
import { connect } from "react-redux";
import {
  Modal,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Alert
} from "react-bootstrap";

import { LOGIN } from "../actions/actionTypes";
import { login } from "../actions/typedActionCreators";
import { getLoginFailure, getAwaitingResponse } from "src/selectors/user";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.props.onSubmit(this.state.username, this.state.password);
          }}
        >
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Username</ControlLabel>
              <FormControl
                type="text"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl
                type="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </FormGroup>
            {this.props.loginFailure && (
              <div className="alert alert-danger" role="alert">
                Wrong username and/or password.
              </div>
            )}
            {this.props.awaitingResponse && (
              <div className="alert alert-info" role="alert">
                Logging in....
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="btn btn-outline-secondary"
              onClick={this.props.closeDialog}
              disabled={this.props.awaitingResponse}
            >
              Close
            </Button>
            <Button
              type="submit"
              className="btn btn-outline-primary"
              disabled={this.props.awaitingResponse}
            >
              Log In
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    );
  }
}

export default connect(
  function mapStateToProps(state) {
    return {
      awaitingResponse: getAwaitingResponse(state),
      loginFailure: getLoginFailure(state)
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onSubmit: (username, password) => dispatch(login(username, password))
    };
  }
)(Login);
