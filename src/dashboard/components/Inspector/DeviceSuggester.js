import React, { Component } from "react";
import createGQLClient from "graphql-client";
import Autosuggest from "react-autosuggest";
import "./DeviceSuggester.css";

export default class DeviceSuggester extends Component {
  constructor(props) {
    super(props);
    const { devices, deviceName, onSelection } = this.props;
    this.state = {
      value: deviceName || "",
      suggestions: devices || []
    };
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onChange = this.onChange.bind(this);
    this.storeInputReference = this.storeInputReference.bind(this);
  }

  renderSuggestion = suggestion => {
    const { value } = this.state;
    const index = suggestion.indexOf(value.toLowerCase());
    if (index === -1){
      return <div>{suggestion}</div>
    }
    const split = suggestion.split("/");
    let s1 = split[0];
    let s2 = split[1];
    let s3 = split[2];
    let s1bold = "";
    let s2bold = "";
    let s3bold = "";
    if (split[0].toLowerCase().startsWith(value)){
      s1bold = split[0].substring(0, value.length)
      s1 = split[0].substring(value.length);
    }
    if (split[1].toLowerCase().startsWith(value)){
      s2bold = split[1].substring(0, value.length)
      s2 = split[1].substring(value.length);
    }
    if (split[2].toLowerCase().startsWith(value)){
      s3bold = split[2].substring(0, value.length) 
      s3 = split[2].substring(value.length);
    }
    return <div><b>{s1bold}</b>{s1}/<b>{s2bold}</b>{s2}/<b>{s3bold}</b>{s3}</div>
  }

  storeInputReference(autosuggest) {
    if (autosuggest !== null) {
      autosuggest.input.onfocus = () => {
        autosuggest.input.select();
      };
    }
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Specify device",
      value,
      onChange: this.onChange
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
      />
    );
  }

  getSuggestions(value) {
    if (value.trim() === "") {
      return [];
    }
    if (value.trim() === ".") {
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

  onSuggestionSelected(
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) {
    this.props.onSelection(suggestionValue);
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
}

const getSuggestionValue = suggestion => suggestion;