import {
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE
} from '../actions/types';

export default function (state = [], action) {
    switch (action.type) {
        case LICK_CREATE:
            return createLick(state);
        default:
            return state;
    }
};

function createLick(state) {
    return [
        ...state,
        {
            description: '',
            tracks: [],
            tags: []
        }
    ];
}
