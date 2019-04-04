import React, { Component } from "react";
import "./DashboardTitle.css";
import { connect } from "react-redux";
import { getSelectedDashboard, getUserName } from "../state/selectors";
import { RootState } from "../state/reducers";
import { Dashboard } from "../types";
import { renameDashboard, cloneDashboard, saveDashboard } from "../state/actionCreators";

interface Props {
  dashboard: Dashboard;
  onTitleChange: (event:React.KeyboardEvent<HTMLInputElement>, dashboard: Dashboard) => void;
  onBlur: (dashboard: Dashboard) => void;
  onClone: (id: string, newUser: string) => void;
  loggedInUser: string;
}
interface State{
  name: string;
}
class DashboardTitle extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {name: ""};
  }
  public componentWillReceiveProps(nextProps){
    if(nextProps.dashboard !== this.props.dashboard){
         this.setState({ name: nextProps.dashboard.name })
    }
}
  public render() {
    const { id, user:owner } = this.props.dashboard;
    const {name} = this.state;
    const { loggedInUser } = this.props;
    const isMine = loggedInUser === owner;
    const editable = isMine || !owner;
    const clonable = !isMine && loggedInUser && owner;
    return (
      <span className="dashboard-menu">
        <input
          type="text"
          value={name || "Untitled dashboard"}
          disabled={!editable}
          onChange={e => this.setState({name: e.target.value})}
          onKeyPress={e => this.props.onTitleChange(e, {id, name })}
          onBlur={() => this.props.onBlur({id, name })}
        />
        {clonable && (
          <span style={{ fontStyle: "italic" }}>
            This dashboard is owned by {owner} and cannot be edited
            <button
              onClick={() => this.props.onClone(id, loggedInUser)}
              className="btn-clone"
            >
              Clone Dashboard
            </button>
          </span>
        )}
      </span>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    dashboard: getSelectedDashboard(state),
    loggedInUser: getUserName(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onBlur: (dashboard:Dashboard) => {
      if (!dashboard.id){
        const {id, name} = dashboard;
        dispatch(saveDashboard(id, name, []));
      }else{
        return dispatch(renameDashboard(dashboard));
      }
    },
    onTitleChange: (e:React.KeyboardEvent<HTMLInputElement>, dashboard: Dashboard) => {
      if (e.key !== 'Enter'){
        return;
      }
      if (!dashboard.id){
        const {id, name} = dashboard;
        dispatch(saveDashboard(id, name, []));
      }else{
        return dispatch(renameDashboard(dashboard));
      }
    },
    onClone: (id: string, newUser: string) => {
      return dispatch(cloneDashboard(id, newUser));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTitle);
