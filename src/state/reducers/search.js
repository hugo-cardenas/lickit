import {
    SEARCH_ADD_FILTER,
    SEARCH_REMOVE_FILTER,
    SEARCH_SET_INPUT
} from '../actions/types';

const defaultState = {
    input: '',
    filters: []
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case SEARCH_ADD_FILTER:
        case SEARCH_REMOVE_FILTER:
        case SEARCH_SET_INPUT:
        default: return state;
    }
};
