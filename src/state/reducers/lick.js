import VError from 'verror';
import Joi from 'joi-browser';
import cuid from 'cuid';
import {
    LICK_OPEN_CREATION,
    LICK_CANCEL_CREATION,
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE,
    LICK_CHANGE_MODE
} from '../actions/types';
import { LICK_MODE_EDIT, LICK_MODE_VIEW } from '../actions/lick/modes';
import { combineReducers } from 'redux';

const isCreationOpen = (isCreationOpen = false, action) => {
    switch (action.type) {
        case LICK_OPEN_CREATION:
            return true;
        case LICK_CREATE:
        case LICK_CANCEL_CREATION:
            return false;
        default:
            return isCreationOpen;
    }
};

const editLickId = (editLickId = null, action) => {
    switch (action.type) {
        case LICK_CHANGE_MODE:
            return changeLickMode(editLickId, action.id, action.mode);
        case LICK_UPDATE:
            return null;
        default:
            return editLickId;
    }
};

const byId = (licks = {}, action) => {
    switch (action.type) {
        case LICK_CREATE:
            return createLick(licks, action.lick);
        case LICK_UPDATE:
            return updateLick(licks, action.lick);
        case LICK_DELETE:
            return deleteLick(licks, action.id);
        default:
            return licks;
    }
};

export default combineReducers({
    isCreationOpen,
    editLickId,
    byId
});

const createLick = (licks, newLick) => {
    try {
        validateNewLick(newLick);
    } catch (error) {
        throw createReducerLickError(error, LICK_CREATE, newLick);
    }

    const { artist, description, tracks, tags } = newLick;
    const id = cuid(); // TODO Not pure - maybe move to action?
    const createdAt = Date.now(); // TODO Not pure - maybe move to action?

    return {
        ...licks,
        [id]: {
            artist,
            description,
            tracks,
            tags,
            createdAt
        }
    };
};

const updateLick = (licks, newLick) => {
    try {
        validateUpdatingLick(newLick);
        validateLickIndex(licks, newLick.id);
    } catch (error) {
        throw createReducerLickError(error, LICK_UPDATE, newLick);
    }

    const { id, artist, description, tracks, tags } = newLick;
    return {
        ...licks,
        [newLick.id]: {
            ...licks[id],
            artist,
            description,
            tracks,
            tags
        }
    };
};

const createReducerLickError = (previousError, action, lick) => (
    new VError(
        previousError,
        'Unable to reduce %s with lick %s',
        action,
        JSON.stringify(lick)
    )
);

const deleteLick = (licks, id) => {
    try {
        validateLickIndex(licks, id);
    } catch (error) {
        throw new VError(
            error,
            'Unable to reduce %s with id %s',
            LICK_DELETE,
            id
        );
    }

    const nextLicks = { ...licks };
    delete nextLicks[id];
    return nextLicks;
};

const changeLickMode = (editLickId, id, mode) => {
    try {
        validateMode(mode);
        if (mode === LICK_MODE_EDIT) {
            return id;
        }
        return null;
    } catch (error) {
        throw new VError(
            error,
            'Unable to reduce %s with id %s and mode %s',
            LICK_CHANGE_MODE,
            id,
            mode
        );
    }
};

const validateNewLick = (lick) => {
    const schema = getNewLickSchema();
    const { error } = Joi.validate(lick, schema, getJoiOptions());
    if (error) {
        throw error;
    }
};

const validateUpdatingLick = (lick) => {
    const schema = getUpdatedLickSchema();
    const { error } = Joi.validate(lick, schema, getJoiOptions());
    if (error) {
        throw error;
    }
};

const validateMode = mode => {
    const validModes = [LICK_MODE_EDIT, LICK_MODE_VIEW];
    if (!validModes.includes(mode)) {
        throw new VError(
            'Invalid mode %s, should be one of %s',
            mode,
            validModes.join(', ')
        );
    }
};

function validateLickIndex(licks, id) {
    if (!licks[id]) {
        throw new VError(`Lick id ${id} not found`);
    }
}

function getNewLickSchema() {
    return Joi.object().keys({
        artist: Joi.string()
            .allow('')
            .required(),
        description: Joi.string()
            .allow('')
            .required(),
        tracks: Joi.array()
            .items(
                Joi.object().keys({
                    id: Joi.string().required()
                })
            )
            .required(),
        tags: Joi.array()
            .items(Joi.string())
            .required()
    });
}

function getUpdatedLickSchema() {
    return getNewLickSchema().keys({
        id: Joi.string().required()
    });
}

function getJoiOptions() {
    return { abortEarly: false, allowUnknown: true, convert: false };
}

// TODO Optimize indexing items by lick id
function findItemIndex(items, id) {
    const index = items.findIndex(item => item.lick.id === id);
    if (index < 0) {
        throw new VError('Id %s not found', id);
    }
    return index;
}
