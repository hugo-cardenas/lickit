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

  // After pressing Enter, the value is not added to tags (duplicate)
  // but the field still gets cleaned
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
  const component = shallow(<LickForm {...getTestProps()}/>);
  
  
});

function getTags(component) {
  return component
    .find('.tag')
    .map(element => element.text());
}

function getTagInputValue(component){
  return component.find('.tag-container input').prop('value');
}

function getTestProps() {
  return {
    id: 42,
    description: 'Foobar baz',
    tracks: [
      {}, {}
    ],
    tags: ['foo', 'bar', 'baz'],
    handleDelete: () => {},
    handleUpdate: () => {}

  }
}
