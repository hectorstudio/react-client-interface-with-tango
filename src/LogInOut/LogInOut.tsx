import React, { Fragment } from "react";
import { connect } from "react-redux";

import { setModal } from "../actions/modal";
import { IRootState } from "src/reducers/rootReducer";

const LogInOut = ({
  username,
  isLoggedIn,
  onLogIn,
  onLogOut
}: {
  username: string;
  isLoggedIn: boolean;
  onLogIn: () => void;
  onLogOut: () => void;
}) => (
  <div
    style={{
      fontSize: "0.75em",
      position: "absolute",
      top: "0.5em",
      right: "0.5em"
    }}
  >
    {isLoggedIn && username ? (
      <Fragment>
        Logged in as <span style={{ fontWeight: "bold" }}>{username}</span>.{" "}
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            onLogOut();
          }}
        >
          Log Out
        </a>
      </Fragment>
    ) : (
      <Fragment>
        Not logged in.{" "}
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            onLogIn();
          }}
        >
          Log In
        </a>
      </Fragment>
    )}
  </div>
);

function mapStateToProps(state: IRootState) {
  return {
    isLoggedIn: state.user.username != null && !state.user.awaitingResponse,
    username: state.user.username
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLogIn: () => dispatch(setModal("LOGIN")),
    onLogOut: () => alert()
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInOut);
