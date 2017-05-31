import React from 'react';
import {shallow} from 'enzyme';
import LickForm from './LickForm';

test('render description', () => {
  const component = shallow(<LickForm {...getTestProps()}/>);
  const description = component.find('.description');
  expect(description.type()).toBe('textarea');
});

function getTestProps() {
  return {
    id: 42,
    description: 'Foobar baz',
    tracks: [{}, {}],
    tags: ['foo', 'bar']
  }
}