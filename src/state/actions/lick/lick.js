import {
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE
} from '../types';

export default function getActions(trackStorage) {
    function createLick() {
        return { type: LICK_CREATE };
    }

    // Redux-thunk async action (save tracks to filesystem)
    function updateLick(lick) {
        return (dispatch) => {
            // TODO Validate lick here? - NO. Validate only the required part for saving tracks

            const tracks = lick.tracks;
            return Promise.all(tracks.map(track => saveTrack(track)))
                .then(tracks => {
                    return dispatch({
                        type: LICK_UPDATE,
                        lick: Object.assign({}, lick, { tracks })
                    });
                })
                .catch(error => {
                    // TODO Handle error
                    console.error(error);
                });
        };
    }

    async function saveTrack(track) {
        if (track.blob) {
            // Save new track
            const id = await trackStorage.saveBlob(track.blob);
            return { id };
        }
        // Already stored
        return track;
    }

    function deleteLick(id) {
        return { type: LICK_DELETE, id };
    }

    return { createLick, updateLick, deleteLick };
};
