import React from 'react';
import { shallow } from 'enzyme';
import Lick from 'src/render/Lick/Lick';

test('render form due to mode prop', () => {
    const props = getTestProps();
    props.mode = 'edit';
    props.changeLickMode = jest.fn();

    const component = shallow(<Lick {...props}/>);
    expect(component.find('LickForm')).toHaveLength(1);
    expect(component.find('LickView')).toHaveLength(0);

    // Check cancel button
    const handleCancel = component.find('LickForm').prop('handleCancel');
    handleCancel();
    expect(props.changeLickMode).toBeCalledWith(42, 'view');
});

test('render view due to mode prop', () => {
    const props = getTestProps();
    props.mode = 'view';
    props.changeLickMode = jest.fn();

    const component = shallow(<Lick {...props}/>);
    expect(component.find('LickForm')).toHaveLength(0);
    expect(component.find('LickView')).toHaveLength(1);

    // Check edit button
    const handleEdit = component.find('LickView').prop('handleEdit');
    handleEdit();
    expect(props.changeLickMode).toBeCalledWith(42, 'edit');
});

test('render view by default', () => {
    let props = getTestProps();

    const component = shallow(<Lick {...props}/>);
    expect(component.find('LickForm')).toHaveLength(0);
    expect(component.find('LickView')).toHaveLength(1);
});

function getTestProps() {
    return {
        lick: {
            id: 42,
            description: 'Foobar baz',
            tracks: [{ id: 10, url: 'http://foo.mp3' }, { id: 20, url: 'http://bar.mp3' }],
            tags: [
                'foo', 'bar', 'baz'
            ],
        },
        handleSave: () => {},
        handleDelete: () => {},
        changeLickMode: () => {}
    };
}
