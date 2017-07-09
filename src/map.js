import { createLick, updateLick, deleteLick } from './state/actions/lick';
import { getUrlResolver } from './track/urlResolver';

function mapStateToProps(state) {
    return {
        licks: state.licks.map(mapLickStateToProps)
    };
}

function mapLickStateToProps(lickState) {
    return {
        mode: lickState.mode ? lickState.mode : undefined,
        lick: {
            ...lickState.lick,
            tracks: lickState.lick.tracks.map(track => {
                return {
                    ...track,
                    // Calculate track urls to filesystem from their id
                    url: 'file://' + getUrlResolver()(track.id)
                };
            })
        }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // TODO Change to handleCreateLick, etc
        handleCreate: () => dispatch(createLick()),
        handleSave: (lick) => dispatch(updateLick(lick)),
        handleDelete: (id) => dispatch(deleteLick(id))
    };
}

export { mapStateToProps, mapDispatchToProps };
