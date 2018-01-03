import React from 'react';
import { shallow } from 'enzyme';
import Lick from 'src/render/Lick/Lick';

test('render form due to mode prop', () => {
    const props = getTestProps();
    props.mode = 'edit';
    props.changeLickMode = jest.fn();

    const component = shallow(<Lick {...props} />);
    expect(component.find('LickForm')).toHaveLength(1);
    expect(component.find('LickView')).toHaveLength(0);

    // Check cancel button
    const cancelLickEditor = component
        .find('LickForm')
        .prop('cancelLickEditor');
    cancelLickEditor('c44');
    expect(props.changeLickMode).toBeCalledWith('c44', 'view');
});

test('render view due to mode prop', () => {
    const props = getTestProps();
    props.mode = 'view';
    props.changeLickMode = jest.fn();

    const component = shallow(<Lick {...props} />);
    expect(component.find('LickForm')).toHaveLength(0);
    expect(component.find('LickView')).toHaveLength(1);

    // Check edit button
    const editLick = component.find('LickView').prop('editLick');
    editLick('c44');
    expect(props.changeLickMode).toBeCalledWith('c44', 'edit');
});

test('render view by default', () => {
    let props = getTestProps();

    const component = shallow(<Lick {...props} />);
    expect(component.find('LickForm')).toHaveLength(0);
    expect(component.find('LickView')).toHaveLength(1);
});

function getTestProps() {
    return {
        lick: {
            id: 'c42',
            artist: 'Charlie Foo',
            description: 'Foobar baz',
            tracks: [
                { id: 'a10', url: 'http://foo.mp3' },
                { id: 'a20', url: 'http://bar.mp3' }
            ],
            tags: ['foo', 'bar', 'baz']
        },
        saveLick: () => {},
        deleteLick: () => {},
        changeLickMode: () => {}
    };
}
