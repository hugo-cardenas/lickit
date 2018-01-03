import reduce from 'src/state/compatibility/lick';

it('indexes licks by id', () => {
    const state = {
        isCreateFormEnabled: false,
        items: [
            {
                lick: {
                    id: '1',
                    artist: 'foo'
                }
            },
            {
                lick: {
                    id: '2',
                    artist: 'bar'
                }
            }
        ]
    };

    const expectedState = {
        isCreateFormEnabled: false,
        items: {
            '1': {
                lick: { artist: 'foo' }
            },
            '2': {
                lick: { artist: 'bar' }
            }
        }
    };

    Object.freeze(state);
    expect(reduce(state)).toEqual(expectedState);
});
