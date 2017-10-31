import React from 'react';
import { mount } from 'enzyme';
import path from 'path';
import Player from 'src/render/Audio/Player';

test('start and stop', async() => {
    const props = getProps();
    const component = mount(<Player {...props}/>);

    // Idle state show play button
    expect(component.find('.button i').hasClass('fa-play')).toBe(true);
    expect(component.find('audio').getDOMNode().paused).toBe(true);

    // After clicking, show stop button
    component.find('.button').simulate('click');
    expect(component.find('.button i').hasClass('fa-stop')).toBe(true);
    // Would check "paused" here, but doesn't work with jsdom

    // After clicking, show microphone button again
    component.find('.button').simulate('click');
    expect(component.find('.button i').hasClass('fa-play')).toBe(true);
    expect(component.find('audio').getDOMNode().paused).toBe(true);
});

const getProps = () => {
    return {
        src: 'file://' + path.join(__dirname, 'test.wav')
    };
};
