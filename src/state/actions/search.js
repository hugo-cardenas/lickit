import {
    SEARCH_ADD_FILTER,
    SEARCH_REMOVE_FILTER,
    SEARCH_SET_INPUT
} from './types';

export const addFilter = (filter) => {
    return { type: SEARCH_ADD_FILTER, filter };
};

export const removeFilter = (filter) => {
    return { type: SEARCH_REMOVE_FILTER, filter };
};

export const setInput = (input) => {
    return { type: SEARCH_SET_INPUT, input };
};
