import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import alphanumSort from "alphanum-sort";

import "./DeviceSuggester.css";

interface State {
  value: string;
  suggestions: string[];
}

interface Props {
  devices: string[];
  deviceName: string | undefined;
  onSelection: (newValue: string) => void;
}

export default class DeviceSuggester extends Component<Props, State> {
  constructor(props) {
    super(props);
    const { devices, deviceName } = this.props;
    this.state = {
      value: deviceName || "",
      suggestions: devices || []
    };

    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onChange = this.onChange.bind(this);
    this.storeInputReference = this.storeInputReference.bind(this);
  }

  public componentDidUpdate(prevProps: Props) {
    const { deviceName } = this.props;
    if (deviceName !== prevProps.deviceName) {
      this.setState({ value: deviceName || "" });
    }
  }

  public renderSuggestion = (suggestion: string) => {
    // deal with highlighting of matching texts

    const { value } = this.state;
    const index = suggestion.toLowerCase().indexOf(value.toLowerCase());
    if (index === -1) {
      // no highlight, e.g. when value === "*"
      return <div>{suggestion}</div>;
    }
    if (value.includes("/")) {
      // highlight everything that matches
      return (
        <div>
          {suggestion.substring(0, index)}
          <b>{suggestion.substring(index, index + value.length)}</b>
          {suggestion.substring(index + value.length)}
        </div>
      );
    }
    // hightlight matching beginnings of each slash-separated token in the device string
    const split = suggestion.split("/");
    let s1 = split[0];
    let s2 = split[1];
    let s3 = split[2];
    let s1bold = "";
    let s2bold = "";
    let s3bold = "";
    if (split[0].toLowerCase().startsWith(value)) {
      s1bold = split[0].substring(0, value.length);
      s1 = split[0].substring(value.length);
    }
    if (split[1].toLowerCase().startsWith(value)) {
      s2bold = split[1].substring(0, value.length);
      s2 = split[1].substring(value.length);
    }
    if (split[2].toLowerCase().startsWith(value)) {
      s3bold = split[2].substring(0, value.length);
      s3 = split[2].substring(value.length);
    }
    return (
      <div>
        <b>{s1bold}</b>
        {s1}/<b>{s2bold}</b>
        {s2}/<b>{s3bold}</b>
        {s3}
      </div>
    );
  };

  public storeInputReference(autosuggest: Autosuggest): void {
    if (autosuggest !== null) {
      autosuggest.input.spellcheck = false;
      autosuggest.input.onfocus = () => {
        autosuggest.input.select();
      };
    }
  }

  public render(): Autosuggest {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type in a device...",
      value,
      onChange: this.onChange
    };

    const theme = {
      ...Autosuggest.defaultProps.theme,
      input: "form-control react-autosuggest__input"
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        highlightFirstSuggestion={true}
        ref={this.storeInputReference}
        inputProps={inputProps}
        theme={theme}
      />
    );
  }

  public getSuggestions(value: string): string[] {
    if (value.trim() === "") {
      return [];
    }
    if (value.trim() === "*") {
      return this.props.devices.slice();
    }
    if (value.includes("/")) {
      return this.props.devices.filter(device =>
        getSuggestionValue(device)
          .toLowerCase()
          .includes(value.trim().toLowerCase())
      );
    }
    const res = this.props.devices.filter(device => {
      const parts = getSuggestionValue(device)
        .toLowerCase()
        .split("/");
      return (
        parts.filter(part => part.startsWith(value.trim().toLowerCase()))
          .length > 0
      );
    });
    return res;
  }

  // The suggester is unusably slow and resource-demanding if the list is not truncated. This is just a quickfix; there's probably a more sophisticated way such as using react-window
  public getTruncatedSuggestions(value: string): string[] {
    return this.getSuggestions(value).slice(0, 100);
  }

  public onSuggestionSelected(event, { suggestion, suggestionValue }): void {
    this.props.onSelection(suggestionValue);
  }

  public onChange = (event, { newValue, method }): void => {
    this.setState({
      value: newValue
    });
  };

  public onSuggestionsFetchRequested = ({ value }): void => {
    this.setState({
      suggestions: alphanumSort(this.getTruncatedSuggestions(value))
    });
  };

  public onSuggestionsClearRequested = (): void => {
    this.setState({
      suggestions: []
    });
  };
}

const getSuggestionValue = (suggestion: string) => suggestion;
