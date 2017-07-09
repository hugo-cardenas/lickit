import { mapStateToProps, mapDispatchToProps } from 'src/map';
import { updateLick } from 'src/state/actions/lick';
import { LICK_CREATE, LICK_DELETE } from 'src/state/actions/types';

// Mock the call electron.app.getPath('userData') - TODO extract to common
jest.mock('electron', () => {
    const tmp = require('tmp');

    const electron = {
        app: {
            getPath: name => {
                if (name === 'userData') {
                    return '/tmp/foo';
                }
                return '';
            }
        }
    };

    let userDataPath;

    function getUserDataPath() {
        if (!userDataPath) {
            userDataPath = tmp.dirSync({ unsafeCleanup: true }).name;
        }
        return userDataPath;
    }

    return electron;
});

it('map state to props', () => {
    const state = {
        licks: [
            {
                lick: {
                    id: 42,
                    description: 'Foo bar 42',
                    tracks: [{ id: 10 }, { id: 20 }],
                    tags: ['foo', 'bar']
                }
            }
        ]
    };

    const expectedProps = {
        licks: [
            {
                lick: {
                    id: 42,
                    description: 'Foo bar 42',
                    tracks: [{ id: 10, url: 'file:///tmp/foo/tracks/10.wav' }, { id: 20, url: 'file:///tmp/foo/tracks/20.wav' }],
                    tags: ['foo', 'bar']
                }
            }
        ]
    };

    expect(mapStateToProps(state)).toEqual(expectedProps);
});

it('map dispatch to props - create lick', () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.handleCreate();
    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: LICK_CREATE });
});

it('map dispatch to props - update lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    const lick = {foo: 'bar'};
    await (props.handleSave(lick));

    expect(dispatch.mock.calls.length).toBe(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(updateLick(dispatch).toString());
});

it('map dispatch to props - delete lick', () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.handleDelete(42);
    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: LICK_DELETE, id: 42 });
});
