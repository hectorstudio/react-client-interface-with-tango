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
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="btn btn-outline-secondary"
              onClick={this.props.closeDialog}
            >
              Close
            </Button>
            <Button type="submit" className="btn btn-outline-primary">
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
      loginFailure: state.user.loginFailed && !state.user.awaitingResponse
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onSubmit: (username, password) =>
        dispatch(login(username, password))
    };
  }
)(Login);
