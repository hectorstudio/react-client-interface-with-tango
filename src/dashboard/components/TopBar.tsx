import React from "react";
import ModeToggleButton from "./ModeToggleButton";
import LogInOut from "../../shared/user/components/LogInOut/LogInOut";
import { DeviceConsumer } from "./DevicesProvider";

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
    <div className="TopBar">
      <div>
        <form className="form-inline" style={{ display: "inline-block" }}>
          <ModeToggleButton
            onClick={onToggleMode}
            disabled={modeToggleDisabled}
            mode={mode}
          />
        </form>
        <FetchInfo />
      </div>
      <LogInOut />
    </div>
  );
}
