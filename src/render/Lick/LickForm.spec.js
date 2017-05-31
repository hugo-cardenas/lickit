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
  const component = shallow(<LickForm {...getTestProps()}/>);
  const trackSection = component.find('TrackSectionForm');
  expect(trackSection).toHaveLength(1);
  // TODO Assert props passed
})

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
  const component = shallow(<LickForm {...getTestProps()}/>);
  const tagsParent = component
    .find('.tag')
    .map(element => text());
  expect(tagsParent.type()).toBe('div');

  description.simulate('change', {
    target: {
      name: 'description',
      value: 'foo'
    }
  });
  
})

// test('input new tag', () => {
//   const component = shallow(<LickForm {...getTestProps()}/>);
//   const tagsParent = component
//     .find('.tag')
//     .map(element => text());
//   expect(tagsParent.type()).toBe('div');
//   description.simulate('change', {
//     target: {
//       name: 'description',
//       value: 'foo'
//     }
//   });
//   expect(component.find('.description').prop('value')).toBe('foo');
//   description.simulate('change', {
//     target: {
//       name: 'description',
//       value: 'bar'
//     }
//   });
//   expect(component.find('.description').prop('value')).toBe('bar');
// });

function getComponentTags(component) {
  return component
    .find('.tag')
    .map(element => text());
}

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
