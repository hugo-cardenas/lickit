import lickReducer from 'src/state/reducers/lick';
import {createLick, updateLick, deleteLick} from 'src/state/actions/lick';

it('reduces default', () => {
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