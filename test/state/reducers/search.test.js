import searchReducer from 'src/state/reducers/search';
import { addFilter, removeFilter, setInput } from 'src/state/actions/search';
import { SEARCH_ADD_FILTER, SEARCH_REMOVE_FILTER, SEARCH_SET_INPUT } from 'src/state/actions/types';
import { TYPE_ARTIST, TYPE_TAG } from 'src/search/filterTypes';
import { assertErrorContainsString } from '../../helper/assertionHelper';

const filterData = [
    // Add to empty collection
    {
        originalFilters: [],
        newFilter: { type: TYPE_ARTIST, value: 'foo' },
        expectedFilters: [{ type: TYPE_ARTIST, value: 'foo' }]
    },
    // Add new tag filter
    {
        originalFilters: [
            { type: TYPE_ARTIST, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' }
        ],
        newFilter: { type: TYPE_TAG, value: 'baz' },
        expectedFilters: [
            { type: TYPE_ARTIST, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' },
            { type: TYPE_TAG, value: 'baz' }
        ]
    },
    // Add artist filter to collection with a different artist filter stored - ignored
    {
        originalFilters: [
            { type: TYPE_ARTIST, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' }
        ],
        newFilter: { type: TYPE_ARTIST, value: 'baz' },
        expectedFilters: [
            { type: TYPE_ARTIST, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' }
        ]
    },
    // Add tag filter to collection with the same tag filter stored - ignored
    {
        originalFilters: [
            { type: TYPE_ARTIST, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' }
        ],
        newFilter: { type: TYPE_TAG, value: 'bar' },
        expectedFilters: [
            { type: TYPE_ARTIST, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' }
        ]
    }
];

filterData.forEach((item, i) => {
    it('add filter #' + i, () => {
        const { originalFilters, newFilter, expectedFilters } = item;

        const state = createState(originalFilters);
        const newState = searchReducer(state, addFilter(newFilter));
        const expectedState = createState(expectedFilters);

        expect(newState).toEqual(expectedState);
    });
});

const invalidFilters = [
    {},
    { type: TYPE_ARTIST }, // Missing value
    { value: 'foo' }, // Missing type
    { type: 'bar', value: 'foo' }, // Invalid type
    { type: TYPE_ARTIST, value: {} }, // Invalid value
    { type: TYPE_ARTIST, value: '' } // Invalid value
];

invalidFilters.forEach((filter, i) => {
    it('add filter, invalid input #' + i, () => {
        const state = createState([
            { type: TYPE_ARTIST, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' }
        ]);

        try {
            searchReducer(state, addFilter(filter));
            throw new Error();
        } catch (error) {
            assertErrorContainsString(error, 'Unable to reduce ' + SEARCH_ADD_FILTER);
            assertErrorContainsString(error, JSON.stringify(filter));
            assertErrorContainsString(error, 'Invalid filter');
        }
    });
});

it('remove filter', () => {
    const state = createState([
        { type: TYPE_ARTIST, value: 'foo' },
        { type: TYPE_TAG, value: 'bar' }
    ]);
    const newState = searchReducer(state, removeFilter({ type: TYPE_ARTIST, value: 'foo' }));
    const expectedState = createState([
        { type: TYPE_TAG, value: 'bar' }
    ]);

    expect(newState).toEqual(expectedState);
});

it('remove filter, not found', () => {
    const state = createState([
        { type: TYPE_ARTIST, value: 'foo' },
        { type: TYPE_TAG, value: 'bar' }
    ]);
    const newState = searchReducer(state, removeFilter({ type: TYPE_ARTIST, value: 'baz' }));
    const expectedState = createState([
        { type: TYPE_ARTIST, value: 'foo' },
        { type: TYPE_TAG, value: 'bar' }
    ]);

    expect(newState).toEqual(expectedState);
});

it('remove filter, empty filter collection', () => {
    const state = createState([]);
    const newState = searchReducer(state, removeFilter({ type: TYPE_ARTIST, value: 'baz' }));
    const expectedState = createState([]);

    expect(newState).toEqual(expectedState);
});

invalidFilters.forEach((filter, i) => {
    it('remove filter, invalid input #' + i, () => {
        const state = createState([
            { type: TYPE_ARTIST, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' }
        ]);

        try {
            searchReducer(state, removeFilter(filter));
            throw new Error();
        } catch (error) {
            assertErrorContainsString(error, 'Unable to reduce ' + SEARCH_REMOVE_FILTER);
            assertErrorContainsString(error, JSON.stringify(filter));
            assertErrorContainsString(error, 'Invalid filter');
        }
    });
});

it('set input', () => {
    const state = createState([{ type: TYPE_ARTIST, value: 'foo' }], '');
    const newState = searchReducer(state, setInput('foobar'));
    const expectedState = createState([{ type: TYPE_ARTIST, value: 'foo' }], 'foobar');

    expect(newState).toEqual(expectedState);
});

const invalidInputs = [
    null,
    50,
    false,
    {},
    []
];

invalidInputs.forEach((input, i) => {
    it('set input, invalid value #' + i, () => {
        const state = createState([{ type: TYPE_ARTIST, value: 'foo' }], '');
        
        try {
            searchReducer(state, setInput(input));
            throw new Error();
        } catch (error) {
            assertErrorContainsString(error, 'Unable to reduce ' + SEARCH_SET_INPUT);
            assertErrorContainsString(error, JSON.stringify(input));
            assertErrorContainsString(error, 'Invalid input');
        }
    });
});

const createState = (filters, input = '') => {
    return Object.freeze({
        filters,
        input
    });
};
