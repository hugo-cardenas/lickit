import React from 'react';
import {render} from 'enzyme';
import Lick from './Lick';

test('input and cancel', () => {
  const component = render(<Lick {...getTestProps()}/>);
  
  console.log(component.find('.description'));

  component.find('.description').simulate('change', createEvent('description', 'abc def'));
  component.find('.track').first().find('.delete-track-link').simulate('click');
  
  component.find('.tag').first().find('.tag-delete').simulate('click');
  component.find('.tag-input input').simulate('change', createEvent('tagInput', 'abc'));
  component.find('.tag-input input').simulate('keyPress', createKeyPressEvent('Enter', 'tagInput', 'abc'));

  component.find('.lick-cancel').simulate('click');

  // Check unchanged fields after clicking cancel
  expect(component.find('.description').prop('value')).toBe('Foobar baz');
  
  expect(component.find('.track')).toHaveLength(1);
  expect(component.find('.track').first().key()).toBe(20);

  expect(component.find('.tag')).toHaveLength(3);

  return (component
    .find('.tag')
    .map(element => element.text()))
    .toEqual(expect.arrayContaining(['foo', 'bar', 'baz']));
});

function getTestProps() {
  return {
    id: 42,
    description: 'Foobar baz',
    tracks: [{id: 10}, {id: 20}],
    tags: [
      'foo', 'bar', 'baz'
    ],
    handleSave: () => {},
    handleDelete: () => {}
  }
}

function createKeyPressEvent(key, name, value)
{
  return {
    key,
    ...createEvent(name, value)
  };
}

function createEvent(name, value) {
  return {
    target:{
      name, 
      value
    }
  };
}
