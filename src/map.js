import { createLick, updateLick, deleteLick } from './state/actions/lick';
import { getUrlResolver } from './track/urlResolver';

function mapStateToProps(state) {
    return {
        licks: state.licks.map(mapLickStateToProps)
    };
}

function mapLickStateToProps(lickState) {
    return {
        lick: {
            ...lickState.lick,
            tracks: lickState.lick.tracks.map(track => {
                return {
                    ...track,
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
