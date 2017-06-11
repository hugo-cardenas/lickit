import VError from 'verror';
import validate from 'validate.js';
import Joi from 'joi';
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
    validateLick(lick);
    const index = findLickIndex(state, lick);
    const newState = [...state];
    newState[index] = lick;
    return newState;
}

function validateLick(lick) {
    const schema = Joi.object().keys({    
        id: Joi.number().min(1).required(),
        description: Joi.string().required(),
        tracks: Joi.array().required(),     // TODO Validate nested track objects
        tags: Joi.array().items(Joi.string()).required()
    });

    const {error} = Joi.validate(lick, schema, {abortEarly: false, convert: false});
    if (error) {
        throw new VError(error, 'Invalid lick %s', JSON.stringify(lick));
    }
}

function findLickIndex(state, lick) {
    const index = state.findIndex(storedLick => storedLick.id === lick.id);
    if (index < 0) {
        throw new VError('Invalid lick %s, Id %s not found', JSON.stringify(lick), lick.id);
    }
    return index;
}   