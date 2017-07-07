import storage from '../../track/storage';
import {
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE
} from './types';

function createLick() {
    return { type: LICK_CREATE };
}

// Redux-thunk async action (save tracks to filesystem)
function updateLick(lick) {
    return (dispatch) => {
        // TODO Validate lick here?

        const tracks = lick.tracks;
        return Promise.all(tracks.map(track => saveTrack(track)))
            .then(tracks => {
                console.log(tracks);
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
        const id = await storage.saveBlob(track.blob);
        console.log('SAVED', id);
        return { id };
    }
    // Already stored
    return track;
}

function deleteLick(id) {
    return { type: LICK_DELETE, id };
}

export { createLick, updateLick, deleteLick };
