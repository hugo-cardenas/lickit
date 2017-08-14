import VError from 'verror';
import Joi from 'joi-browser';
import cuid from 'cuid';
import {
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE,
    LICK_CHANGE_MODE
} from '../actions/types';
import {
    LICK_MODE_EDIT,
    LICK_MODE_VIEW
} from '../actions/lick/modes';

const defaultState = {
    items: []
};

export default function (state = defaultState, action) {
    switch (action.type) {
        case LICK_CREATE:
            return createLick(state);
        case LICK_UPDATE:
            return updateLick(state, action.lick);
        case LICK_DELETE:
            return deleteLick(state, action.id);
        case LICK_CHANGE_MODE:
            return changeLickMode(state, action.id, action.mode);
        default:
            return state;
    }
}

function createLick(state) {
    return {
        ...state,
        items: [
            {
                lick: {
                    id: cuid(), // TODO Not so pure - maybe move to action?
                    artist: '',
                    description: '',
                    tracks: [],
                    tags: [],
                    createdAt: Date.now() // TODO Not so pure - maybe move to action?
                },
                mode: 'edit'
            },
            ...state.items
        ]
    };
}

function updateLick(state, newLick) {
    try {
        validateLick(newLick);
        var index = findItemIndex(state.items, newLick.id);
    } catch (error) {
        throw new VError(error, 'Unable to reduce %s with lick %s', LICK_UPDATE, JSON.stringify(newLick));
    }
    const { id, artist, description, tracks, tags } = newLick;

    const newState = {
        ...state,
        items: [
            ...state.items,
        ]
    };

    const item = state.items[index];
    newState.items[index] = {
        ...item,
        lick: { ...item.lick, id, artist, description, tracks, tags },
        mode: 'view'

    };

    return newState;
}

function deleteLick(state, id) {
    try {
        var index = findItemIndex(state.items, id);
    } catch (error) {
        throw new VError(error, 'Unable to reduce %s with id %s', LICK_DELETE, id);
    }

    const items = [...state.items];
    items.splice(index, 1);

    return {
        ...state,
        items
    };
}

function changeLickMode(state, id, mode) {
    const validModes = [LICK_MODE_EDIT, LICK_MODE_VIEW];
    try {
        if (!validModes.includes(mode)) {
            throw new VError('Invalid mode %s, should be one of %s', mode, validModes.join(', '));
        }
        const index = findItemIndex(state.items, id);
        const items = [...state.items];
        items[index] = { ...state.items[index], mode };

        return {
            ...state,
            items
        };

    } catch (error) {
        throw new VError(error, 'Unable to reduce %s with id %s and mode %s', LICK_CHANGE_MODE, id, mode);
    }
}

function validateLick(lick) {
    const schema = Joi.object().keys({
        id: Joi.string().required(),
        artist: Joi.string().allow('').required(),
        description: Joi.string().allow('').required(),
        tracks: Joi.array().items(Joi.object().keys({
            id: Joi.string().required()
        })).required(),
        tags: Joi.array().items(Joi.string()).required()
    });

    const { error } = Joi.validate(lick, schema, { abortEarly: false, convert: false });
    if (error) {
        throw error;
    }
}

// TODO Optimize indexing items by lick id
function findItemIndex(items, id) {
    const index = items.findIndex(item => item.lick.id === id);
    if (index < 0) {
        throw new VError('Id %s not found', id);
    }
    return index;
}
