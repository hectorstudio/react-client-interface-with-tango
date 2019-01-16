import { Component } from "react";
import { connect } from "react-redux";

import { preloadUser } from "../state/actionCreators";

class UserAware extends Component<{ preload: () => void }> {
  public componentWillMount() {
    this.props.preload();
  }

  public render() {
    return this.props.children;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    preload: () => dispatch(preloadUser())
  };
}

export default connect(
  null,
  mapDispatchToProps
)(UserAware);
