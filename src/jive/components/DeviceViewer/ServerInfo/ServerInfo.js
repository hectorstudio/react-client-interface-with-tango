import React from "react";
import PropTypes from "prop-types";

import "./ServerInfo.css";

const ServerTable = ({ server }) => (
  <table>
    <tbody>
      <tr>
        <th>Server</th>
        <td>{server.id}</td>
      </tr>
      <tr>
        <th>Host</th>
        <td>{server.host}</td>
      </tr>
    </tbody>
  </table>
);

const ServerInfo = ({ device }) => {
  const { connected, server } = device;

  const inner =
    connected === false ? (
      "Couldn't connect to the device."
    ) : server == null ? (
      "No server information available."
    ) : (
      <ServerTable server={server} />
    );

  return <div className="ServerInfo">{inner}</div>;
};

ServerInfo.propTypes = {
  connected: PropTypes.bool,
  server: PropTypes.shape({
    id: PropTypes.string,
    host: PropTypes.string
  })
};

export default ServerInfo;
