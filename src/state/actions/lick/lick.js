import {
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE
} from '../types';

export default function getActions(trackStorage) {
    function createLick() {
        return { type: LICK_CREATE };
    }

    // Redux-thunk async action (save/delete tracks to filesystem)
    function updateLick(lick) {
        return async(dispatch, getState) => {
            // TODO Validate lick here? - NO. Validate only the required part for saving tracks

            // TODO Handle what to do if only some of the promises fail 
            // (e.g. deletes successfully all tracks except one)

            // TODO May write a Redux selector for this http://redux.js.org/docs/recipes/ComputingDerivedData.html

            const storedTracks = getState().licks
                .find(lickState => lickState.lick.id === lick.id)
                .lick.tracks;

            let tracks;
            try {
                // Handle all new tracks submitted in form
                tracks = await Promise.all(lick.tracks.map(track => handleTrack(track)));
                // Delete all stored tracks which haven't been submitted
                const ids = tracks.map(track => track.id);
                const toBeDeletedTracks = storedTracks.filter(track => !ids.includes(track.id));
                await Promise.all(toBeDeletedTracks.map(track => deleteTrack(track.id)));
            } catch (error) {
                throw error;
            }
            return dispatch({
                type: LICK_UPDATE,
                lick: {...lick, tracks}
            });
        };
    }

    async function handleTrack(track) {
        if (track.blob) {
            // Save new track
            const id = await trackStorage.saveBlob(track.blob);
            return { id };
        }
        // Already stored
        return track;
    }

    async function deleteTrack(id) {
        trackStorage.deleteTrack(id);
    }

    function deleteLick(id) {
        return { type: LICK_DELETE, id };
    }

    return { createLick, updateLick, deleteLick };
}
