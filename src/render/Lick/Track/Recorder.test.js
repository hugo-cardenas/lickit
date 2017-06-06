import React from 'react';
import {shallow} from 'enzyme';
import Recorder from './Recorder';

test('render tracks', () => {
  const component = shallow(<Recorder {...getProps()}/>);
});

function getProps(){
  return {
    handleRecordStop: () => {},
  };
}
