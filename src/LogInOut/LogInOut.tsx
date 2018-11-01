import React, { Fragment } from "react";
import { connect } from "react-redux";

import { setModal } from "../actions/modal";
import { logout } from "../actions/typedActionCreators";
import {
  getIsLoggedIn,
  getUsername,
  getAwaitingResponse
} from "../selectors/user";
import { IRootState } from "src/reducers/rootReducer";

const WhenLoggedIn = ({ username, onLogout }) => (
  <Fragment>
    Logged in as <span style={{ fontWeight: "bold" }}>{username}</span>.{" "}
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onLogout();
      }}
    >
      Log Out
    </a>
  </Fragment>
);

const WhenLoggedOut = ({ onLogin }) => (
  <Fragment>
    Not logged in.{" "}
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onLogin();
      }}
    >
      Log In
    </a>
  </Fragment>
);

const LogInOut = ({
  username,
  isLoggedIn,
  awaitingResponse,
  onLogin,
  onLogout
}: {
  username: string;
  isLoggedIn: boolean;
  awaitingResponse: boolean;
  onLogin: () => any;
  onLogout: () => any;
}) =>
  awaitingResponse ? null : (
    <div
      style={{
        fontSize: "0.75em",
        position: "absolute",
        top: "0.5em",
        right: "0.5em"
      }}
    >
      {isLoggedIn ? (
        <WhenLoggedIn username={username} onLogout={onLogout} />
      ) : (
        <WhenLoggedOut onLogin={onLogin} />
      )}
    </div>
  );

function mapStateToProps(state: IRootState) {
  return {
    isLoggedIn: getIsLoggedIn(state),
    username: getUsername(state),
    awaitingResponse: getAwaitingResponse(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLogin: () => dispatch(setModal("LOGIN")),
    onLogout: () => dispatch(logout())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInOut);
