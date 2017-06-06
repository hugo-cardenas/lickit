import React from 'react';
import {shallow} from 'enzyme';
import Lick from './Lick';

test('input and cancel', () => {
  const component = shallow(<Lick {...getTestProps()}/>);
  // TODO
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
