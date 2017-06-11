import VError from 'verror';
import validate from 'validate.js';
import {
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE
} from '../actions/types';

export default function (state = [], action) {
    switch (action.type) {
        case LICK_CREATE:
            return createLick(state);
        case LICK_UPDATE:
            return updateLick(state, action.lick);
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

function updateLick(state, lick) {
    // TODO Validate lick
    validateLick(lick);
    // TODO Handle id not found
    const index = state.findIndex(storedLick => storedLick.id === lick.id);
    const newState = [...state];
    newState[index] = lick;
    return newState;
}

function validateLick(lick) {
    console.log(lick);
    const constraints = {
        description: {
            presence: true
        }
    };
    const errors = validate(lick, constraints);
    throw new VError(`Invalid lick ${JSON.stringify(lick)}: ${JSON.stringify(errors)}`);
}