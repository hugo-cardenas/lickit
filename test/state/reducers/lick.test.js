import _ from 'lodash';
import { assertErrorContainsString } from '../../helper/assertionHelper';
import lickReducer from 'src/state/reducers/lick';
import {
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE,
    LICK_CHANGE_MODE
} from 'src/state/actions/types';
import { LICK_MODE_EDIT, LICK_MODE_VIEW } from 'src/state/actions/lick/modes';
import {
    openCreation,
    cancelCreation,
    changeLickMode
} from 'src/state/actions/lick';

jest.mock('electron', () => {
    return {
        app: { getPath: () => 'foobar' }
    };
});

it('define default state', () => {
    const expectedState = createState();

    expect(lickReducer(undefined, { type: 'invalid action' })).toEqual(
        expectedState
    );
});

it('reduce unknown action', () => {
    const state = createState();
    const expectedState = createState();

    expect(lickReducer(state, { type: 'invalid action' })).toEqual(
        expectedState
    );
});

it('open creation', () => {
    const state = createState();
    const expectedState = createState({ isCreationOpen: true });

    expect(lickReducer(state, openCreation())).toEqual(expectedState);
});

it('cancel creation', () => {
    const state = createState({ isCreationOpen: true });
    const expectedState = createState({ isCreationOpen: false });

    expect(lickReducer(state, cancelCreation())).toEqual(expectedState);
});

const validLicks = [
    {
        id: 'c20',
        artist: 'barbar',
        description: 'bar baz',
        tracks: [{ id: 'abc200' }],
        tags: ['foo', 'baz']
    },
    {
        id: 'c20',
        artist: '',
        description: 'bar baz',
        tracks: [{ id: 'abc200' }],
        tags: ['foo', 'baz']
    },
    {
        id: 'c20',
        artist: 'barbar',
        description: '',
        tracks: [{ id: 'abc200' }],
        tags: ['foo', 'baz']
    },
    {
        id: 'c20',
        artist: 'barbar',
        description: 'bar baz',
        tracks: [],
        tags: ['foo', 'baz']
    },
    {
        id: 'c20',
        artist: 'barbar',
        description: 'bar baz',
        tracks: [{ id: 'abc200' }],
        tags: []
    },
    {
        id: 'c20',
        artist: 'barbar',
        description: 'bar baz',
        tracks: [{ id: 'abc200' }],
        tags: [],
        foo: 'bar' // Ignores unknown properties
    }
];

validLicks.forEach((lick, i) => {
    it('create lick, success #' + i, () => {
        const initialTimestamp = Date.now();

        const state = createState({
            isCreationOpen: true,
            byId: {
                c10: { artist: 'foo' }
            }
        });
        const newLick = _.omit(lick, ['id']);

        const newState = lickReducer(state, {
            type: LICK_CREATE,
            lick: newLick
        });

        const { isCreationOpen, byId: licks } = newState;

        expect(isCreationOpen).toBe(false);

        const ids = Object.keys(licks);
        expect(ids).toHaveLength(2);

        expect(licks['c10']).toEqual({ artist: 'foo' });
        delete licks['c10'];

        // We don't know in advance the value of the new generated id
        const newId = Object.keys(licks)[0];
        expect(typeof newId).toBe('string');
        expect(newId.length).toBeGreaterThan(10);
        expect(newId.length).toBeLessThan(30);

        const createdLick = licks[newId];
        expect(createdLick.id).toBe(undefined);
        expect(createdLick.artist).toBe(createdLick.artist);
        expect(createdLick.description).toBe(createdLick.description);
        expect(createdLick.tracks).toEqual(createdLick.tracks);
        expect(createdLick.tags).toEqual(createdLick.tags);
        expect(createdLick.createdAt).toBeGreaterThanOrEqual(initialTimestamp);
        expect(createdLick.createdAt).toBeLessThan(Date.now() + 1);
        expect(createdLick.foo).toBe(undefined);
    });
});

validLicks.forEach((lick, i) => {
    it('update lick, success #' + i, () => {
        const state = createState({
            byId: {
                c10: { artist: 'bar' },
                c20: {
                    artist: 'foofoo',
                    description: 'foo',
                    tracks: [{ id: 'abc200' }, { id: 'abc200' }],
                    tags: ['foo', 'bar'],
                    createdAt: 12500
                },
                c30: { artist: 'baz' }
            },
            editLickId: 'c20'
        });

        const expectedState = createState({
            byId: {
                c10: { artist: 'bar' },
                c20: {
                    ..._.pick(lick, [
                        'artist',
                        'description',
                        'tracks',
                        'tags'
                    ]),
                    createdAt: 12500
                },
                c30: { artist: 'baz' }
            },
            editLickId: null
        });

        expect(lickReducer(state, { type: LICK_UPDATE, lick })).toEqual(
            expectedState
        );
    });
});

const validLick = {
    id: 'c20',
    artist: 'foofoo',
    description: 'bar baz',
    tracks: [{ id: 'abc200' }],
    tags: ['foo', 'baz']
};

