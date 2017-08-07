import { LICK_UPDATE, LICK_DELETE } from 'src/state/actions/types';
import getActions from 'src/state/actions/lick/lick';
import { assertErrorContainsString } from '../../helper/assertionHelper';

it('update lick - success', async() => {
    const state = {
        licks: [
            { lick: { id: 'c512' } },
            {
                lick: {
                    id: 'c1024',
                    tracks: [
                        { id: 'c40' }, // To be deleted
                        { id: 'c42' },
                        { id: 'c44' }, // To be deleted
                        { id: 'c46' },
                    ]
                }
            },
            { lick: { id: 'c2048' } }
        ]
    };

    const blob1 = new Blob(['foo']);
    const blob2 = new Blob(['bar']);

    const lick = {
        id: 'c1024',
        tracks: [
            { id: 'c42' },
            { blob: blob1 }, // To be created
            { id: 'c46' },
            { blob: blob2 }, // To be created
        ]
    };

    const storage = {
        saveBlob: jest.fn()
            .mockReturnValueOnce(Promise.resolve('c100'))
            .mockReturnValueOnce(Promise.resolve('c200')),
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
        id: 'c1024',
        tracks: [
            { id: 'c42' },
            { id: 'c100' },
            { id: 'c46' },
            { id: 'c200' }
        ]
    };

    expect(storage.saveBlob).toHaveBeenCalledTimes(2);
    expect(storage.saveBlob).toHaveBeenCalledWith(blob1);
    expect(storage.saveBlob).toHaveBeenCalledWith(blob2);

    expect(storage.deleteTrack).toHaveBeenCalledTimes(2);
    expect(storage.deleteTrack).toHaveBeenCalledWith('c40');
    expect(storage.deleteTrack).toHaveBeenCalledWith('c44');

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
        type: LICK_UPDATE,
        lick: expectedLick
    });
});

it('update lick - invalid action data', async() => {
    const state = {
        licks: [
            {
                lick: {
                    id: 'c1024',
                    tracks: []
                }
            }
        ]
    };
    const invalidTrack = { foo: 'bar' }; // Missing id or blob
    const lick = {
        id: 'c1024',
        tracks: [invalidTrack]
    };

    const storage = {};
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
        assertErrorContainsString(error, `Invalid track ${JSON.stringify(invalidTrack)}, should contain id or blob`);
    }
});

it('update lick - async save fails', async() => {
    const state = {
        licks: [
            { lick: { id: 'c512' } },
            {
                lick: {
                    id: 'c1024',
                    tracks: [{ id: 'c42' }]
                }
            },
            { lick: { id: 'c2048' } }
        ]
    };

    const blob1 = new Blob(['foo']);
    const blob2 = new Blob(['bar']);

    const lick = {
        id: 'c1024',
        tracks: [
            { id: 'c42' },
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
            { lick: { id: 'c512' } },
            {
                lick: {
                    id: 'c1024',
                    tracks: [
                        { id: 'c40' }, // To be deleted, will succeed
                        { id: 'c42' } // To be deleted, will fail  
                    ]
                }
            },
            { lick: { id: 'c2048' } }
        ]
    };

    const lick = {
        id: 'c1024',
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
        id: 'c1024',
        tracks: []
    };

    expect(storage.deleteTrack).toHaveBeenCalledTimes(2);
    expect(storage.deleteTrack).toHaveBeenCalledWith('c40');
    expect(storage.deleteTrack).toHaveBeenCalledWith('c42');

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
        type: LICK_UPDATE,
        lick: expectedLick
    });
});

it('delete lick - success', async() => {
    const state = {
        licks: [
            { lick: { id: 'c512' } },
            {
                lick: {
                    id: 'c1024',
                    tracks: [
                        { id: 'c40' }, // To be deleted
                        { id: 'c42' } // To be deleted
                    ]
                }
            },
            { lick: { id: 'c2048' } }
        ]
    };

    const lickId = 'c1024';

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
    expect(storage.deleteTrack).toHaveBeenCalledWith('c40');
    expect(storage.deleteTrack).toHaveBeenCalledWith('c42');

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
        type: LICK_DELETE,
        id: lickId
    });
});

it('delete lick - async delete fails, still creates action', async() => {
    const state = {
        licks: [
            { lick: { id: 'c512' } },
            {
                lick: {
                    id: 'c1024',
                    tracks: [
                        { id: 'c40' }, // To be deleted, will succeed
                        { id: 'c42' } // To be deleted, will fail
                    ]
                }
            },
            { lick: { id: 'c2048' } }
        ]
    };

    const lickId = 'c1024';

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
    expect(storage.deleteTrack).toHaveBeenCalledWith('c40');
    expect(storage.deleteTrack).toHaveBeenCalledWith('c42');

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
        type: LICK_DELETE,
        id: lickId
    });
});
