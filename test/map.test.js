import { mapStateToProps, mapDispatchToProps } from 'src/map';
import { updateLick, deleteLick, changeLickMode } from 'src/state/actions/lick';
import { LICK_CREATE } from 'src/state/actions/types';

// Mock the call electron.app.getPath('userData') - TODO extract to common
jest.mock('electron', () => {
    return {
        app: {
            getPath: name => {
                if (name === 'userData') {
                    return '/tmp/foo';
                }
                return '';
            }
        }
    };
});

it('map state to props', () => {
    const error = new Error('foo');
    const state = {
        error,
        licks: [
            {
                mode: 'edit',
                lick: {
                    id: 'c42',
                    artist: 'Charlie Foo',
                    description: 'Foo bar 42',
                    tracks: [{ id: 'abc10' }, { id: 'abc20' }],
                    tags: ['foo', 'bar'],
                    createdAt: 12500
                }
            }
        ]
    };

    const expectedProps = {
        error,
        licks: [
            {
                mode: 'edit',
                lick: {
                    id: 'c42',
                    artist: 'Charlie Foo',
                    description: 'Foo bar 42',
                    tracks: [{ id: 'abc10', url: 'file:///tmp/foo/tracks/abc10.wav' }, { id: 'abc20', url: 'file:///tmp/foo/tracks/abc20.wav' }],
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

    props.createLick();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({type: LICK_CREATE});
});

it('map dispatch to props - update lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    const lick = { foo: 'bar' };
    await (props.saveLick(lick));

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(updateLick(dispatch).toString());
});

it('map dispatch to props - delete lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    await (props.deleteLick('a42'));

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(deleteLick(dispatch).toString());
});

it('map dispatch to props - change lick mode', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.changeLickMode('a42', 'modeFoo');
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(changeLickMode('a42', 'modeFoo'));
});
