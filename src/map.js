import { difference, groupBy, merge, uniq } from 'lodash';
import {
    enableCreateLickForm,
    cancelCreateLickForm,
    createLick,
    updateLick,
    deleteLick,
    changeLickMode
} from './state/actions/lick';
import { addFilter, removeFilter, setInput } from './state/actions/search';
import { getPathResolver } from './track/pathResolver';
import { TYPE_ARTIST, TYPE_TAG } from './search/filterTypes';
import { LICK_MODE_EDIT, LICK_MODE_VIEW } from './state/actions/lick/modes';

const mapStateToProps = state => {
    const lickProps = mapLickStateToProps(state);
    return {
        error: state.error,
        lick: lickProps,
        // search: mapSearchStateToProps(state.search, lickProps.items)
    };
};

const mapLickStateToProps = state => {
    const { byId, editLickId } = state.lick;
    const stateLicks = Object.keys(byId)
        .map(id => mapLickToProp(id, byId[id], editLickId));

    const groupedByArtist = Object.values(
        groupBy(stateLicks, lick => lick.artist)
    ).map(licks => {
        licks.sort((a, b) => a.createdAt - b.createdAt);
        return licks.map((lick, index) => {
            return {
                ...lick,
                artistIndex: index + 1
            };
        });
    });

    const licks = [].concat(...groupedByArtist);
    licks.sort((a, b) => b.lick.createdAt - a.lick.createdAt);

    const filters = state.search.filters;
    const artist = getFilteredArtist(filters);
    const tags = getFilteredTags(filters);

    const filteredLicks = licks.filter(
        lick =>
        (!artist || lick.artist === artist) &&
        difference(tags, lick.tags).length === 0
    );

    return {
        isCreationOpen: state.lick.isCreationOpen,
        licks: filteredLicks
    };
};

const getFilteredArtist = filters => {
    const artistFilter = filters.find(filter => filter.type === 'Artist');
    return artistFilter ? artistFilter.value : undefined;
};

const getFilteredTags = filters =>
    filters.filter(filter => filter.type === 'Tag').map(filter => filter.value);

const mapLickToProp = (id, lick, editLickId) => {
    // TODO Fix in a better way this reference problem - state modified as react state
    const tags = [...lick.tags];
    tags.sort();

    return {
        id,
        artist: lick.artist,
        description: lick.description,
        mode: editLickId === id ? LICK_MODE_EDIT : LICK_MODE_VIEW,
        tags,
        tracks: lick.tracks.map(track => {
            return {
                ...track,
                // Calculate track urls to filesystem from their id
                url: 'file://' + getPathResolver()(track.id)
            };
        }),
        createdAt: lick.createdAt
    };
};

const mapSearchStateToProps = (search, filteredItems) => {
    const filters = search.filters;
    const input = search.input;
    return {
        filters,
        input,
        suggestions: getSuggestions(filteredItems, filters)
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
        artists = uniq(
            items.map(item => item.lick.artist).filter(item => item.length > 0)
        );
    }

    // Exclude tag suggestions which are already set in filters
    const isContainedInFilters = tag =>
        filters.find(
            filter => filter.type === TYPE_TAG && filter.value === tag
        ) !== undefined;

    const tags = uniq(
        []
        .concat(...items.map(item => item.lick.tags))
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
const mapDispatchToProps = dispatch => {
    return {
        lick: {
            enableCreateLickForm: () => dispatch(enableCreateLickForm()),
            cancelCreateLickForm: () => dispatch(cancelCreateLickForm()),
            createLick: lick => dispatch(createLick(lick)),
            saveLick: lick => dispatch(updateLick(lick)),
            deleteLick: id => dispatch(deleteLick(id)),
            changeLickMode: (id, mode) => dispatch(changeLickMode(id, mode))
        },
        search: {
            addFilter: filter => dispatch(addFilter(filter)),
            removeFilter: filter => dispatch(removeFilter(filter)),
            setInput: input => dispatch(setInput(input))
        }
    };
};

const mergeProps = (stateProps, dispatchProps) =>
    merge(stateProps, dispatchProps);

export { mapStateToProps, mapDispatchToProps, mergeProps };
