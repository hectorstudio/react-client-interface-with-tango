import React, { useState, useEffect } from "react";

import "./AttributeAbsWriter.css";

interface Props {
  writeValue: number;
  state: string;
  onSetPosition: (value: number) => void;
}

export function AttributeAbsWriter(props: Props) {
  const { writeValue, state } = props;
  const isMoving = state === "MOVING";

  const [currentValue, setCurrentValue] = useState(props.writeValue);

  useEffect(() => {
    setCurrentValue(writeValue);
  }, [writeValue]);

  function triggerSet() {
    props.onSetPosition(currentValue);
  }

  const shownButton = (
    <button disabled={isMoving} className="btn" onClick={triggerSet}>
      Set
    </button>
  );

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCurrentValue(event.target.valueAsNumber);
  }

  function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      triggerSet();
    }
  }

  return (
    <div className="attributeAbsWriter">
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
