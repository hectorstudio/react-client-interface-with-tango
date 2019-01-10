import React, { Component, FormEvent } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import Modal from "../../Modal/Modal";

interface IProps {
  awaitingResponse?: boolean;
  loginFailure?: boolean;
  onLogin: (username: string, password: string) => void;
  onClose: () => void;
}

interface IState {
  username: string;
  password: string;
}

export default class LoginModal extends Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  public render() {
    const { awaitingResponse } = this.props;
    const { username, password } = this.state;

    return (
      <Modal title={"Log In"}>
        <form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Username</ControlLabel>
              <FormControl
                type="text"
                value={username}
                onChange={this.handleChangeUsername}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl
                type="password"
                value={password}
                onChange={this.handleChangePassword}
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
            <button
              onClick={this.handleClose}
              className="btn btn-outline-secondary"
              disabled={awaitingResponse}
            >
              Close
            </button>
            <button
              type="submit"
              className="btn btn-outline-primary"
              disabled={awaitingResponse}
            >
              Log In
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }

  private handleClose() {
    this.props.onClose();
  }

  private handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { username, password } = this.state;
    this.props.onLogin(username, password);
  }

  private handleChangeUsername(event: FormEvent<HTMLInputElement>) {
    const username = event.currentTarget.value;
    this.setState({ username });
  }

  private handleChangePassword(event: FormEvent<HTMLInputElement>) {
    const password = event.currentTarget.value;
    this.setState({ password });
  }
}
