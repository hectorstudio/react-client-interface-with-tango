import React from 'react';
import {connect} from 'react-redux';

import { clearError } from '../../state/actions/error';
import { getError } from '../../state/selectors/error';
import PropTypes from 'prop-types'

import './ErrorDisplay.css';

const Error = ({error, onClear}) =>
  error &&
  <div className="error-display alert alert-danger" role="alert">
    <strong>Error:</strong> {error}
    <button type="button" className="close" onClick={() => onClear()}>&times;</button>
  </div>;

Error.propTypes = {
    error: PropTypes.string,
    onClear: PropTypes.func,
}

export default connect(
    state => ({
        error: getError(state)
    }),
    dispatch => ({
        onClear: () => dispatch(clearError())
    })
)(Error);
