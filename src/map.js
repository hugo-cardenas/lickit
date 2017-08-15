import { merge, uniq } from 'lodash';
import { createLick, updateLick, deleteLick, changeLickMode } from './state/actions/lick';
import { addFilter, removeFilter, setInput } from './state/actions/search';
import { getUrlResolver } from './track/urlResolver';
import { TYPE_ARTIST, TYPE_TAG } from './search/filterTypes';

const mapStateToProps = (state) => {
    return {
        error: state.error,
        lick: mapLickStateToProps(state),
        search: mapSearchStateToProps(state)
    };
};

const mapLickStateToProps = (state) => {
    return {
        items: state.lick.items.map(mapItemToProp)
    };
};

const mapItemToProp = (item) => {
    const lick = item.lick;
    return {
        mode: item.mode ? item.mode : undefined,
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
    const filters = state.search.filters;
    const input = state.search.input;
    return {
        filters,
        input,
        suggestions: getSuggestions(input, state.lick.items, filters)
    };
};

// TODO Move this out of map and memoize ops
const getSuggestions = (input, items, filters) => {
    // Allow to set max 5 filters, don't show any more suggestions
    if (filters.length >= 5) {
        return [];
    }

    const matchesInput = suggestion =>
        suggestion.toLowerCase().includes(input.toLowerCase());

    let artists;
    // Exclude all artist suggestions if there is already an artist filter
    if (filters.find(filter => filter.type === TYPE_ARTIST)) {
        artists = [];
    } else {
        artists = uniq(items
            .map(item => item.lick.artist)
            //.filter(matchesInput)             // TODO Update tests for removing input match
            );
    }

    // Exclude tag suggestions which are already set in filters
    const isContainedInFilters = tag =>
        filters.find(filter => filter.type === TYPE_TAG && filter.value === tag) !== undefined;

    const tags = uniq(
        [].concat(...items.map(item => item.lick.tags))
        //.filter(matchesInput)                     // TODO Update tests for removing input match
        .filter(tag => !isContainedInFilters(tag))
    );

    const compareCaseInsensitive = (a, b) => 
        a.toLowerCase() <= b.toLowerCase() ? -1 : 1;

    artists.sort(compareCaseInsensitive);
    tags.sort(compareCaseInsensitive);
    
    const suggestions = [
        {
            title: TYPE_ARTIST,
            suggestions: artists
        },
        {
            title: TYPE_TAG,
            suggestions: tags
        }
    ];

    // Exclude sections with 0 suggestions
    return suggestions.filter(entry => entry.suggestions.length > 0);
};

// TODO Change to simple object 
// https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
const mapDispatchToProps = (dispatch) => {
    return {
        lick: {
            createLick: () => dispatch(createLick()),
            saveLick: (lick) => dispatch(updateLick(lick)),
            deleteLick: (id) => dispatch(deleteLick(id)),
            changeLickMode: (id, mode) => dispatch(changeLickMode(id, mode)),
        },
        search: {
            addFilter: (filter) => dispatch(addFilter(filter)),
            removeFilter: (filter) => dispatch(removeFilter(filter)),
            setInput: (input) => dispatch(setInput(input))
        }
    };
};

const mergeProps = (stateProps, dispatchProps) => merge(stateProps, dispatchProps);

export { mapStateToProps, mapDispatchToProps, mergeProps };
