import { createSelector } from 'reselect';

const getFilteringState = state => state.filtering;

export const getFilter = createSelector(
    getFilteringState,
    state => state.filter
);
