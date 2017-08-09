import _ from 'lodash';
import { assertErrorContainsString } from '../../helper/assertionHelper';
import lickReducer from 'src/state/reducers/lick';
import {
    LICK_CREATE,
    LICK_UPDATE,
    LICK_DELETE,
    LICK_CHANGE_MODE
} from 'src/state/actions/types';
import {
    LICK_MODE_EDIT,
    LICK_MODE_VIEW
} from 'src/state/actions/lick/modes';
import { changeLickMode } from 'src/state/actions/lick';

jest.mock('electron', () => {
    return {
        app: { getPath: () => 'foobar' }
    };
});

it('define default state', () => {
    const expectedState = [];

    expect(lickReducer(undefined, { type: 'invalid action' })).toEqual(expectedState);
});

it('reduce unknown action', () => {
    const state = Object.freeze([]);
    const expectedState = [];

    expect(lickReducer(state, { type: 'invalid action' })).toEqual(expectedState);
});

it('create lick', () => {
    const initialTimestamp = Date.now();

    const state = Object.freeze([{ lick: { id: 'c10' } }]);
    const newState = lickReducer(state, { type: LICK_CREATE });
    expect(newState).toHaveLength(2);

    expect(newState[0].mode).toBe('edit');
    expect(typeof newState[0].lick.id).toBe('string');
    expect(newState[0].lick.id.length).toBeGreaterThan(10);
    expect(newState[0].lick.id.length).toBeLessThan(30);
    expect(newState[0].lick.id).not.toBe('10abc');
    expect(newState[0].lick.description).toBe('');
    expect(newState[0].lick.tracks).toEqual([]);
    expect(newState[0].lick.tags).toEqual([]);
    expect(newState[0].lick.createdAt).toBeGreaterThanOrEqual(initialTimestamp);
    expect(newState[0].lick.createdAt).toBeLessThan(Date.now());

    expect(newState[1]).toEqual({ lick: { id: 'c10' } });
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
    }
];

validLicks.forEach((lick, i) => {
    it('update lick, success #' + i, () => {
        const state = Object.freeze([
            { lick: { id: 'c10' } },
            {
                lick: {
                    id: 'c20',
                    artist: 'foofoo',
                    description: 'foo',
                    tracks: [{ id: 'abc200' }, { id: 'abc200' }],
                    tags: ['foo', 'bar'],
                    createdAt: 12500
                },
                mode: 'edit'
            },
            { lick: { id: 'c30' } }
        ]);

        const expectedState = [
            { lick: { id: 'c10' } },
            {
                lick: {
                    ...lick,
                    createdAt: 12500
                },
                mode: 'view'
            },
            { lick: { id: 'c30' } }
        ];

        expect(lickReducer(state, { type: LICK_UPDATE, lick })).toEqual(expectedState);
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
    [_.pick(validLick, ['artist', 'description', 'tracks', 'tags']), ['id']],
    [_.pick(validLick, ['id', 'description', 'tracks', 'tags']), ['id']],
    [_.pick(validLick, ['id', 'artist', 'tracks', 'tags']), ['description']],
    [_.pick(validLick, ['id', 'artist', 'description', 'tags']), ['tracks']],
    [_.pick(validLick, ['id', 'artist', 'description', 'tracks']), ['tags']],
    [_.pick(validLick, ['id', 'artist', 'tracks']), ['description', 'tags']],

    // Invalid values
    [Object.assign({}, validLick, { id: true }), ['id']],
    [Object.assign({}, validLick, { id: -1 }), ['id']],

    [Object.assign({}, validLick, { artist: 42 }), ['artist']],

    [Object.assign({}, validLick, { description: 42 }), ['description']],

    [Object.assign({}, validLick, { tracks: 42 }), ['tracks']],
    [Object.assign({}, validLick, { tracks: [{ id: 'abc200' }, 999] }), ['tracks']],
    [Object.assign({}, validLick, { tracks: [{ id: 'abc200' }, { id: true }] }), ['tracks']],

    [Object.assign({}, validLick, { tags: 42 }), ['tags']],
    [Object.assign({}, validLick, { tags: ['foo', 42] }), ['tags']],

    // Extra fields not allowed
    [Object.assign({}, validLick, { createdAt: 12500 }), ['createdAt']],
    [Object.assign({}, validLick, { foobar: 123 }), ['foobar']],
];

invalidLicks.forEach((entry, i) => {
    it('update lick, invalid data #' + i, () => {
        const [lick, invalidProperties] = entry;
        const state = Object.freeze([
            { lick: { id: 'c10' } },
            { lick: { id: 'c20' } },
            { lick: { id: 'c30' } }
        ]);

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
    const state = Object.freeze([
        { lick: { id: 'c10' } },
        { lick: { id: 'c30' } }
    ]);

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
        assertErrorContainsString(error, 'Id c20 not found');
    }
});

it('delete lick, success', () => {
    const state = Object.freeze([
        { lick: { id: 'c10' } },
        { lick: { id: 'c20' } },
        { lick: { id: 'c30' } }
    ]);

    const expectedState = Object.freeze([
        { lick: { id: 'c10' } },
        { lick: { id: 'c30' } }
    ]);

    expect(lickReducer(state, { type: LICK_DELETE, id: 'c20' })).toEqual(expectedState);
});

it('delete lick, id not found', () => {
    const state = Object.freeze([
        { lick: { id: 'c10' } },
        { lick: { id: 'c20' } },
        { lick: { id: 'c30' } }
    ]);

    try {
        lickReducer(state, { type: LICK_DELETE, id: 'c999' });
        throw new Error();
    } catch (error) {
        assertErrorContainsString(error, 'Unable to reduce ' + LICK_DELETE);
        assertErrorContainsString(error, 'Id c999 not found');
    }
});

const validModes = [LICK_MODE_EDIT, LICK_MODE_VIEW];

validModes.forEach((mode, i) => {
    it('change lick mode, success #' + i, () => {
        const state = Object.freeze([
            { lick: { id: 'c5' } },
            { lick: { id: 'c10' }, mode: 'irrelevant' }
        ]);
        const newState = lickReducer(state, changeLickMode('c10', mode));
        expect(newState).toEqual([
            { lick: { id: 'c5' } },
            { lick: { id: 'c10' }, mode }
        ]);
    });
});

it('change lick mode, invalid mode', () => {
    const mode = 'modeFooInvalid';
    const state = Object.freeze([
        { lick: { id: 'c5' } },
        { lick: { id: 'c10' }, mode: 'foo' }
    ]);
    try {
        lickReducer(state, changeLickMode('c10', mode));
        throw new Error();
    } catch (error) {
        assertErrorContainsString(error, 'Unable to reduce ' + LICK_CHANGE_MODE);
        assertErrorContainsString(error, 'Invalid mode');
        assertErrorContainsString(error, mode);
        assertErrorContainsString(error, validModes.join(', '));
    }
});

it('change lick mode, id not found', () => {
    const state = Object.freeze([
        { lick: { id: 'c5' } },
        { lick: { id: 'c10' }, mode: 'foo' }
    ]);
    try {
        lickReducer(state, changeLickMode('c15', LICK_MODE_EDIT));
        throw new Error();
    } catch (error) {
        assertErrorContainsString(error, 'Unable to reduce ' + LICK_CHANGE_MODE);
        assertErrorContainsString(error, 'Id c15 not found');
    }
});
