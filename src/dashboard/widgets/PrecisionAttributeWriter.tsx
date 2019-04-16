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
    const {precision, maxMagnitude} = this.props;
    this.state = {
      wholeArray: this.getWholeArray(0, maxMagnitude),
      decimalArray: this.getDecimalArray(0, precision),
      positive: true,
    };
  }

  public componentDidUpdate(prevProps) {
    const { mode: prevMode } = prevProps.mode;
    const { mode, initialValue, precision, maxMagnitude } = this.props;
    if (prevMode === "edit" && mode === "run") {
      this.setState({
        wholeArray: this.getWholeArray(initialValue, maxMagnitude),
        decimalArray: this.getDecimalArray(initialValue, precision),
        positive: initialValue > 0
      });
    }
  }

  public render() {
    return this.createWidget();
  }
  

  private createWidget() {

    const { precision, maxMagnitude } = this.props;
    const {wholeArray, decimalArray } = this.state;
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

    return (
      <div className="paw">
        <div style={{ marginBottom: "-0.3em" }}>
          {upArrows.map(elem => elem)}
        </div>
        <div className="set-position">
        {wholeArray.join('')}.
        {decimalArray.join('')}
        </div>
        <div style={{ marginTop: "-1.1rem" }}>
          {downArrows.map(elem => elem)}
        </div>
      </div>
    );
  }
  private getWholeArray(value:number, maxMagnitude:number):number[]{
    if (!value){
      value = 0;
    }
    let whole = Math.abs(Math.floor(value)).toString();
    if (whole.includes(".")){
      whole = whole.substring(0, whole.indexOf("."));
    }
    return this.lpad(whole.split('').map((char => parseInt(char, 10))), maxMagnitude);
  }
  private getDecimalArray(value:number, precision:number):number[]{
    if (!value){
      value = 0;
    }
    let decimal = (value - Math.floor(value)).toString();
    if (decimal.length > precision){
      decimal = decimal.substring(0, precision);
    }
    if (decimal.includes(".")){
      decimal = decimal.substring(decimal.indexOf(".") + 1);
    }
    return this.rpad(decimal.split('').map((char => parseInt(char, 10))), precision);
  }
  private increment(index:number, whole:boolean) {
    if (whole){
      const {wholeArray} = this.state;
      wholeArray[index] = (wholeArray[index] + 1) % 10;
      this.setState({wholeArray})
    }else{
      const {decimalArray} = this.state;
      decimalArray[index] = (decimalArray[index] + 1) % 10;
      this.setState({decimalArray})
    }
  }

  private decrement(index:number, whole:boolean) {
    if (whole){
      const {wholeArray} = this.state;
      if (wholeArray[index] === 0){
        wholeArray[index] = 9;
      }else{
        wholeArray[index] = wholeArray[index] - 1;  
      }
      this.setState({wholeArray})
    }else{
      const {decimalArray} = this.state;
      if (decimalArray[index] === 0){
        decimalArray[index] = 9;
      }else{
        decimalArray[index] = decimalArray[index] - 1;
      }
      
      this.setState({decimalArray})
    }
  }

  private lpad(value: number[], length: number) {
    while(value.length < length){
      value.unshift(0);
    }
    return value;
  }

  private rpad(value: number[], length: number) {
    while(value.length < length){
      value.push(0);
    }
    return value;
  }

  private getValue():number{
    const {wholeArray, decimalArray} = this.state;
    return parseInt(wholeArray.join('') + "." + decimalArray.join(''), 10);
  }
}
