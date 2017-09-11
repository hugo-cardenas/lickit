import { mapStateToProps, mapDispatchToProps, mergeProps } from 'src/map';
import { updateLick, deleteLick, changeLickMode } from 'src/state/actions/lick';
import { addFilter, removeFilter, setInput } from 'src/state/actions/search';
import { LICK_CREATE } from 'src/state/actions/types';
import { TYPE_ARTIST, TYPE_TAG } from 'src/search/filterTypes';

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

it('map state to props, map items', () => {
    const state = createStateWithItems([
        {
            mode: 'edit',
            lick: {
                id: 'c42',
                artist: 'Charlie Foo',
                description: 'Foo bar 42',
                tracks: [{ id: 'abc10' }, { id: 'abc20' }],
                tags: ['foo', 'bar'],
                createdAt: 12500
            }
        }
    ]);

    const expectedItems = [
        {
            mode: 'edit',
            lick: {
                id: 'c42',
                artist: 'Charlie Foo',
                description: 'Foo bar 42',
                tracks: [
                    { id: 'abc10', url: 'file:///tmp/foo/tracks/abc10.wav' },
                    { id: 'abc20', url: 'file:///tmp/foo/tracks/abc20.wav' }
                ],
                tags: ['bar', 'foo'] // Tags should be sorted alphabetically
            }
        }
    ];

    const props = mapStateToProps(state);
    expect(props.lick.items).toEqual(expectedItems);
});

const itemsToBeFiltered = [
    createItem({ id: 'c42', artist: 'Charlie Foo', description: 'Foo bar 42', tags: ['foo', 'bar'] }),
    createItem({ id: 'c44', artist: 'Charlie Foo', description: 'Foo bar 42', tags: ['baz', 'foobar'] }),
    createItem({ id: 'c46', artist: 'Django Bar', description: 'Foo bar 42', tags: ['foo'] }),
    createItem({ id: 'c48', artist: 'Django Bar', description: 'Foo bar 42', tags: ['bar'] }),
    createItem({ id: 'c50', artist: 'Stephane Baz', description: 'Foo bar 42', tags: ['foobar', 'foo', 'bar'] }),
];

const expectedFilteredIds = [
    // No filters
    {
        filters: [],
        expectedIds: ['c42', 'c44', 'c46', 'c48', 'c50']
    },
    // Filter by artist
    {
        filters: [
            {type: TYPE_ARTIST, value: 'Charlie Foo'}
        ],
        expectedIds: ['c42', 'c44']
    },
    // Filter by tag
    {
        filters: [
            {type: TYPE_TAG, value: 'foo'}
        ],
        expectedIds: ['c42', 'c46', 'c50']
    },
    // Filter by multiple tags
    {
        filters: [
            {type: TYPE_TAG, value: 'foo'},
            {type: TYPE_TAG, value: 'bar'}
        ],
        expectedIds: ['c42', 'c50']
    },
    // Filter by artist and tag
    {
        filters: [
            {type: TYPE_ARTIST, value: 'Django Bar'},
            {type: TYPE_TAG, value: 'bar'}
        ],
        expectedIds: ['c48']
    },
    // Filter by artist and multiple tags
    {
        filters: [
            {type: TYPE_ARTIST, value: 'Charlie Foo'},
            {type: TYPE_TAG, value: 'foo'},
            {type: TYPE_TAG, value: 'bar'}
        ],
        expectedIds: ['c42']
    },
    // Filter not matching anything
    {
        filters: [
            {type: TYPE_ARTIST, value: 'Non matching filter'}
        ],
        expectedIds: []
    },
];

expectedFilteredIds.forEach((entry, i) => {
    it('map state to props, map items, apply filters #' + i, () => {
        const { filters, expectedIds } = entry;
        
        const state = createStateWithItems(itemsToBeFiltered);
        state.search.filters = filters;
        
        const props = mapStateToProps(state);
        const ids = props.lick.items.map(item => item.lick.id);
        expect(ids).toEqual(expectedIds);
    });
});

const stateWithSearch = createState({
    lick: {
        items: [
            createItem({ artist: 'Django Bar', tags: ['bar', 'Baz'] }),
            createItem({ artist: 'charlie Foo', tags: ['foo', 'bar'] }),
            createItem({ artist: 'Django Bar', tags: ['foo', 'foobar'] }),
            createItem({ artist: '', tags: [] }), // Empty artist should not appear as a suggestion
        ]
    },
    search: {
        filters: [
            { type: 'foo', value: 123 },
            { type: 'bar', value: 456 }
        ]
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
    {
        filters: [{
            type: TYPE_ARTIST,
            value: 'foo'
        }],
        input: '',
        suggestions: [{
            title: TYPE_TAG,
            suggestions: ['bar', 'Baz', 'foo', 'foobar']
        }]
    },
    // Tag filter should prevent the same tag suggestion
    {
        filters: [{
            type: TYPE_TAG,
            value: 'foo'
        }],
        input: '',
        suggestions: [
            {
                title: TYPE_ARTIST,
                suggestions: ['charlie Foo', 'Django Bar']
            },
            {
                title: TYPE_TAG,
                suggestions: ['bar', 'Baz', 'foobar']
            }
        ]
    }
];

expectedSuggestions.forEach((entry, i) => {
    it('map state to props, map search #' + i, () => {
        const { filters, input, suggestions } = entry;

        const state = stateWithSearch;
        state.search.filters = filters;
        state.search.input = input;

        const search = mapStateToProps(state).search;
        expect(search.filters).toEqual(state.search.filters);
        expect(search.input).toEqual(input);
        // Suggestions are calculated from stored items
        expect(search.suggestions).toEqual(suggestions);
    });
});

it('map dispatch to props - create lick', () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.lick.createLick();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: LICK_CREATE });
});

it('map dispatch to props - update lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    const lick = { foo: 'bar' };
    await (props.lick.saveLick(lick));

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(updateLick(dispatch).toString());
});

it('map dispatch to props - delete lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    await (props.lick.deleteLick('a42'));

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(deleteLick(dispatch).toString());
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

const createStateWithItems = items => {
    return createState({
        lick: {
            items
        }
    });
};

function createState(state) {
    return {
        error: null,
        lick: {
            items: []
        },
        search: {
            filters: [],
            input: ''
        },
        ...state
    };
}

function createItem(lick) {
    return {
        mode: 'view',
        lick: {
            id: 'c862',
            artist: '',
            description: '',
            tracks: [],
            tags: [],
            ...lick
        }
    };
}
