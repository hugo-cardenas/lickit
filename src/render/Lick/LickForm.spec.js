import React from 'react';
import {shallow} from 'enzyme';
import LickForm from './LickForm';

test('render description', () => {
  const component = shallow(<LickForm {...getTestProps()}/>);
  const description = component.find('.description');
  expect(description.type()).toBe('textarea');
  expect(description.prop('name')).toBe('description');
  expect(description.prop('value')).toBe('Foobar baz');
});

test('render tracks', () => {
  const component = shallow(<LickForm {...getTestProps()}/>);
  const trackSection = component.find('TrackSectionForm');
  expect(trackSection).toHaveLength(1);
  // TODO Assert props passed
})

test('render tags', () => {
  const component = shallow(<LickForm {...getTestProps()}/>);
  const tagsParent = component.find('.tags');
  expect(tagsParent.type()).toBe('div');
  
  const tagElements = tagsParent.children();
  expect(tagElements).toHaveLength(3);

  const expectedTags = ['foo', 'bar', 'baz'];
  const tags = tagElements.map(tagElement => tagElement.text());
  expect(tags).toEqual(expect.arrayContaining(expectedTags));
});

function getTestProps() {
  return {
    id: 42,
    description: 'Foobar baz',
    tracks: [
      {}, {}
    ],
    tags: ['foo', 'bar', 'baz']
  }
}
