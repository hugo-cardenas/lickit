import {
    createLick,
    updateLick,
    deleteLick,
    changeLickMode
} from 'src/state/actions/lick';
import { addFilter, removeFilter, setInput } from 'src/state/actions/search';
import { TYPE_ARTIST, TYPE_TAG } from 'src/search/filterTypes';
import {
    getLicks,
    getSearch
} from 'src/state/selectors';

// Mock the call electron.app.getPath('userData') - TODO extract to common
jest.mock('electron', () => {
    return {
        app: {
            getPath: name => {
                if (name === 'userData') {
                    return '/tmp/foo';
                }
                return '';
            }
        }
    };
});

it('map state to props, map error', () => {
    const error = new Error('foo');
    const state = createState({ error });

    const props = mapStateToProps(state);
    expect(props.error).toEqual(error);
});

it('map state to props, map other lick state', () => {
    const state = createState();
    const props = mapStateToProps(state);
    expect(props.lick.isCreationOpen).toBe(false);
});

it('get licks', () => {
    const state = createStateWithLicks({
        c42: {
            artist: 'Charlie Foo',
            description: 'Foo bar 42',
            tracks: [{ id: 'abc10' }, { id: 'abc20' }],
            tags: ['foo', 'bar'],
            createdAt: 12500
        }
    });
    state.lick.editLickId = 'c42';

    const expectedLicks = [
        {
            id: 'c42',
            artist: 'Charlie Foo',
            artistIndex: 1,
            description: 'Foo bar 42',
            mode: 'edit',
            tracks: [
                { id: 'abc10', url: 'file:///tmp/foo/tracks/abc10.wav' },
                { id: 'abc20', url: 'file:///tmp/foo/tracks/abc20.wav' }
            ],
            tags: ['bar', 'foo'], // Tags should be sorted alphabetically
            createdAt: 12500
        }
    ];

    expect(getLicks(state)).toEqual(expectedLicks);
});

it('get licks, set artist indexes and sort by createdAt', () => {
    const state = createStateWithLicks({
        c42: {
            artist: 'Charlie Foo',
            description: 'Foo bar 42',
            tracks: [{ id: 'abc10' }, { id: 'abc20' }],
            tags: ['foo', 'bar'],
            createdAt: 12500
        },
        c44: {
            artist: 'Charlie Foo',
            description: 'Foo bar 42',
            tracks: [{ id: 'abc10' }, { id: 'abc20' }],
            tags: ['foo', 'bar'],
            createdAt: 12600
        },
        c46: {
            artist: 'Charlie Bar',
            description: 'Foo bar 42',
            tracks: [{ id: 'abc10' }, { id: 'abc20' }],
            tags: ['foo', 'bar'],
            createdAt: 12700
        }
    });

    const licks = getLicks(state);
    expect(licks[0].id).toBe('c46');
    expect(licks[0].artistIndex).toEqual(1);

    expect(licks[1].id).toBe('c44');
    expect(licks[1].artistIndex).toEqual(2);

    expect(licks[2].id).toBe('c42');
    expect(licks[2].artistIndex).toEqual(1);
});

const licksToBeFiltered = {
    c42: createLickObject({
        artist: 'Charlie Foo',
        description: 'Foo bar 42',
        tags: ['foo', 'bar']
    }),
    c44: createLickObject({
        artist: 'Charlie Foo',
        description: 'Foo bar 42',
        tags: ['baz', 'foobar']
    }),
    c46: createLickObject({
        artist: 'Django Bar',
        description: 'Foo bar 42',
        tags: ['foo']
    }),
    c48: createLickObject({
        artist: 'Django Bar',
        description: 'Foo bar 42',
        tags: ['bar']
    }),
    c50: createLickObject({
        artist: 'Stephane Baz',
        description: 'Foo bar 42',
        tags: ['foobar', 'foo', 'bar']
    })
};

