import React, { Fragment, CSSProperties } from "react";
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
import { Dispatch } from "redux";

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

interface OwnProps {
  style?: CSSProperties;
}

interface State {
  showingModal: boolean;
  username: string;
  password: string;
}

type Props = OwnProps & StateProps & DispatchProps;

class LogInOut extends React.Component<Props, State> {
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
      onPressLogin,
      style
    } = this.props;

    return awaitingResponse ? null : (
      <div className="LogInOut" style={style || {}}>
        {isLoggedIn ? (
          <WhenLoggedIn username={username} onPressLogout={onPressLogout} />
        ) : (
          <WhenLoggedOut onPressLogin={onPressLogin} />
        )}
      </div>
    );
  }
}

interface StateProps {
  isLoggedIn: boolean;
  username?: string;
  awaitingResponse: boolean;
  loginFailure: boolean;
}

interface DispatchProps {
  onPressLogin: () => void;
  onPressLogout: () => void;
}

function mapStateToProps(state): StateProps {
  return {
    isLoggedIn: getIsLoggedIn(state),
    username: getUsername(state),
    awaitingResponse: getAwaitingResponse(state),
    loginFailure: getLoginFailure(state)
  };
}

function mapDispatchToProps(dispatch): DispatchProps {
  return {
    onPressLogin: () => dispatch(openLoginDialog()),
    onPressLogout: () => dispatch(logout())
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LogInOut);
