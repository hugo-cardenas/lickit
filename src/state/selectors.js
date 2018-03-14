import { createSelector } from 'reselect';
import { difference, groupBy, merge, uniq } from 'lodash';
import { getPathResolver } from '../track/pathResolver';
import { TYPE_ARTIST, TYPE_TAG } from '../search/filterTypes';
import { LICK_MODE_EDIT, LICK_MODE_VIEW } from './actions/lick/modes';

const getError = state => state.error;

const isLickCreationOpen = state => state.lick.isCreationOpen;
const getLicksById = state => state.lick.byId;
const getEditLickId = state => state.lick.editLickId;

const getFilters = state => state.search.filters;
const getFilteredArtist = createSelector(getFilters, filters => {
  const artistFilter = filters.find(filter => filter.type === 'Artist');
  return artistFilter ? artistFilter.value : undefined;
});
const getFilteredTags = createSelector(getFilters, filters =>
  filters.filter(filter => filter.type === 'Tag').map(filter => filter.value)
);

const getAllLicks = createSelector(
  getLicksById,
  getEditLickId,
  (licksById, editLickId) => {
    const licks = Object.keys(licksById).map(id =>
      buildLickObject(id, licksById[id], editLickId)
    );

    // Add artist index
    const groupedByArtist = Object.values(
      groupBy(licks, lick => lick.artist)
    ).map(licks => {
      licks.sort((a, b) => a.createdAt - b.createdAt);
      return licks.map((lick, index) => {
        return {
          ...lick,
          artistIndex: index + 1
        };
      });
    });

    const licksWithArtistIndex = [].concat(...groupedByArtist);
    licksWithArtistIndex.sort((a, b) => b.createdAt - a.createdAt);
    return licksWithArtistIndex;
  }
);

const buildLickObject = (id, lick, editLickId) => {
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

const getVisibleLicks = createSelector(
  getAllLicks,
  getFilteredArtist,
  getFilteredTags,
  (licks, artist, tags) =>
    licks.filter(
      lick =>
        (!artist || lick.artist === artist) &&
        difference(tags, lick.tags).length === 0
    )
);

const getLicks = createSelector(getVisibleLicks, licks => licks);

const getInput = state => state.search.input;

const getSuggestions = createSelector(
  getVisibleLicks,
  getFilters,
  (licks, filters) => {
    // console.log(licks, filters);
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
        licks.map(lick => lick.artist).filter(artist => artist.length > 0)
      );
    }

    // Exclude tag suggestions which are already set in filters
    const isContainedInFilters = tag =>
      filters.find(
        filter => filter.type === TYPE_TAG && filter.value === tag
      ) !== undefined;

    const tags = uniq(
      []
        .concat(...licks.map(lick => lick.tags))
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
  }
);

const getSearch = createSelector(
  getFilters,
  getInput,
  getSuggestions,
  (filters, input, suggestions) => ({
    filters,
    input,
    suggestions
  })
);

export { getError, isLickCreationOpen, getLicks, getSearch };
