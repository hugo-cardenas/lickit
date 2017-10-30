import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LibRecorder from 'react-recorder';

const
    STATE_STOPPED = 'stopped',
    STATE_PLAYING = 'playing';
    
class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordState: 'idle'
        };
        this.handleRecordStart = this.handleRecordStart.bind(this);
        this.handleRecordStop = this.handleRecordStop.bind(this);
    }

    render() {
        const { trackSrc } = this.props;
        return <div>
            <audio src={trackSrc}></audio>
        </div>;
    }
}

export default Player;

Player.propTypes = {
    trackSrc: PropTypes.string.isRequired
};
