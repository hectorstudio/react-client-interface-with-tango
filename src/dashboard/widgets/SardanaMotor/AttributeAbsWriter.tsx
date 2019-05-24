import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import cx from "classnames";

import "./AttributeAbsWriter.css";

interface Props {
  writeValue: number;
  state: string;
  mode: string;
  onSetPosition: (value: number) => void;
  onStop: () => void;
}

export function AttributeAbsWriter(props: Props) {
  const isMoving = props.state === "MOVING";
  const writeValue = props.mode === "run" ? props.writeValue : 0;

  const [currentInput, setCurrentInput] = useState(String(writeValue));
  const [currentValue, setCurrentValue] = useState(writeValue);
  const [isInvalid, setIsInvalid] = useState(false);
  const [usesRelative, setUsesRelative] = useState(false);

  useEffect(() => {
    if (!usesRelative) {
      setCurrentValue(writeValue);
      setCurrentInput(String(writeValue));
    }
  }, [writeValue, usesRelative]);

  useEffect(() => {
    const value = Number(currentInput);
    const inputIsInvalid = isNaN(value) || currentInput === "";
    setIsInvalid(inputIsInvalid);

    if (!inputIsInvalid) {
      setCurrentValue(value);
    }
  }, [currentInput]);

  function triggerMove() {
    const target = currentValue + (usesRelative ? writeValue : 0);
    if (!isInvalid) {
      props.onSetPosition(target);
    }
  }

  function triggerStop() {
    props.onStop();
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentInput(event.target.value);
  }

  function onKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      triggerMove();
    }
  }

  function toggleUseRelative() {
    if (isMoving) {
      return;
    }

    const nextValue = !usesRelative;
    setUsesRelative(nextValue);
    setCurrentInput(nextValue ? "0" : String(writeValue));
  }

  const shownButton = isMoving ? (
    <button className="movement stop" onClick={triggerStop} tabIndex={-1}>
      Stop
    </button>
  ) : (
    <button
      className="movement"
      onClick={triggerMove}
      tabIndex={-1}
      disabled={isInvalid}
    >
      Move
    </button>
  );

  return (
    <div className="AttributeAbsWriter">
      <button
        className={cx("change-type", { relative: usesRelative })}
        onClick={toggleUseRelative}
        disabled={isInvalid}
        tabIndex={-1}
      >
        ∆
      </button>
      <input
        className={cx({ invalid: isInvalid })}
        disabled={isMoving}
        value={currentInput}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      {shownButton}
    </div>
  );
}
