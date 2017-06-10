import lickReducer from 'src/state/reducers/lick';
import {createLick, updateLick, deleteLick} from 'src/state/actions/lick';

it('define default state', () => {
    const expectedState = [];

    expect(lickReducer(undefined, {type: 'invalid action'})).toEqual(expectedState);
})

it('reduce unknown action', () => {
    const state = Object.freeze([]);
    const expectedState = [];

    expect(lickReducer(state, {type: 'invalid action'})).toEqual(expectedState);
});

it('create lick', () => {
    const state = Object.freeze([]);
    const expectedState = [{
        description: '',
        tracks: [],
        tags: []
    }];

    expect(lickReducer(state, createLick())).toEqual(expectedState);
});

it('update lick, success', () => {
    const state = Object.freeze([
        {id: 10},
        {
            id: 20,
            description: 'foo',
            tracks: [{id: 100}, {id: 200}],
            tags: ['foo', 'bar']
        }, 
        {id: 30}
    ]);

    const updatedLick = {
        id: 20,
        description: 'bar baz',
        tracks: [{id: 200}],
        tags: ['foo', 'baz']
    };

    const expectedState = [
        {id: 10},
        updatedLick,
        {id: 30}
    ];

    expect(lickReducer(state, updateLick(updatedLick))).toEqual(expectedState);
});

const invalidLicks = [
    {
        id: 20,
        // description: 'bar baz',
        tracks: [{id: 200}],
        tags: ['foo', 'baz']
    },
    {
        id: 20,
        description: 'bar baz',
        // tracks: [{id: 200}],
        tags: ['foo', 'baz']
    }
];

invalidLicks.forEach((lick, i) => {
    it.skip(`update lick, invalid data #${i}`, () => {
        // TODO
        const state = Object.freeze([
            {id: 10},
            {id: 20}, 
            {id: 30}
        ]);

        expect(() => lickReducer(state, updateLick(lick))).toThrow(/invalid lick/);
    });
});

it.skip('update lick, not found', () => {
    const state = Object.freeze([
        {id: 10},
        {id: 30}
    ]);

    const updatedLick = {
        id: 20,
        description: 'bar baz',
        tracks: [{id: 200}],
        tags: ['foo', 'baz']
    };

    expect(lickReducer(state, updateLick(updatedLick))).toEqual(expectedState);
});
