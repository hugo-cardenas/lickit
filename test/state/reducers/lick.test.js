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
import { enableCreateForm, cancelCreateForm, changeLickMode } from 'src/state/actions/lick';

jest.mock('electron', () => {
    return {
        app: { getPath: () => 'foobar' }
    };
});

it('define default state', () => {
    const expectedState = createState([]);

    expect(lickReducer(undefined, { type: 'invalid action' })).toEqual(expectedState);
});

it('reduce unknown action', () => {
    const state = createState([]);
    const expectedState = createState([]);

    expect(lickReducer(state, { type: 'invalid action' })).toEqual(expectedState);
});

it('enable create form', () => {
    const state = createState([]);
    const expectedState = { items: [], isCreateFormEnabled: true };

    expect(lickReducer(state, enableCreateForm())).toEqual(expectedState);
});

it('cancel create form', () => {
    const state = { items: [], isCreateFormEnabled: true };
    const expectedState = { items: [], isCreateFormEnabled: false };

    expect(lickReducer(state, cancelCreateForm())).toEqual(expectedState);
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

        const state = { isCreateFormEnabled: true, items: [{ lick: { id: 'c10' } }] };
        const newLick = { ...lick };
        delete newLick.id;
        const newState = lickReducer(state, { type: LICK_CREATE, lick: newLick });

        const { isCreateFormEnabled, items } = newState;

        expect(isCreateFormEnabled).toBe(false);

        expect(items).toHaveLength(2);

        expect(items[0].mode).toBe('view');
        expect(typeof items[0].lick.id).toBe('string');
        expect(items[0].lick.id.length).toBeGreaterThan(10);
        expect(items[0].lick.id.length).toBeLessThan(30);
        expect(items[0].lick.id).not.toBe('10abc');
        expect(items[0].lick.artist).toBe(lick.artist);
        expect(items[0].lick.description).toBe(lick.description);
        expect(items[0].lick.tracks).toEqual(lick.tracks);
        expect(items[0].lick.tags).toEqual(lick.tags);
        expect(items[0].lick.createdAt).toBeGreaterThanOrEqual(initialTimestamp);
        expect(items[0].lick.createdAt).toBeLessThan(Date.now() + 1);
        expect(items[0].lick.foo).toBe(undefined);

        expect(items[1]).toEqual({ lick: { id: 'c10' } });
    });
});

validLicks.forEach((lick, i) => {
    it('update lick, success #' + i, () => {
        const state = createState([
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

        const expectedState = createState([
            { lick: { id: 'c10' } },
            {
                lick: {
                    ..._.pick(lick, ['id', 'artist', 'description', 'tracks', 'tags']),
                    createdAt: 12500
                },
                mode: 'view'
            },
            { lick: { id: 'c30' } }
        ]);

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
    [_.pick(validLick, ['id', 'description', 'tracks', 'tags']), ['artist']],
    [_.pick(validLick, ['id', 'artist', 'tracks', 'tags']), ['description']],
    [_.pick(validLick, ['id', 'artist', 'description', 'tags']), ['tracks']],
    [_.pick(validLick, ['id', 'artist', 'description', 'tracks']), ['tags']],
    [_.pick(validLick, ['id', 'artist', 'tracks']), ['description', 'tags']],

    // Invalid values
    [Object.assign({}, validLick, { artist: 42 }), ['artist']],

    [Object.assign({}, validLick, { description: 42 }), ['description']],

    [Object.assign({}, validLick, { tracks: 42 }), ['tracks']],
    [Object.assign({}, validLick, { tracks: [{ id: 'abc200' }, 999] }), ['tracks']],
    [Object.assign({}, validLick, { tracks: [{ id: 'abc200' }, { id: true }] }), ['tracks']],

    [Object.assign({}, validLick, { tags: 42 }), ['tags']],
    [Object.assign({}, validLick, { tags: ['foo', 42] }), ['tags']]
];

invalidLicks.forEach((entry, i) => {
    it('create lick, invalid data #' + i, () => {
        const [lick, invalidProperties] = entry;
        const newLick = { ...lick };
        delete newLick.id;

        const state = createState([]);

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
    [Object.assign({}, validLick, { id: -1 }), ['id']],
];

invalidLicksToUpdate.forEach((entry, i) => {
    it('update lick, invalid data #' + i, () => {
        const [lick, invalidProperties] = entry;
        const state = createState([
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
    const state = createState([
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
    const state = createState([
        { lick: { id: 'c10' } },
        { lick: { id: 'c20' } },
        { lick: { id: 'c30' } }
    ]);

    const expectedState = createState([
        { lick: { id: 'c10' } },
        { lick: { id: 'c30' } }
    ]);

    expect(lickReducer(state, { type: LICK_DELETE, id: 'c20' })).toEqual(expectedState);
});

it('delete lick, id not found', () => {
    const state = createState([
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
        const state = createState([
            { lick: { id: 'c5' } },
            { lick: { id: 'c10' }, mode: 'irrelevant' }
        ]);

        const expectedState = createState([
            { lick: { id: 'c5' } },
            { lick: { id: 'c10' }, mode }
        ]);

        const newState = lickReducer(state, changeLickMode('c10', mode));
        expect(newState).toEqual(expectedState);
    });
});

it('change lick mode, invalid mode', () => {
    const mode = 'modeFooInvalid';
    const state = createState([
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
    const state = createState([
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

const createState = (items) => {
    return Object.freeze({
        isCreateFormEnabled: false,
        items
    });
};
