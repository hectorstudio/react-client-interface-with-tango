import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";

import "./AttributeAbsWriter.css";

interface Props {
  writeValue: number;
  state: string;
  onSetPosition: (value: number) => void;
  onStop: () => void;
}

export function AttributeAbsWriter(props: Props) {
  const { writeValue, state } = props;
  const isMoving = state === "MOVING";

  const [currentValue, setCurrentValue] = useState(writeValue);

  useEffect(() => {
    setCurrentValue(writeValue);
  }, [writeValue]);

  function triggerSet() {
    props.onSetPosition(currentValue);
  }

  function triggerStop() {
    props.onStop();
  }

  const shownButton = isMoving ? (
    <button className="stop" onClick={triggerStop} tabIndex={-1}>
      Stop
    </button>
  ) : (
    <button onClick={triggerSet} tabIndex={-1}>
      Set
    </button>
  );

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentValue(event.target.valueAsNumber);
  }

  function onKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      triggerSet();
    }
  }

  return (
    <div className="AttributeAbsWriter">
      <input
        className="input"
        disabled={isMoving}
        value={currentValue}
        type="number"
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      {shownButton}
    </div>
  );
}
