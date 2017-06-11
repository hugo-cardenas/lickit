import _ from 'lodash';
import VError from 'verror';
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

const validLick = {
    id: 20,
    description: 'bar baz',
    tracks: [{id: 200}],
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
    [Object.assign({}, validLick, {id: 'foo'}), ['id']],
    [Object.assign({}, validLick, {id: -1}), ['id']],

    [Object.assign({}, validLick, {description: 42}), ['description']],

    [Object.assign({}, validLick, {tracks: 42}), ['tracks']],
    // [Object.assign({}, validLick, {tracks: [{id: 200}, 'foo']}), ['tracks']], // TODO ENABLE

    [Object.assign({}, validLick, {tags: 42}), ['tags']],
    [Object.assign({}, validLick, {tags: ['foo', 42]}), ['tags']], // TODO ENABLE
];

invalidLicks.forEach((entry, i) => {
    it(`update lick, invalid data #${i}`, () => {
        const [lick, invalidProperties] = entry;    
        const state = Object.freeze([
            {id: 10},
            {id: 20}, 
            {id: 30}
        ]);

        try {
            lickReducer(state, updateLick(lick));
            throw new Error();
        } catch (error) {
            expect(error.message).toEqual(expect.stringContaining('Invalid lick'));
            expect(error.message).toEqual(expect.stringContaining(JSON.stringify(lick)));
            invalidProperties.forEach(property => {
                expect(VError.cause(error).message).toEqual(expect.stringContaining(property));
            })
        }
    });
});

it('update lick, not found', () => {
    const state = Object.freeze([
        {id: 10},
        {id: 30}
    ]);

    const lick = {
        id: 20,
        description: 'bar baz',
        tracks: [{id: 200}],
        tags: ['foo', 'baz']
    };

    try {
        lickReducer(state, updateLick(lick));
        throw new Error();
    } catch (error) {
        expect(error.message).toEqual(expect.stringContaining('Invalid lick'));
        expect(error.message).toEqual(expect.stringContaining(JSON.stringify(lick)));
        expect(error.message).toEqual(expect.stringContaining('Id 20 not found'));
    }
});
