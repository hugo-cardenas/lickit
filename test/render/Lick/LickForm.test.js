import React from 'react';
import { mount, shallow } from 'enzyme';
import LickForm from 'src/render/Lick/LickForm';

test('render artist', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const artist = component.find('.artist');
    expect(artist.type()).toBe('input');
    expect(artist.prop('name')).toBe('artist');
    expect(artist.prop('value')).toBe('Charlie Foo');
});

test('input artist', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const artist = component.find('.artist');

    artist.simulate('change', {
        target: {
            name: 'artist',
            value: 'foo'
        }
    });
    expect(component.find('.artist').prop('value')).toBe('foo');

    artist.simulate('change', {
        target: {
            name: 'artist',
            value: 'bar'
        }
    });
    expect(component.find('.artist').prop('value')).toBe('bar');
});

test('render song', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const song = component.find('.song');
    expect(song.type()).toBe('input');
    expect(song.prop('name')).toBe('song');
    expect(song.prop('value')).toBe('Foobar baz');
});

test('input song', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const song = component.find('.song');

    song.simulate('change', {
        target: {
            name: 'song',
            value: 'foo'
        }
    });
    expect(component.find('.song').prop('value')).toBe('foo');

    song.simulate('change', {
        target: {
            name: 'song',
            value: 'bar'
        }
    });
    expect(component.find('.song').prop('value')).toBe('bar');
});

test('render track', () => {
    const props = getTestProps();
    const component = shallow(<LickForm {...props}/>);
    const player = component.find('Player');
    expect(player.prop('src')).toEqual(props.lick.tracks[0].url);
});

test('delete track', () => {
    let props = getTestProps();
    props.lick.tracks = [
        { id: 'a10', url: 'foo.abc' }
    ];
    const component = shallow(<LickForm {...props}/>);

    component.find('.track-delete').simulate('click');

    expect(component.find('Player').exists()).toBe(false);
    expect(component.find('Recorder').exists()).toBe(true);
});

test.skip('record track', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const handleRecordTrack = component.find('Recorder').prop('handleRecordTrack');

    // TODO Find a way of having URL and web Audio API work on enzyme
    //handleRecordTrack(new Blob(['foo']));

    // TODO Check url of generated track
    // expect(component.find('Player').prop('src')).;
});

test('render tags', () => {
    const props = getTestProps();
    props.lick.tags = ['bar', 'foo', 'baz'];
    const expectedTags = ['bar', 'foo', 'baz']; // Prop tags are expected to be already sorted

    const component = shallow(<LickForm {...props}/>);
    const tagsParent = component.find('.tags');
    expect(tagsParent.type()).toBe('div');

    const tagElements = tagsParent.children();
    expect(tagElements).toHaveLength(3);

    tagElements.forEach(tagElement => {
        expect(tagElement.hasClass('tag')).toBe(true);
    });

    const keys = tagElements.map(tagElement => tagElement.key());
    expect(keys).toEqual(expectedTags);

    const tags = getTags(component);
    expect(tags).toEqual(expectedTags);
});

test('delete tag', () => {
    let expectedTags = ['bar', 'baz', 'foo'];
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
});

test('input new tag', () => {
    const component = shallow(<LickForm {...getTestProps()}/>);
    const tagInput = component.find('.tag-container input');

    // When typing, the value is kept in the field
    tagInput.simulate('change', {
        target: {
            name: 'tagInput',
            value: 'faa'
        }
    });
    expect(getTagInputValue(component)).toBe('faa');

    // After pressing Enter, the value is added to tags and the field gets cleaned
    tagInput.simulate('keyPress', {
        key: 'Enter',
        target: {
            name: 'tagInput',
            value: 'faa'
        }
    });

    const tags = getTags(component);
    // Expected tags sorted alphabetically
    expect(tags).toEqual(['bar', 'baz', 'faa', 'foo']); 
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
    expect(tags).toEqual(['bar', 'baz', 'foo']);
    expect(getTagInputValue(component)).toBe('');
});

test('save lick', () => {
    let props = getTestProps();
    props.saveLick = jest.fn();

    const expectedLick = {
        id: props.lick.id,
        artist: props.lick.artist,
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
            artist: 'Charlie Foo',
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
