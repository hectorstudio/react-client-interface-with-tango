import React, { Fragment } from "react";
import { connect } from "react-redux";

import {
  logout,
  openLoginDialog
} from "../../../../shared/user/state/actionCreators";

import {
  getIsLoggedIn,
  getUsername,
  getAwaitingResponse,
  getLoginFailure
} from "../../../../shared/user/state/selectors";

import "./LogInOut.css";

const WhenLoggedIn = ({ username, onPressLogout }) => (
  <Fragment>
    Logged in as <span style={{ fontWeight: "bold" }}>{username}</span>.{" "}
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onPressLogout();
      }}
    >
      Log Out
    </a>
  </Fragment>
);

const WhenLoggedOut = ({ onPressLogin }) => (
  <Fragment>
    Not logged in.{" "}
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onPressLogin();
      }}
    >
      Log In
    </a>
  </Fragment>
);

interface IProps {
  username?: string;
  loginFailure: boolean;
  isLoggedIn: boolean;
  awaitingResponse: boolean;
  onPressLogin: () => void;
  onPressLogout: () => void;
}

interface IState {
  showingModal: boolean;
  username: string;
  password: string;
}

class LogInOut extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      showingModal: false,
      username: "",
      password: ""
    };
  }

  public render() {
    const {
      username,
      isLoggedIn,
      awaitingResponse,
      onPressLogout,
      onPressLogin
    } = this.props;

    return awaitingResponse ? null : (
      <div className="LogInOut">
        {isLoggedIn ? (
          <WhenLoggedIn username={username} onPressLogout={onPressLogout} />
        ) : (
          <WhenLoggedOut onPressLogin={onPressLogin} />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getIsLoggedIn(state),
    username: getUsername(state),
    awaitingResponse: getAwaitingResponse(state),
    loginFailure: getLoginFailure(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPressLogin: () => dispatch(openLoginDialog()),
    onPressLogout: () => dispatch(logout())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInOut);
