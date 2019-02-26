import React, { Fragment } from "react";
import { Route } from "react-router";
import { Link } from 'react-router-dom'

class ShowLogs extends React.Component{
    render() {
      return (
      <Route
        path="/:tangoDB/*"
        render={({match}) =>{
          const tangoDB = match.params.tangoDB;
          return <Link
            to={"/" + tangoDB + "/"}
            style={{ fontSize: "0.75em"}}
            >Overview</Link>;
        }}
      ></Route>
      )
    }
  }

  export default ShowLogs