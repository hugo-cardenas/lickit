import { merge, uniq } from 'lodash';
import { createLick, updateLick, deleteLick, changeLickMode } from './state/actions/lick';
import { addFilter, removeFilter, setInput } from './state/actions/search';
import { getUrlResolver } from './track/urlResolver';
import { TYPE_ARTIST, TYPE_TAG } from './search/filterTypes';

const mapStateToProps = (state) => {
    return {
        error: state.error,
        items: state.lick.items.map(mapLickStateToProps),
        search: mapSearchStateToProps(state)
    };
};

const mapLickStateToProps = (lickState) => {
    const lick = lickState.lick;
    return {
        mode: lickState.mode ? lickState.mode : undefined,
        lick: {
            id: lick.id,
            artist: lick.artist,
            description: lick.description,
            tags: [...lick.tags], // TODO Fix in a better way this reference problem - state modified as react state
            tracks: lick.tracks.map(track => {
                return {
                    ...track,
                    // Calculate track urls to filesystem from their id
                    url: 'file://' + getUrlResolver()(track.id)
                };
            })
        }
    };
};

const mapSearchStateToProps = (state) => {
    const input = state.search.input;
    return {
        filters: state.search.filters,
        input,
        suggestions: getSuggestions(input, state.lick.items)
    };
};

// TODO Move this out of map
const getSuggestions = (input, items) => {
    return [
        {
            title: TYPE_ARTIST,
            suggestions: uniq(items.map(item => item.lick.artist))
        },
        {
            title: TYPE_TAG,
            suggestions: uniq([].concat(...items.map(item => item.lick.tags)))
        }
    ];
};

const getArtists = () => {

};

const getTags = () => {

};

// TODO Change to simple object 
// https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
const mapDispatchToProps = (dispatch) => {
    return {
        createLick: () => dispatch(createLick()),
        saveLick: (lick) => dispatch(updateLick(lick)),
        deleteLick: (id) => dispatch(deleteLick(id)),
        changeLickMode: (id, mode) => dispatch(changeLickMode(id, mode)),
        addFilter: (filter) => dispatch(addFilter(filter)),
        removeFilter: (filter) => dispatch(removeFilter(filter)),
        setInput: (input) => dispatch(setInput(input))
    };
};

export { mapStateToProps, mapDispatchToProps };