const expectedFilteredIds = [
    // No filters
    {
        filters: [],
        expectedIds: ['c42', 'c44', 'c46', 'c48', 'c50']
    },
    // Filter by artist
    {
        filters: [{ type: TYPE_ARTIST, value: 'Charlie Foo' }],
        expectedIds: ['c42', 'c44']
    },
    // Filter by tag
    {
        filters: [{ type: TYPE_TAG, value: 'foo' }],
        expectedIds: ['c42', 'c46', 'c50']
    },
    // Filter by multiple tags
    {
        filters: [
            { type: TYPE_TAG, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' }
        ],
        expectedIds: ['c42', 'c50']
    },
    // Filter by artist and tag
    {
        filters: [
            { type: TYPE_ARTIST, value: 'Django Bar' },
            { type: TYPE_TAG, value: 'bar' }
        ],
        expectedIds: ['c48']
    },
    // Filter by artist and multiple tags
    {
        filters: [
            { type: TYPE_ARTIST, value: 'Charlie Foo' },
            { type: TYPE_TAG, value: 'foo' },
            { type: TYPE_TAG, value: 'bar' }
        ],
        expectedIds: ['c42']
    },
    // Filter not matching anything
    {
        filters: [{ type: TYPE_ARTIST, value: 'Non matching filter' }],
        expectedIds: []
    }
];

expectedFilteredIds.forEach((entry, i) => {
    it('get licks, apply filters #' + i, () => {
        const { filters, expectedIds } = entry;

        const state = createStateWithLicks(licksToBeFiltered);
        state.search.filters = filters;

        const licks = getLicks(state);
        const ids = licks.map(lick => lick.id);
        expect(ids).toEqual(expectedIds);
    });
});

const stateWithSearch = createState({
    lick: createLickState({
        byId: {
            10: createLickObject({ artist: 'Django Bar', tags: ['Baz'] }),
            20: createLickObject({
                artist: 'charlie Foo',
                tags: ['foo', 'bar']
            }),
            30: createLickObject({
                artist: 'Django Bar',
                tags: ['foo', 'foobar']
            }),
            40: createLickObject({ artist: '', tags: [] }) // Empty artist should not appear as a suggestion
        }
    }),
    search: {
        filters: [{ type: 'foo', value: 123 }, { type: 'bar', value: 456 }]
    }
});

const expectedSuggestions = [
    // No filters applied, just sort alphabetically within type (input does not affect)
    {
        filters: [],
        input: 'foobar',
        suggestions: [
            {
                title: TYPE_ARTIST,
                suggestions: ['charlie Foo', 'Django Bar']
            },
            {
                title: TYPE_TAG,
                suggestions: ['bar', 'Baz', 'foo', 'foobar']
            }
        ]
    },
    // Artist filter should prevent any other artist suggestion
    // Also, if a filter is applied, exclude suggestions not found in the shown licks
    {
        filters: [
            {
                type: TYPE_ARTIST,
                value: 'Django Bar'
            }
        ],
        input: '',
        suggestions: [
            {
                title: TYPE_TAG,
                suggestions: ['Baz', 'foo', 'foobar']
            }
        ]
    },
    // Tag filter should prevent the same tag suggestion
    // Also, if a filter is applied, exclude suggestions not found in the shown licks
    {
        filters: [
            {
                type: TYPE_TAG,
                value: 'foo'
            }
        ],
        input: '',
        suggestions: [
            {
                title: TYPE_ARTIST,
                suggestions: ['charlie Foo', 'Django Bar']
            },
            {
                title: TYPE_TAG,
                suggestions: ['bar', 'foobar']
            }
        ]
    }
];

it('foobar', () => {

    const state = stateWithSearch;
    state.search.filters = expectedSuggestions[0].filters;
    state.search.input = expectedSuggestions[0].input;

    let search = getSearch(state);
    expect(search.filters).toEqual(state.search.filters);
    expect(search.input).toEqual(expectedSuggestions[0].input);
    // Suggestions are calculated from stored items
    expect(search.suggestions).toEqual(expectedSuggestions[0].suggestions);

    // console.log(search);
    // console.log(getSearch(state));





    state.search.filters = expectedSuggestions[1].filters;
    state.search.input = expectedSuggestions[1].input;


    console.log(JSON.stringify(state, null, 2));
    search = getSearch(state);
    expect(search.filters).toEqual(state.search.filters);
    expect(search.input).toEqual(expectedSuggestions[1].input);
    // Suggestions are calculated from stored items
    expect(search.suggestions).toEqual(expectedSuggestions[1].suggestions);

    // console.log(search);
    // console.log(getSearch(state));






    state.search.filters = expectedSuggestions[2].filters;
    state.search.input = expectedSuggestions[2].input;

    search = getSearch(state);
    expect(search.filters).toEqual(state.search.filters);
    expect(search.input).toEqual(expectedSuggestions[2].input);
    // Suggestions are calculated from stored items
    expect(search.suggestions).toEqual(expectedSuggestions[2].suggestions);

    // console.log(search);
    // console.log(getSearch(state));




    // const state = stateWithSearch;
    // state.search.filters = expectedSuggestions[0].filters;
    // state.search.input = expectedSuggestions[0].input;

    // console.log(JSON.stringify(getSearch(state), null, 2));

    // state.search.filters = expectedSuggestions[1].filters;
    // state.search.input = expectedSuggestions[1].input;

    // console.log(JSON.stringify(getSearch(state), null, 2));
});

expectedSuggestions.forEach((entry, i) => {
    it('get search #' + i, () => {
        const { filters, input, suggestions } = entry;

        const state = stateWithSearch;
        state.search.filters = filters;
        state.search.input = input;

        const search = getSearch(state);
        expect(search.filters).toEqual(state.search.filters);
        expect(search.input).toEqual(input);
        // Suggestions are calculated from stored items
        expect(search.suggestions).toEqual(suggestions);

        console.log(search);
        console.log(getSearch(state));
    });
});

it('map dispatch to props - create lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    const lick = { foo: 'bar' };
    await props.lick.createLick(lick);

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(
        createLick(dispatch).toString()
    );
});

