import React from "react";
import ModeToggleButton from "./ModeToggleButton";
import DashboardTitle from "./DashboardTitle";
import { DeviceConsumer } from "./DevicesProvider";
import { Navbar } from "../../shared/ui/navbar/Navbar";

interface Props {
  mode: "edit" | "run";
  onToggleMode: () => void;
  modeToggleDisabled: boolean;
}

function FetchInfo() {
  return (
    <span className="FetchInfo">
      <DeviceConsumer>
        {({ error, fetching, tangoDB }) =>
          fetching
            ? "Fetching devices…"
            : error
            ? `⚠️ Couldn't fetch devices from database ${tangoDB}.`
            : null
        }
      </DeviceConsumer>
    </span>
  );
}

export default function TopBar(props: Props) {
  const { mode, onToggleMode, modeToggleDisabled } = props;

  return (
    <Navbar>
      <div style={{ width: "100%", padding: "0 1em" }}>
        <form className="form-inline" style={{ display: "inline-block" }}>
          <ModeToggleButton
            onClick={onToggleMode}
            disabled={modeToggleDisabled}
            mode={mode}
          />
        </form>
        <DashboardTitle />
        <FetchInfo />
      </div>
    </Navbar>
  );
}
