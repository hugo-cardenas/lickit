import _ from 'lodash';
import VError from 'verror';
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

    const state = Object.freeze([{ lick: { id: 10 } }]);
    const newState = lickReducer(state, { type: LICK_CREATE });
    expect(newState).toHaveLength(2);

    expect(newState[0].mode).toBe('edit');
    expect(newState[0].lick.id).toBeGreaterThan(0);
    expect(newState[0].lick.id).not.toBe(10);
    expect(newState[0].lick.description).toBe('');
    expect(newState[0].lick.tracks).toEqual([]);
    expect(newState[0].lick.tags).toEqual([]);
    expect(newState[0].lick.createdAt).toBeGreaterThanOrEqual(initialTimestamp);
    expect(newState[0].lick.createdAt).toBeLessThan(Date.now());

    expect(newState[1]).toEqual({ lick: { id: 10 } });
});

const validLicks = [
    {
        id: 20,
        description: 'bar baz',
        tracks: [{ id: 200 }],
        tags: ['foo', 'baz']
    },
    {
        id: 20,
        description: '',
        tracks: [{ id: 200 }],
        tags: ['foo', 'baz']
    },
    {
        id: 20,
        description: 'bar baz',
        tracks: [],
        tags: ['foo', 'baz']
    },
    {
        id: 20,
        description: 'bar baz',
        tracks: [{ id: 200 }],
        tags: []
    }
];

validLicks.forEach((lick, i) => {
    it('update lick, success #' + i, () => {
        const state = Object.freeze([
            { lick: { id: 10 } },
            {
                lick: {
                    id: 20,
                    description: 'foo',
                    tracks: [{ id: 100 }, { id: 200 }],
                    tags: ['foo', 'bar'],
                    createdAt: 12500
                },
                mode: 'edit'
            },
            { lick: { id: 30 } }
        ]);

        const expectedState = [
            { lick: { id: 10 } },
            {
                lick: {
                    ...lick,
                    createdAt: 12500
                },
                mode: 'view'
            },
            { lick: { id: 30 } }
        ];

        expect(lickReducer(state, { type: LICK_UPDATE, lick })).toEqual(expectedState);
    });
});

const validLick = {
    id: 20,
    description: 'bar baz',
    tracks: [{ id: 200 }],
    tags: ['foo', 'baz']
};

const invalidLicks = [
    // Missing fields
    [_.pick(validLick, ['description', 'tracks', 'tags']), ['id']],
    [_.pick(validLick, ['id', 'tracks', 'tags']), ['description']],
    [_.pick(validLick, ['id', 'description', 'tags']), ['tracks']],
    [_.pick(validLick, ['id', 'description', 'tracks']), ['tags']],
    [_.pick(validLick, ['id', 'tracks']), ['description', 'tags']],

    // Invalid values
    [Object.assign({}, validLick, { id: 'foo' }), ['id']],
    [Object.assign({}, validLick, { id: -1 }), ['id']],

    [Object.assign({}, validLick, { description: 42 }), ['description']],

    [Object.assign({}, validLick, { tracks: 42 }), ['tracks']],
    // [Object.assign({}, validLick, {tracks: [{id: 200}, 'foo']}), ['tracks']], // TODO ENABLE

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
            { id: 10 },
            { id: 20 },
            { id: 30 }
        ]);

        try {
            lickReducer(state, { type: LICK_UPDATE, lick });
            throw new Error();
        } catch (error) {
            assertErrorContainsString(error, 'Unable to reduce ' + LICK_UPDATE);
            assertErrorContainsString(error, JSON.stringify(lick));
            invalidProperties.forEach(property => {
                assertErrorContainsString(error, property);
            });
        }
    });
});

it('update lick, id not found', () => {
    const state = Object.freeze([
        { lick: { id: 10 } },
        { lick: { id: 30 } }
    ]);

    const lick = {
        id: 20,
        description: 'bar baz',
        tracks: [{ id: 200 }],
        tags: ['foo', 'baz']
    };

    try {
        lickReducer(state, { type: LICK_UPDATE, lick });
        throw new Error();
    } catch (error) {
        assertErrorContainsString(error, 'Unable to reduce ' + LICK_UPDATE);
        assertErrorContainsString(error, JSON.stringify(lick));
        assertErrorContainsString(error, 'Id 20 not found');
    }
});

it('delete lick, success', () => {
    const state = Object.freeze([
        { lick: { id: 10 } },
        { lick: { id: 20 } },
        { lick: { id: 30 } }
    ]);

    const expectedState = Object.freeze([
        { lick: { id: 10 } },
        { lick: { id: 30 } }
    ]);

    expect(lickReducer(state, { type: LICK_DELETE, id: 20 })).toEqual(expectedState);
});

it('delete lick, id not found', () => {
    const state = Object.freeze([
        { lick: { id: 10 } },
        { lick: { id: 20 } },
        { lick: { id: 30 } }
    ]);

    try {
        lickReducer(state, { type: LICK_DELETE, id: 999 });
        throw new Error();
    } catch (error) {
        assertErrorContainsString(error, 'Unable to reduce ' + LICK_DELETE);
        assertErrorContainsString(error, 'Id 999 not found');
    }
});

const validModes = [LICK_MODE_EDIT, LICK_MODE_VIEW];

validModes.forEach((mode, i) => {
    it('change lick mode, success #' + i, () => {
        const state = Object.freeze([
            { lick: { id: 5 } },
            { lick: { id: 10 }, mode: 'irrelevant' }
        ]);
        const newState = lickReducer(state, changeLickMode(10, mode));
        expect(newState).toEqual([
            { lick: { id: 5 } },
            { lick: { id: 10 }, mode }
        ]);
    });
});

it('change lick mode, invalid mode', () => {
    const mode = 'modeFooInvalid';
    const state = Object.freeze([
        { lick: { id: 5 } },
        { lick: { id: 10 }, mode: 'foo' }
    ]);
    try {
        lickReducer(state, changeLickMode(10, mode));
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
        { lick: { id: 5 } },
        { lick: { id: 10 }, mode: 'foo' }
    ]);
    try {
        lickReducer(state, changeLickMode(15, LICK_MODE_EDIT));
        throw new Error();
    } catch (error) {
        assertErrorContainsString(error, 'Unable to reduce ' + LICK_CHANGE_MODE);
        assertErrorContainsString(error, 'Id 15 not found');
    }
});
