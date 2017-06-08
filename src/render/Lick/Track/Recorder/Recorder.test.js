import React from 'react';
import {shallow} from 'enzyme';
import Recorder from './Recorder';

test('start and stop', () => {
  const props = getProps();
  props.handleRecordStop = jest.fn();

  const component = shallow(<Recorder {...props}/>);
  
  // Idle state show microphone button
  expect(component.find('.button i').hasClass('fa-microphone')).toBe(true);
  
  // After clicking, show stop button
  component.find('.button').simulate('click');
  expect(component.find('.button i').hasClass('fa-stop')).toBe(true);

  // After clicking, show microphone button again and handler function called
  component.find('.button').simulate('click');
  expect(component.find('.button i').hasClass('fa-microphone')).toBe(true);
  expect(props.handleRecordStop).toHaveBeenCalledTimes(1);
  //expect(props.handleRecordStop).toBeCalledWith(20); TODO
});

function getProps(){
  return {
    handleRecordStop: () => {},
  };
}
