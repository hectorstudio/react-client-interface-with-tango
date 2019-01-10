import React, { Fragment, CSSProperties } from "react";
import { connect } from "react-redux";

import LoginModal from "./LoginModal/LoginModal";

import { logout, login } from "../actions/typedActionCreators";
import { IRootState } from "../reducers/rootReducer";
import {
  getIsLoggedIn,
  getUsername,
  getAwaitingResponse,
  getLoginFailure
} from "../selectors/user";

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
  onLogin: (username: string, password: string) => void;
  onLogout: () => void;
}

interface IState {
  showingModal: boolean;
  username: string;
  password: string;
}

const style: CSSProperties = {
  fontSize: "0.75em",
  position: "absolute",
  top: "0.5em",
  right: "0.5em",
  backgroundColor: "white",
  boxShadow: "0 0 1em 0.5em white",
  zIndex: 1
};

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
      loginFailure,
      onLogin,
      onLogout
    } = this.props;

    const onClose = () => this.setState({ showingModal: false });
    const onPressLogin = () => this.setState({ showingModal: true });

    if (this.state.showingModal && username == null) {
      return (
        <LoginModal
          awaitingResponse={awaitingResponse}
          loginFailure={loginFailure}
          onLogin={onLogin}
          onClose={onClose}
        />
      );
    }

    return awaitingResponse ? null : (
      <div style={style}>
        {isLoggedIn ? (
          <WhenLoggedIn username={username} onPressLogout={onLogout} />
        ) : (
          <WhenLoggedOut onPressLogin={onPressLogin} />
        )}
      </div>
    );
  }
}

function mapStateToProps(state: IRootState) {
  return {
    isLoggedIn: getIsLoggedIn(state),
    username: getUsername(state),
    awaitingResponse: getAwaitingResponse(state),
    loginFailure: getLoginFailure(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLogout: () => dispatch(logout()),
    onLogin: (username, password) => dispatch(login(username, password))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInOut);
