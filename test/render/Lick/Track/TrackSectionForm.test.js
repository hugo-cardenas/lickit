import React from 'react';
import { shallow } from 'enzyme';
import TrackSectionForm from 'src/render/Lick/Track/TrackSectionForm';

test('render tracks', () => {
    const props = getProps();
    const tracks = props.tracks;
    const component = shallow(<TrackSectionForm {...props} />);

    const container = component.find('.track-container');
    expect(container.type()).toBe('div');

    const list = container.find('.track-list');
    expect(list.type()).toBe('div');

    const trackElements = list.children();
    expect(trackElements).toHaveLength(3);

    trackElements.forEach((trackElement, i) => {
        expect(trackElement.hasClass('track')).toBe(true);
        expect(trackElement.hasClass('level')).toBe(true);

        expect(trackElement.key()).toBe(tracks[i].url);

        const audio = trackElement.find('audio');
        expect(audio).toHaveLength(1);
        expect(audio.hasClass('level-left')).toBe(true);
        expect(audio.prop('controls')).toBeTruthy();
        expect(audio.prop('src')).toBe(tracks[i].url);
    });
});

test('delete track', () => {
    let props = getProps();
    props.handleDeleteTrack = jest.fn();

    const component = shallow(<TrackSectionForm {...props} />);

    // Assert original tracks and delete middle one
    const originalTrackElements = component.find('.track');
    expect(originalTrackElements).toHaveLength(3);

    originalTrackElements
        .at(1)
        .find('.track-delete')
        .first()
        .simulate('click');

    // Assert that the delete handler gets called with the correct track id
    expect(props.handleDeleteTrack).toHaveBeenCalledTimes(1);
    expect(props.handleDeleteTrack).toBeCalledWith('abc20');
});

function getProps() {
    return {
        tracks: [
            { id: 'abc10', url: 'http://foo.mp3' },
            { id: 'abc20', url: 'http://bar.mp3' },
            { id: 'abc30', url: 'http://baz.mp3' }
        ],
        handleDeleteTrack: () => {},
        handleRecordTrack: () => {}
    };
}
