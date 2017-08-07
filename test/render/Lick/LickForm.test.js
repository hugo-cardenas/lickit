import React from 'react';
import { mount, shallow } from 'enzyme';
import LickForm from 'src/render/Lick/LickForm';

test('render description', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const description = component.find('.description');
    expect(description.type()).toBe('textarea');
    expect(description.prop('name')).toBe('description');
    expect(description.prop('value')).toBe('Foobar baz');
});

test('input description', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const description = component.find('.description');

    description.simulate('change', {
        target: {
            name: 'description',
            value: 'foo'
        }
    });
    expect(component.find('.description').prop('value')).toBe('foo');

    description.simulate('change', {
        target: {
            name: 'description',
            value: 'bar'
        }
    });
    expect(component.find('.description').prop('value')).toBe('bar');
});

test('render tracks', () => {
    const props = getTestProps();
    const component = shallow(<LickForm {...props}/>);
    const trackSection = component.find('TrackSectionForm');
    expect(trackSection).toHaveLength(1);

    expect(trackSection.prop('tracks')).toEqual(props.lick.tracks);
    expect(typeof trackSection.prop('handleDeleteTrack')).toBe('function');
    expect(typeof trackSection.prop('handleRecordTrack')).toBe('function');
});

test('delete track', () => {
    let props = getTestProps();
    props.lick.tracks = [
        { id: 'a10', url: 'foo.abc' }, { id: 'a20', url: 'bar.abc' }, { id: 'a30', url: 'baz.abc' }
    ];
    const component = shallow(<LickForm {...props}/>);

    const handleDeleteTrack = component.find('TrackSectionForm').prop('handleDeleteTrack');
    handleDeleteTrack('a20');

    const expectedTracks = [{ id: 'a10', url: 'foo.abc' }, { id: 'a30', url: 'baz.abc' }];
    expect(component.find('TrackSectionForm').prop('tracks')).toEqual(expectedTracks);
});

test.skip('record track', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const handleRecordTrack = component.find('TrackSectionForm').prop('handleRecordTrack');

    // TODO Find a way of having URL and web Audio API work on enzyme
    //handleRecordTrack(new Blob(['foo']));

    // TODO Check url of generated track
    // const expectedTracks = [{id: 10}, {id: 20}, {link: 'foo.mp3'}];
    // expect(component.find('TrackSectionForm').prop('tracks')).toHaveLength(3);
});

test('render tags', () => {
    const expectedTags = ['foo', 'bar', 'baz'];

    const component = shallow(<LickForm {...getTestProps()}/>);
    const tagsParent = component.find('.tags');
    expect(tagsParent.type()).toBe('div');

    const tagElements = tagsParent.children();
    expect(tagElements).toHaveLength(3);

    tagElements.forEach(tagElement => {
        expect(tagElement.hasClass('tag')).toBe(true);
    });

    const keys = tagElements.map(tagElement => tagElement.key());
    expect(keys).toEqual(expect.arrayContaining(expectedTags));

    const tags = getTags(component);
    expect(tags).toEqual(expect.arrayContaining(expectedTags));
});

test('delete tag', () => {
    let expectedTags = ['foo', 'bar', 'baz'];
    const component = shallow(<LickForm {...getTestProps()}/>);

    const tagElements = component.find('.tag');
    tagElements.forEach(tagElement => {
        const tag = tagElement.text();
        const button = tagElement.find('button');
        button.simulate('click');

        // Remove the deleted tag from the list of expected tags and compare
        expectedTags = expectedTags.filter(expectedTag => expectedTag !== tag);
        expect(getTags(component)).toEqual(expectedTags);
    });

    expect(getTags(component)).toEqual([]);
})

test('input new tag', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const tagInput = component.find('.tag-container input');

    // When typing, the value is kept in the field
    tagInput.simulate('change', {
        target: {
            name: 'tagInput',
            value: 'abc'
        }
    });
    expect(getTagInputValue(component)).toBe('abc');

    // After pressing Enter, the value is added to tags and the field gets cleaned
    tagInput.simulate('keyPress', {
        key: 'Enter',
        target: {
            name: 'tagInput',
            value: 'abc'
        }
    });

    const tags = getTags(component);
    expect(tags).toEqual(expect.arrayContaining(['foo', 'bar', 'baz', 'abc']));
    expect(getTagInputValue(component)).toBe('');
});

test('input duplicate tag', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const tagInput = component.find('.tag-container input');

    // When typing, the value is kept in the field
    tagInput.simulate('change', {
        target: {
            name: 'tagInput',
            value: 'bar'
        }
    });
    expect(getTagInputValue(component)).toBe('bar');

    // After pressing Enter, the value is not added to tags (duplicate) but the
    // field still gets cleaned
    tagInput.simulate('keyPress', {
        key: 'Enter',
        target: {
            name: 'tagInput',
            value: 'bar'
        }
    });

    const tags = getTags(component);
    expect(tags).toEqual(expect.arrayContaining(['foo', 'bar', 'baz']));
    expect(getTagInputValue(component)).toBe('');
});

test('save lick', () => {
    let props = getTestProps();
    props.saveLick = jest.fn();

    const expectedLick = {
        id: props.lick.id,
        description: props.lick.description,
        tracks: props.lick.tracks,
        tags: props.lick.tags
    };

    const component = shallow(<LickForm {...props}/>);
    component.find('.lick-save').simulate('click');

    expect(props.saveLick).toHaveBeenCalledTimes(1);
    expect(props.saveLick).toBeCalledWith(expectedLick);
});

test('cancel lick editor', () => {
    let props = getTestProps();
    props.cancelLickEditor = jest.fn();

    const component = shallow(<LickForm {...props}/>);
    component.find('.lick-cancel').simulate('click');

    expect(props.cancelLickEditor).toHaveBeenCalledTimes(1);
    expect(props.cancelLickEditor).toBeCalledWith(props.lick.id);
});

test('delete lick', () => {
    let props = getTestProps();
    props.deleteLick = jest.fn();

    const component = shallow(<LickForm {...props}/>);
    component.find('.lick-delete').simulate('click');

    expect(props.deleteLick).toHaveBeenCalledTimes(1);
    expect(props.deleteLick).toBeCalledWith(props.lick.id);
});

function getTags(component) {
    return component
        .find('.tag')
        .map(element => element.text());
}

function getTagInputValue(component) {
    return component
        .find('.tag-container input')
        .prop('value');
}

function getTestProps() {
    return {
        lick: {
            id: 'c42',
            description: 'Foobar baz',
            tracks: [
                { id: 'abc10', url: 'foo.baz' }, { id: 'abc20', url: 'bar.baz' }
            ],
            tags: [
              'foo', 'bar', 'baz'
            ]
        },
        saveLick: () => {},
        cancelLickEditor: () => {},
        deleteLick: () => {}
    };
}
