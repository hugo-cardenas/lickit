import VError from 'verror';
import {
    LICK_OPEN_CREATION,
    LICK_CANCEL_CREATION,
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE,
    LICK_CHANGE_MODE
} from '../types';

export default function getActions(trackStorage) {
    function openCreation() {
        return { type: LICK_OPEN_CREATION };
    }

    function cancelCreation() {
        return { type: LICK_CANCEL_CREATION };
    }

    function createLick(lick) {
        return async dispatch => {
            let tracks;
            try {
                // Handle all new tracks submitted in form
                tracks = await Promise.all(
                    lick.tracks.map(track => handleTrack(track))
                );
            } catch (error) {
                throw new VError(
                    error,
                    'Unable to create action %s with lick %s',
                    LICK_CREATE,
                    JSON.stringify(lick)
                );
            }

            return dispatch({
                type: LICK_CREATE,
                lick: { ...lick, tracks }
            });
        };
    }

    function updateLick(lick) {
        return async (dispatch, getState) => {
            const storedTracks = getStoredTracks(getState(), lick.id);
            let tracks;

            try {
                // Handle all new tracks submitted in form
                tracks = await Promise.all(
                    lick.tracks.map(track => handleTrack(track))
                );
            } catch (error) {
                throw new VError(
                    error,
                    'Unable to create action %s with lick %s',
                    LICK_UPDATE,
                    JSON.stringify(lick)
                );
            }

            try {
                // Delete all stored tracks which haven't been submitted
                const ids = tracks.map(track => track.id);
                const toBeDeletedTracks = storedTracks.filter(
                    track => !ids.includes(track.id)
                );
                await Promise.all(
                    toBeDeletedTracks.map(track => deleteTrack(track.id))
                );
            } catch (error) {
                // If track deletion fails, just log the error and create the action successfully
                // TODO Log error
            }

            return dispatch({
                type: LICK_UPDATE,
                lick: { ...lick, tracks }
            });
        };
    }

    async function handleTrack(track) {
        if (track.blob) {
            // Save new track
            const id = await trackStorage.saveBlob(track.blob);
            return { id };
        } else if (track.id) {
            // Already stored
            return { id: track.id };
        } else {
            throw new VError(
                'Invalid track %s, should contain id or blob',
                JSON.stringify(track)
            );
        }
    }

    async function deleteTrack(id) {
        return trackStorage.deleteTrack(id);
    }

    function deleteLick(id) {
        return async (dispatch, getState) => {
            const storedTracks = getStoredTracks(getState(), id);
            try {
                await Promise.all(
                    storedTracks.map(track => deleteTrack(track.id))
                );
            } catch (error) {
                // If track deletion fails, just log the error and create the action successfully
                // TODO Log error
            }
            return dispatch({ type: LICK_DELETE, id });
        };
    }

    function changeLickMode(id, mode) {
        return { type: LICK_CHANGE_MODE, id, mode };
    }

    return {
        openCreation,
        cancelCreation,
        createLick,
        updateLick,
        deleteLick,
        changeLickMode
    };
}

// TODO May write a Redux selector for this http://redux.js.org/docs/recipes/ComputingDerivedData.html
function getStoredTracks(state, lickId) {
    return state.lick.byId[lickId].tracks;
}
