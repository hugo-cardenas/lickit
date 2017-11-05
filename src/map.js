import { difference, groupBy, merge, uniq } from 'lodash';
import { createLick, updateLick, deleteLick, changeLickMode } from './state/actions/lick';
import { addFilter, removeFilter, setInput } from './state/actions/search';
import { getPathResolver } from './track/pathResolver';
import { TYPE_ARTIST, TYPE_TAG } from './search/filterTypes';

const mapStateToProps = (state) => {
    return {
        error: state.error,
        lick: mapLickStateToProps(state),
        search: mapSearchStateToProps(state)
    };
};

const mapLickStateToProps = (state) => {
    const stateItems = state.lick.items.map(mapItemToProp);
    
    const groupedItems = Object.values(groupBy(stateItems, item => item.lick.artist))
        .map(items => {
            items.sort((a, b) => a.lick.createdAt - b.lick.createdAt);
            return items.map((item, index) => {
                return {
                    ...item,
                    lick: {
                        ...item.lick,
                        artistIndex: index + 1
                    }
                };
            });
        });

    const items = [].concat(...groupedItems);
    items.sort((a, b) => b.lick.createdAt - a.lick.createdAt);

    const filters = state.search.filters;
    const artist = getFilteredArtist(filters);
    const tags = getFilteredTags(filters);

    const filteredItems = items.filter(item =>
        (!artist || item.lick.artist === artist) &&
        difference(tags, item.lick.tags).length === 0
    );

    return {
        items: filteredItems
    };
};

const getFilteredArtist = filters => {
    const artistFilter = filters.find(filter => filter.type === 'Artist');
    return artistFilter ? artistFilter.value : undefined;
};

const getFilteredTags = filters =>
    filters.filter(filter => filter.type === 'Tag').map(filter => filter.value);

const mapItemToProp = (item) => {
    const lick = item.lick;
    // TODO Fix in a better way this reference problem - state modified as react state
    const tags = [...lick.tags];
    tags.sort();

    return {
        mode: item.mode ? item.mode : undefined,
        lick: {
            id: lick.id,
            artist: lick.artist,
            description: lick.description,
            tags,
            tracks: lick.tracks.map(track => {
                return {
                    ...track,
                    // Calculate track urls to filesystem from their id
                    url: 'file://' + getPathResolver()(track.id)
                };
            }),
            createdAt: lick.createdAt
        }
    };
};

const mapSearchStateToProps = (state) => {
    const filters = state.search.filters;
    const input = state.search.input;
    return {
        filters,
        input,
        suggestions: getSuggestions(state.lick.items, filters)
    };
};

// TODO Move this out of map and memoize ops - Redux selector
const getSuggestions = (items, filters) => {
    // Allow to set max 5 filters, don't show any more suggestions
    if (filters.length >= 5) {
        return [];
    }

    let artists;
    // Exclude all artist suggestions if there is already an artist filter
    if (filters.find(filter => filter.type === TYPE_ARTIST)) {
        artists = [];
    } else {
        artists = uniq(items
            .map(item => item.lick.artist)
            .filter(item => item.length > 0));
    }

    // Exclude tag suggestions which are already set in filters
    const isContainedInFilters = tag =>
        filters.find(filter => filter.type === TYPE_TAG && filter.value === tag) !== undefined;

    const tags = uniq(
        [].concat(...items.map(item => item.lick.tags))
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
