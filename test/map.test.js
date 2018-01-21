import { mapDispatchToProps, mergeProps } from 'src/map';
import {
    createLick,
    updateLick,
    deleteLick,
    changeLickMode
} from 'src/state/actions/lick';
import { addFilter, removeFilter, setInput } from 'src/state/actions/search';

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

it('map dispatch to props - create lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    const lick = { foo: 'bar' };
    await props.lick.createLick(lick);

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(
        createLick(dispatch).toString()
    );
});

it('map dispatch to props - update lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    const lick = { foo: 'bar' };
    await props.lick.saveLick(lick);

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(
        updateLick(dispatch).toString()
    );
});

it('map dispatch to props - delete lick', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    await props.lick.deleteLick('a42');

    expect(dispatch).toHaveBeenCalledTimes(1);
    // Tricky thing - as updateLick returns a thunk, we just compare the functions returned
    expect(dispatch.mock.calls[0][0].toString()).toEqual(
        deleteLick(dispatch).toString()
    );
});

it('map dispatch to props - change lick mode', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.lick.changeLickMode('a42', 'modeFoo');
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(changeLickMode('a42', 'modeFoo'));
});

it('map dispatch to props - add filter', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.search.addFilter({ foo: 'bar' });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(addFilter({ foo: 'bar' }));
});

it('map dispatch to props - remove filter', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.search.removeFilter({ foo: 'bar' });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(removeFilter({ foo: 'bar' }));
});

it('map dispatch to props - set input', async() => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);

    props.search.setInput('foo');
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(setInput('foo'));
});

it('merge props', () => {
    const stateProps = {
        error: 'foo',
        lick: {
            items: ['foo', 'bar']
        },
        search: {
            filters: ['bar', 'baz']
        }
    };

    const func1 = () => 42;
    const func2 = () => 44;
    const func3 = () => 46;
    const func4 = () => 48;

    const dispatchProps = {
        lick: {
            func1,
            func2
        },
        search: {
            func3,
            func4
        }
    };

    const expectedProps = {
        error: 'foo',
        lick: {
            items: ['foo', 'bar'],
            func1,
            func2
        },
        search: {
            filters: ['bar', 'baz'],
            func3,
            func4
        }
    };

    expect(mergeProps(stateProps, dispatchProps)).toEqual(expectedProps);
});
