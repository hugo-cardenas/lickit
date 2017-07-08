import { LICK_UPDATE } from 'src/state/actions/types';
import getActions from 'src/state/actions/lick/lick';

// TODO Test error

it('update lick', async() => {
    const blob1 = new Blob(['foo']);
    const blob2 = new Blob(['bar']);

    const lick = {
        tracks: [
            { id: 42 },
            { blob: blob1 },
            { id: 44 },
            { blob: blob2 },
        ]
    };

    const storage = { saveBlob: jest.fn() };
    storage.saveBlob.mockReturnValueOnce(100);
    storage.saveBlob.mockReturnValueOnce(200);

    const { updateLick } = getActions(storage);

    const action = updateLick(lick);
    const dispatch = jest.fn();
    await action(dispatch);

    expect(storage.saveBlob.mock.calls.length).toBe(2);
    expect(storage.saveBlob.mock.calls[0][0]).toEqual(blob1);
    expect(storage.saveBlob.mock.calls[1][0]).toEqual(blob2);

    const expectedLick = {
        tracks: [
            { id: 42 },
            { id: 100 },
            { id: 44 },
            { id: 200 },
        ]
    };

    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({
        type: LICK_UPDATE,
        lick: expectedLick
    });
});