const invalidLicks = [
    // Missing fields
    [_.pick(validLick, ['id', 'description', 'tracks', 'tags']), ['artist']],
    [_.pick(validLick, ['id', 'artist', 'tracks', 'tags']), ['description']],
    [_.pick(validLick, ['id', 'artist', 'description', 'tags']), ['tracks']],
    [_.pick(validLick, ['id', 'artist', 'description', 'tracks']), ['tags']],
    [_.pick(validLick, ['id', 'artist', 'tracks']), ['description', 'tags']],

    // Invalid values
    [Object.assign({}, validLick, { artist: 42 }), ['artist']],

    [Object.assign({}, validLick, { description: 42 }), ['description']],

    [Object.assign({}, validLick, { tracks: 42 }), ['tracks']],
    [
        Object.assign({}, validLick, { tracks: [{ id: 'abc200' }, 999] }),
        ['tracks']
    ],
    [
        Object.assign({}, validLick, {
            tracks: [{ id: 'abc200' }, { id: true }]
        }),
        ['tracks']
    ],

    [Object.assign({}, validLick, { tags: 42 }), ['tags']],
    [Object.assign({}, validLick, { tags: ['foo', 42] }), ['tags']]
];

invalidLicks.forEach((entry, i) => {
    it('create lick, invalid data #' + i, () => {
        const lick = _.omit(entry[0], ['id']);
        const invalidProperties = entry[1];
        const state = createState();

        try {
            lickReducer(state, { type: LICK_CREATE, lick });
            throw new Error();
        } catch (error) {
            assertErrorContainsString(error, 'Unable to reduce ' + LICK_CREATE);
            assertErrorContainsString(error, JSON.stringify(lick));
            invalidProperties.forEach(property => {
                assertErrorContainsString(error, ` "${property}" `); // As part of the error message, not the object JSON
            });
        }
    });
});

const invalidLicksToUpdate = [
    ...invalidLicks,

    // Missing fields
    [_.pick(validLick, ['artist', 'description', 'tracks', 'tags']), ['id']],

    // Invalid values
    [Object.assign({}, validLick, { id: true }), ['id']],
    [Object.assign({}, validLick, { id: -1 }), ['id']]
];

invalidLicksToUpdate.forEach((entry, i) => {
    it('update lick, invalid data #' + i, () => {
        const [lick, invalidProperties] = entry;
        const state = createState({
            byId: {
                c10: { artist: 'foo' },
                c20: { artist: 'bar' },
                c30: { artist: 'baz' }
            }
        });

        try {
            lickReducer(state, { type: LICK_UPDATE, lick });
            throw new Error();
        } catch (error) {
            assertErrorContainsString(error, 'Unable to reduce ' + LICK_UPDATE);
            assertErrorContainsString(error, JSON.stringify(lick));
            invalidProperties.forEach(property => {
                assertErrorContainsString(error, ` "${property}" `); // As part of the error message, not the object JSON
            });
        }
    });
});

it('update lick, id not found', () => {
    const state = createState({
        byId: {
            c10: { artist: 'foo' },
            c30: { artist: 'baz' }
        }
    });

    const lick = {
        id: 'c20',
        artist: 'foofoo',
        description: 'bar baz',
        tracks: [{ id: 'abc200' }],
        tags: ['foo', 'baz']
    };

    try {
        lickReducer(state, { type: LICK_UPDATE, lick });
        throw new Error();
    } catch (error) {
        assertErrorContainsString(error, 'Unable to reduce ' + LICK_UPDATE);
        assertErrorContainsString(error, JSON.stringify(lick));
        assertErrorContainsString(error, 'id c20 not found');
    }
});

it('delete lick, success', () => {
    const state = createState({
        byId: {
            c10: { artist: 'foo' },
            c20: { artist: 'bar' },
            c30: { artist: 'baz' }
        }
    });

    const expectedState = createState({
        byId: {
            c10: { artist: 'foo' },
            c30: { artist: 'baz' }
        }
    });

    expect(lickReducer(state, { type: LICK_DELETE, id: 'c20' })).toEqual(
        expectedState
    );
});

it('delete lick, id not found', () => {
    const state = createState({
        byId: {
            c10: { artist: 'foo' },
            c20: { artist: 'bar' },
            c30: { artist: 'baz' }
        }
    });

    try {
        lickReducer(state, { type: LICK_DELETE, id: 'c999' });
        throw new Error();
    } catch (error) {
        assertErrorContainsString(error, 'Unable to reduce ' + LICK_DELETE);
        assertErrorContainsString(error, 'id c999 not found');
    }
});

it('change lick mode, set edit', () => {
    const state = createState({
        editLickId: null
    });

    const expectedState = createState({
        editLickId: 'c10'
    });

    const newState = lickReducer(state, changeLickMode('c10', LICK_MODE_EDIT));
    expect(newState).toEqual(expectedState);
});

it('change lick mode, set view', () => {
    const state = createState({
        editLickId: 'c10'
    });

    const expectedState = createState({
        editLickId: null
    });

    const newState = lickReducer(state, changeLickMode('c10', LICK_MODE_VIEW));
    expect(newState).toEqual(expectedState);
});

it('change lick mode, invalid mode', () => {
    const validModes = [LICK_MODE_EDIT, LICK_MODE_VIEW];
    const mode = 'modeFooInvalid';
    const state = createState({
        editLickId: 'c10'
    });
    try {
        lickReducer(state, changeLickMode('c10', mode));
        throw new Error();
    } catch (error) {
        assertErrorContainsString(
            error,
            'Unable to reduce ' + LICK_CHANGE_MODE
        );
        assertErrorContainsString(error, 'Invalid mode');
        assertErrorContainsString(error, mode);
        assertErrorContainsString(error, validModes.join(', '));
    }
});

const createState = properties => {
    return Object.freeze({
        editLickId: null,
        isCreationOpen: false,
        byId: {},
        ...properties
    });
};
