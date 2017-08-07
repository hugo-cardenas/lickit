import { LICK_UPDATE, LICK_DELETE } from 'src/state/actions/types';
import getActions from 'src/state/actions/lick/lick';
import { assertErrorContainsString } from '../../helper/assertionHelper';

it('update lick - success', async() => {
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

it('update lick - async save fails', async() => {
    const state = {
        licks: [
            { lick: { id: 512 } },
            {
                lick: {
                    id: 1024,
                    tracks: [{ id: 42 }]
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
            { blob: blob1 }, // To be created, will succeed
            { blob: blob2 }, // To be created, will fail
        ]
    };

    const errorMessage = 'Failed to save blob 2';
    const storage = {
        saveBlob: jest.fn()
            .mockReturnValueOnce(Promise.resolve(100))
            .mockReturnValueOnce(Promise.reject(new Error(errorMessage))),
    };
    const { updateLick } = getActions(storage);

    const action = updateLick(lick);
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValueOnce(state);
    try {
        await action(dispatch, getState);
        throw new Error();
    } catch (error) {
        assertErrorContainsString(error, 'Unable to create action');
        assertErrorContainsString(error, LICK_UPDATE);
        assertErrorContainsString(error, JSON.stringify(lick));
        assertErrorContainsString(error, errorMessage);
        expect(storage.saveBlob).toHaveBeenCalledTimes(2);
        expect(storage.saveBlob).toHaveBeenCalledWith(blob1);
        expect(storage.saveBlob).toHaveBeenCalledWith(blob2);
    }
});

it('update lick - async delete fails, still creates action', async() => {
    const state = {
        licks: [
            { lick: { id: 512 } },
            {
                lick: {
                    id: 1024,
                    tracks: [
                        { id: 40 }, // To be deleted, will succeed
                        { id: 42 } // To be deleted, will fail  
                    ]
                }
            },
            { lick: { id: 2048 } }
        ]
    };

    const lick = {
        id: 1024,
        tracks: []
    };

    const errorMessage = 'Failed to delete track 42';
    const storage = {
        deleteTrack: jest.fn()
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.reject(new Error(errorMessage)))
    };
    const { updateLick } = getActions(storage);

    const action = updateLick(lick);
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValueOnce(state);
    await action(dispatch, getState);

    const expectedLick = {
        id: 1024,
        tracks: []
    };

    expect(storage.deleteTrack).toHaveBeenCalledTimes(2);
    expect(storage.deleteTrack).toHaveBeenCalledWith(40);
    expect(storage.deleteTrack).toHaveBeenCalledWith(42);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
        type: LICK_UPDATE,
        lick: expectedLick
    });
});

it('delete lick - success', async() => {
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

it('delete lick - async delete fails, still creates action', async() => {
    const state = {
        licks: [
            { lick: { id: 512 } },
            {
                lick: {
                    id: 1024,
                    tracks: [
                        { id: 40 }, // To be deleted, will succeed
                        { id: 42 } // To be deleted, will fail
                    ]
                }
            },
            { lick: { id: 2048 } }
        ]
    };

    const lickId = 1024;

    const errorMessage = 'Failed to delete track 42';
    const storage = {
        deleteTrack: jest.fn()
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.reject(new Error(errorMessage)))
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
