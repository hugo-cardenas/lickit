import {
    SEARCH_ADD_FILTER,
    SEARCH_REMOVE_FILTER,
    SEARCH_SET_INPUT
} from '../actions/types';
import {
    TYPE_ARTIST,
    TYPE_TAG
} from '../../search/filterTypes';
import { uniqWith } from 'lodash';

const defaultState = {
    input: '',
    filters: []
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case SEARCH_ADD_FILTER:
            return addFilter(state, action.filter);
        case SEARCH_REMOVE_FILTER:
        case SEARCH_SET_INPUT:
        default:
            return state;
    }
};

const addFilter = (state, filter) => {
    // If there is an artist filter already stored, new artist filters are ignored
    if (filter.type === TYPE_ARTIST &&
        state.filters.find(filter => filter.type === TYPE_ARTIST)) {
        return state;
    }

    const areEqual = (filter1, filter2) =>
        filter1.type === filter2.type &&
        filter1.value === filter2.value;

    return {
        ...state,
        filters: uniqWith([...state.filters, filter], areEqual)
    };
};

const validateFilter = (filter) => {

};

const validateInput = (input) => {

};