it('map dispatch to props - update lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    const lick = { foo: 'bar' };
    await props.lick.saveLick(lick);

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(
        updateLick(dispatch).toString()
    );
});

it('map dispatch to props - delete lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    await props.lick.deleteLick('a42');

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(
        deleteLick(dispatch).toString()
    );
});

it('map dispatch to props - change lick mode', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.lick.changeLickMode('a42', 'modeFoo');
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(changeLickMode('a42', 'modeFoo'));
});

it('map dispatch to props - add filter', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.search.addFilter({ foo: 'bar' });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(addFilter({ foo: 'bar' }));
});

it('map dispatch to props - remove filter', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.search.removeFilter({ foo: 'bar' });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(removeFilter({ foo: 'bar' }));
});

it('map dispatch to props - set input', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.search.setInput('foo');
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(setInput('foo'));
});

it('merge props', () => {
    const stateProps = {
        error: 'foo',
        lick: {
            items: ['foo', 'bar']
        },
        search: {
            filters: ['bar', 'baz']
        }
    };

    const func1 = () => 42;
    const func2 = () => 44;
    const func3 = () => 46;
    const func4 = () => 48;

    const dispatchProps = {
        lick: {
            func1,
            func2
        },
        search: {
            func3,
            func4
        }
    };

    const expectedProps = {
        error: 'foo',
        lick: {
            items: ['foo', 'bar'],
            func1,
            func2
        },
        search: {
            filters: ['bar', 'baz'],
            func3,
            func4
        }
    };

    expect(mergeProps(stateProps, dispatchProps)).toEqual(expectedProps);
});

const createStateWithLicks = licks => {
    return createState({
        lick: {
            isCreationOpen: false,
            editLickId: null,
            byId: licks
        }
    });
};

function createState(state = {}) {
    return {
        error: null,
        lick: {
            isCreationOpen: false,
            editLickId: null,
            byId: {}
        },
        search: {
            filters: [],
            input: ''
        },
        ...state
    };
}

function createLickState(state) {
    return {
        isCreationOpen: false,
        editLickId: null,
        byId: {},
        ...state
    };
}

function createLickObject(lick) {
    return {
        artist: '',
        description: '',
        tracks: [],
        tags: [],
        ...lick
    };
}
