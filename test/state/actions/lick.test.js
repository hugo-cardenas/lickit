import { LICK_UPDATE, LICK_DELETE } from 'src/state/actions/types';
import getActions from 'src/state/actions/lick/lick';

// TODO Test error

it('update lick', async() => {
    const state = {
        licks: [
            { lick: { id: 512 } },
            {
                lick: {
                    id: 1024,
                    tracks: [
                        { id: 40 }, // To be deleted
                        { id: 42 },
                        { id: 44 }, // To be deleted
                        { id: 46 },
                    ]
                }
            },
            { lick: { id: 2048 } }
        ]
    };

    const blob1 = new Blob(['foo']);
    const blob2 = new Blob(['bar']);

    const lick = {
        id: 1024,
        tracks: [
            { id: 42 },
            { blob: blob1 }, // To be created
            { id: 46 },
            { blob: blob2 }, // To be created
        ]
    };

    const storage = {
        saveBlob: jest.fn()
            .mockReturnValueOnce(Promise.resolve(100))
            .mockReturnValueOnce(Promise.resolve(200)),
        deleteTrack: jest.fn()
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.resolve())
    };
    const { updateLick } = getActions(storage);

    const action = updateLick(lick);
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValueOnce(state);
    await action(dispatch, getState);

    const expectedLick = {
        id: 1024,
        tracks: [
            { id: 42 },
            { id: 100 },
            { id: 46 },
            { id: 200 }
        ]
    };

    expect(storage.saveBlob).toHaveBeenCalledTimes(2);
    expect(storage.saveBlob).toHaveBeenCalledWith(blob1);
    expect(storage.saveBlob).toHaveBeenCalledWith(blob2);

    expect(storage.deleteTrack).toHaveBeenCalledTimes(2);
    expect(storage.deleteTrack).toHaveBeenCalledWith(40);
    expect(storage.deleteTrack).toHaveBeenCalledWith(44);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
        type: LICK_UPDATE,
        lick: expectedLick
    });
});

it('delete lick', async() => {
    const state = {
        licks: [
            { lick: { id: 512 } },
            {
                lick: {
                    id: 1024,
                    tracks: [
                        { id: 40 }, // To be deleted
                        { id: 42 } // To be deleted
                    ]
                }
            },
            { lick: { id: 2048 } }
        ]
    };

    const lickId = 1024;

    const storage = {
        deleteTrack: jest.fn()
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.resolve())
    };
    const { deleteLick } = getActions(storage);

    const action = deleteLick(lickId);
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValueOnce(state);
    await action(dispatch, getState);

    expect(storage.deleteTrack).toHaveBeenCalledTimes(2);
    expect(storage.deleteTrack).toHaveBeenCalledWith(40);
    expect(storage.deleteTrack).toHaveBeenCalledWith(42);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
        type: LICK_DELETE,
        id: lickId
    });
});
