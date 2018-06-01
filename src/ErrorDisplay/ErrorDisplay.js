import React from 'react';
import {connect} from 'react-redux';

import { clearError } from '../actions/ui';
import { getError } from '../selectors/ui';

import './ErrorDisplay.css';

const Error = ({error, onClear}) =>
  error &&
  <div className="error-display alert alert-danger" role="alert">
    <strong>Error:</strong> {error}
    <button type="button" className="close" onClick={() => onClear()}>&times;</button>
  </div>;

export default connect(
    state => ({
        error: getError(state)
    }),
    dispatch => ({
        onClear: () => dispatch(clearError())
    })
)(Error);
