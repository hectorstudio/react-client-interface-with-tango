import React, { Component, FormEvent } from "react";

import "./PrecisionAttributeWriter.css";

interface State {
  wholeArray: number[];
  decimalArray: number[];
  positive: boolean;
}
interface Props {
  initialValue: number;
  precision: number;
  maxMagnitude: number;
  mode: string;
  onValueChange: (value: number) => void;
}
export class PrecisionAttributeWriter extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    const { precision, maxMagnitude, initialValue } = this.props;
    this.state = {
      wholeArray: this.getWholeArray(initialValue, maxMagnitude),
      decimalArray: this.getDecimalArray(initialValue, precision),
      positive: true
    };
  }

  /**
   * We need to update the state on component update in two cases:
   * 1) We're in edit mode and chaning the precision or magnitude params.
   * 2) We're in run mode and the initialValue has changed
   * @param prevProps
   */
  public componentDidUpdate(prevProps) {
    const {
      mode: prevMode,
      precision: prevPrecision,
      maxMagnitude: prevMaxMag,
      initialValue: prevInitialValue
    } = prevProps;
    const { mode, initialValue, precision, maxMagnitude } = this.props;
    const newPrecision = prevPrecision != precision;
    const newMaxMag = prevMaxMag != maxMagnitude;
    const newInitialvalue = prevInitialValue != initialValue;
    if (
      (mode === "edit" && (newPrecision || newMaxMag)) ||
      (mode === "run" && newInitialvalue)
    ) {
      this.setState({
        wholeArray: this.getWholeArray(initialValue, maxMagnitude),
        decimalArray: this.getDecimalArray(initialValue, precision),
        positive: initialValue >= 0
      });
    }
  }

  public render() {
    return this.createWidget();
  }

  private createWidget() {
    const { precision, maxMagnitude } = this.props;
    const { wholeArray, decimalArray, positive } = this.state;
    const upArrows: JSX.Element[] = [];
    const downArrows: JSX.Element[] = [];
    for (let i = 0; i < maxMagnitude + 1; i++) {
      upArrows[i] = (
        <button
          key={i}
          onClick={e => this.increment(i, true)}
          className="btn btn-up fa fa-sort-up "
        />
      );
      downArrows[i] = (
        <button
          key={i}
          onClick={e => this.decrement(i, true)}
          className="btn btn-down fa fa-sort-down"
        />
      );
    }
    upArrows[maxMagnitude] = (
      <button
        key={maxMagnitude}
        disabled={true}
        className="btn btn-up fa fa-sort-up hidden"
      />
    );
    downArrows[maxMagnitude] = (
      <button
        key={maxMagnitude}
        disabled={true}
        className="btn btn-up fa fa-sort-down hidden"
      />
    );

    for (let i = 0; i < precision; i++) {
      upArrows[i + maxMagnitude + 1] = (
        <button
          key={i + maxMagnitude + 1}
          onClick={e => this.increment(i, false)}
          className="btn btn-up fa fa-sort-up "
        />
      );
      downArrows[i + maxMagnitude + 1] = (
        <button
          key={i + maxMagnitude + 1}
          onClick={e => this.decrement(i, false)}
          className="btn btn-down fa fa-sort-down"
        />
      );
    }
    const sign = positive ? "+" : "-";
    return (
      <div className="paw">
          <button
            title="Toggle sign"
            className="btn-sign"
            onClick={() => this.toggleSign()}
          >
            {sign}
          </button>

        <div style={{ display: "inline-block" }}>
          <div style={{ marginBottom: "-0.3em" }}>
            {upArrows.map(elem => elem)}
          </div>
          <div className="set-position">
            {wholeArray.join("")}.{decimalArray.join("")}
          </div>
          <div style={{ marginTop: "-1.1rem" }}>
            {downArrows.map(elem => elem)}
          </div>
        </div>
      </div>
    );
  }
  private getWholeArray(value: number, maxMagnitude: number): number[] {
    if (!value) {
      value = 0;
    }
    let whole = Math.abs(Math.floor(value)).toString();
    if (whole.includes(".")) {
      whole = whole.substring(0, whole.indexOf("."));
    }
    return this.lpad(
      whole.split("").map(char => parseInt(char, 10)),
      maxMagnitude
    );
  }
  private getDecimalArray(value: number, precision: number): number[] {
    if (!value) {
      value = 0;
    }
    let decimal = (value - Math.floor(value)).toString();
    if (decimal.includes(".")) {
      decimal = decimal.substring(decimal.indexOf(".") + 1);
    }
    if (decimal.length > precision) {
      decimal = decimal.substring(0, precision);
    }
    return this.rpad(
      decimal.split("").map(char => parseInt(char, 10)),
      precision
    );
  }
  private increment(index: number, whole: boolean) {
    if (whole) {
      const { wholeArray } = this.state;
      wholeArray[index] = (wholeArray[index] + 1) % 10;
      if (wholeArray[index] === 0 && index > 0){
        //roll over and increment the next digit
        this.increment(index-1, true);
      }
      this.setState({ wholeArray }, () =>
        this.props.onValueChange(this.getValue())
      );
    } else {
      const { decimalArray } = this.state;
      decimalArray[index] = (decimalArray[index] + 1) % 10;
      if (decimalArray[index] === 0 && index > 0){
        //roll over and increment the next digit
        this.increment(index-1, false);
      }else if (decimalArray[index] === 0 && index === 0){
        const { wholeArray } = this.state;
        if (wholeArray.length > 0){
           //roll over and increment the whole next digit
          this.increment(wholeArray.length - 1, true);
        }
      }
      this.setState({ decimalArray }, () =>
        this.props.onValueChange(this.getValue())
      );
    }
  }

  private decrement(index: number, whole: boolean) {
    if (whole) {
      const { wholeArray } = this.state;
      if (wholeArray[index] === 0) {
        wholeArray[index] = 9;
        if (index > 0){
          //roll over and decrement the next digit
          this.decrement(index-1, true);
        }
      } else {
        wholeArray[index] = wholeArray[index] - 1;
      }
      this.setState({ wholeArray }, () =>
        this.props.onValueChange(this.getValue())
      );
    } else {
      const { decimalArray } = this.state;
      if (decimalArray[index] === 0) {
        decimalArray[index] = 9;
        if (index > 0){
          //roll over and decrement the next digit
          this.decrement(index-1, false);
        }else{
          const { wholeArray } = this.state;
          if (wholeArray.length > 0){
            //roll over and decrement the next whole digit
            this.decrement(wholeArray.length - 1, true);
          }
        }
      } else {
        decimalArray[index] = decimalArray[index] - 1;
      }

      this.setState({ decimalArray }, () =>
        this.props.onValueChange(this.getValue())
      );
    }
  }

  private lpad(value: number[], length: number) {
    while (value.length < length) {
      value.unshift(0);
    }
    return value;
  }

  private rpad(value: number[], length: number) {
    while (value.length < length) {
      value.push(0);
    }
    return value;
  }

  private getValue(): number {
    const { wholeArray, decimalArray, positive } = this.state;
    const value =
      (positive ? 1 : -1) *
      parseFloat(wholeArray.join("") + "." + decimalArray.join(""));
    return value;
  }
  private setValue(value: number) {
    const { maxMagnitude, precision } = this.props;
    this.state = {
      wholeArray: this.getWholeArray(value, maxMagnitude),
      decimalArray: this.getDecimalArray(value, precision),
      positive: value >= 0
    };
  }
  private toggleSign() {
    const { positive } = this.state;
    this.setState({ positive: !positive }, () =>
      this.props.onValueChange(this.getValue())
    );
  }
}
