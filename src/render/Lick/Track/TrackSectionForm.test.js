import React from 'react';
import {shallow} from 'enzyme';
import TrackSectionForm from './TrackSectionForm';

test('render tracks', () => {
  const props = getProps();
  const tracks = props.tracks;
  const component = shallow(<TrackSectionForm {...props}/>);
  
  const container = component.find('.track-container');
  expect(container.type()).toBe('div');

  const list = container.find('.track-list');
  expect(list.type()).toBe('div');

  const trackElements = list.children();
  expect(trackElements).toHaveLength(3);

  trackElements.forEach((trackElement, i) => {
    expect(trackElement.hasClass('track')).toBe(true);
    expect(trackElement.hasClass('level')).toBe(true);

    expect(trackElement.key()).toBe(tracks[i].id.toString());

    const audio = trackElement.find('audio');
    expect(audio).toHaveLength(1);
    expect(audio.hasClass('level-left')).toBe(true)
    expect(audio.prop('controls')).toBeTruthy();
    expect(audio.prop('src')).toBe(tracks[i].link)
  });
});

test('delete track', () => {
  let props = getProps();
  props.handleDeleteTrack = jest.fn();

  const component = shallow(<TrackSectionForm {...props}/>);

  // Assert original tracks and delete middle one
  const originalTrackElements = component.find('.track');
  expect(originalTrackElements).toHaveLength(3);

  originalTrackElements.at(1).find('.track-delete').first().simulate('click');

  // Assert that the delete handler gets called with the correct track id
  expect(props.handleDeleteTrack).toHaveBeenCalledTimes(1);
  expect(props.handleDeleteTrack).toBeCalledWith(20);
});

function getProps(){
  return {
    tracks: [
      {id: 10, link: 'http://foo.mp3'},
      {id: 20, link: 'http://bar.mp3'},
      {id: 30, link: 'http://baz.mp3'},
    ],
    handleDeleteTrack: () => {},
    handleRecordStop: () => {},
  };
}
