import React from 'react';
import {shallow} from 'enzyme';
// import Recorder from './Recorder';

test.skip('render tracks', () => {
  // TODO
  const component = shallow(<Recorder {...getProps()}/>);
});

function getProps(){
  return {
    handleRecordStop: () => {},
  };
}
