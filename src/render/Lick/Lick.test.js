import React from 'react';
import {shallow} from 'enzyme';
import Lick from './Lick';

test('render form due to mode prop', () => {
  let props = getTestProps();
  props.mode = 'edit';

  const component = shallow(<Lick {...props}/>);
  expect(component.find('LickForm')).toHaveLength(1);
  expect(component.find('LickView')).toHaveLength(0);
});

test('render view due to mode prop', () => {
  let props = getTestProps();
  props.mode = 'view';

  const component = shallow(<Lick {...props}/>);
  expect(component.find('LickForm')).toHaveLength(0);
  expect(component.find('LickView')).toHaveLength(1);
});

test('render view by default', () => {
  let props = getTestProps();

  const component = shallow(<Lick {...props}/>);
  expect(component.find('LickForm')).toHaveLength(0);
  expect(component.find('LickView')).toHaveLength(1);
});

test('input and cancel', () => {
  const component = shallow(<Lick {...getTestProps()}/>);
  
  let view = component.find('LickView').dive();
  view.find('.lick-edit').simulate('click');
  
  // Input description
  const form = component.find('LickForm').dive();
  form.find('.description').simulate('change', createEvent('description', 'abc def'));
  
  // Delete track
  const trackSectionForm = form.find('TrackSectionForm').dive();
  trackSectionForm.find('.track').first().find('.track-delete').first().simulate('click');
  
  // Delete tag and input new one
  form.find('.tag').first().find('.tag-delete').simulate('click');
  form.find('.tag-input input').simulate('change', createEvent('tagInput', 'abc'));
  form.find('.tag-input input').simulate('keyPress', createKeyPressEvent('Enter', 'tagInput', 'abc'));

  // Click cancel button
  form.find('.lick-cancel').first().simulate('click');

  // Check unchanged fields after clicking cancel
  const newView = component.find('LickView').dive();
  expect(newView.find('.description').text()).toBe('Foobar baz');  
  
  const trackSectionView = newView.find('TrackSectionView').dive();
  expect(trackSectionView.find('.track')).toHaveLength(2);
  const tracks = trackSectionView.find('.track');
  expect(tracks.at(0).key()).toBe('10');
  expect(tracks.at(1).key()).toBe('20');
  
  expect(newView.find('.tag')).toHaveLength(3);
  expect(newView
    .find('.tag')
    .map(element => element.text()))
    .toEqual(expect.arrayContaining(['foo', 'bar', 'baz']));
});

function getTestProps() {
  return {
    lick: {
      id: 42,
      description: 'Foobar baz',
      tracks: [{id: 10, link: 'http://foo.mp3'}, {id: 20, link: 'http://bar.mp3'}],
      tags: [
        'foo', 'bar', 'baz'
      ],
    },
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
