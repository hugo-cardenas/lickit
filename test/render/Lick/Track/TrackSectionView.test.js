import React from 'react';
import {shallow} from 'enzyme';
import TrackSectionView from 'src/render/Lick/Track/TrackSectionView';

test('render tracks', () => {
  const tracks = [
    {id: 1, url: 'http://foo.mp3'},
    {id: 2, url: 'http://bar.mp3'},
    {id: 3, url: 'http://baz.mp3'},
  ];
  const props = {tracks};
  const component = shallow(<TrackSectionView {...props}/>);
  
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
    expect(audio.hasClass('level-left')).toBe(true);
    expect(audio.prop('controls')).toBeTruthy();
    expect(audio.prop('src')).toBe(tracks[i].url);
  });
});
