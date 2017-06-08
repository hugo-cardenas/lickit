import React from 'react';
import {shallow} from 'enzyme';
import LickView from './LickView';

test('render description', () => {
  const component = shallow(<LickView {...getTestProps()}/>);
  const description = component.find('.description');
  expect(description.type()).toBe('p');
  expect(description.text()).toBe('Foobar baz');
});

test('render tracks', () => {
  const props = getTestProps();
  const component = shallow(<LickView {...props}/>);
  const trackSection = component.find('TrackSectionView');
  expect(trackSection).toHaveLength(1);
  expect(trackSection.prop('tracks')).toEqual(props.tracks);
});

test('render tags', () => {
  const expectedTags = ['foo', 'bar', 'baz'];

  const component = shallow(<LickView {...getTestProps()}/>);
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

function getTags(component) {
  return component
    .find('.tag')
    .map(element => element.text());
}

function getTestProps() {
  return {
    id: 42,
    description: 'Foobar baz',
    trackSectionState: {
      tracks: [{}, {}],
      handleDeleteTrack: () => {},
      handleRecordStop: () => {}
    },
    tags: ['foo', 'bar', 'baz']
  }
}
