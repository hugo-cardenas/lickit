import React from 'react';
import {shallow} from 'enzyme';
import Recorder from 'src/render/Lick/Track/Recorder/Recorder';

test('start and stop', () => {
  const props = getProps();
  const component = shallow(<Recorder {...props}/>);

  // Idle state show microphone button
  expect(component.find('.button i').hasClass('fa-microphone')).toBe(true);
  expect(component.find('Recorder').prop('command')).toBe('stop');
  expect(component.find('Recorder').prop('onStop')).toBe(props.handleRecordTrack);
  
  // After clicking, show stop button
  component.find('.button').simulate('click');
  expect(component.find('.button i').hasClass('fa-stop')).toBe(true);
  expect(component.find('Recorder').prop('command')).toBe('start');
  expect(component.find('Recorder').prop('onStop')).toBe(props.handleRecordTrack);

  // After clicking, show microphone button again
  component.find('.button').simulate('click');
  expect(component.find('.button i').hasClass('fa-microphone')).toBe(true);
  expect(component.find('Recorder').prop('command')).toBe('stop');
  expect(component.find('Recorder').prop('onStop')).toBe(props.handleRecordTrack);
});

function getProps(){
  return {
    handleRecordTrack: () => 'foo',
  };
}
