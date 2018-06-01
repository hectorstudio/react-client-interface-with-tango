import { createSelector } from 'reselect';

const getUiState = state => state.ui;

export const getError = createSelector(
    getUiState,
    ui => ui.error
);
