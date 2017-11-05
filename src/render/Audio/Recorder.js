import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LibRecorder from 'react-recorder';

const
    STATE_IDLE = 'idle',
    STATE_RECORDING = 'recording';
    

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordState: 'idle'
        };
        this.handleRecordStart = this.handleRecordStart.bind(this);
        this.handleRecordStop = this.handleRecordStop.bind(this);
    }

    render() {
        switch (this.state.recordState) {
            case STATE_RECORDING:
                return this.renderRecorderRecording();
            case STATE_IDLE:
            default:
                return this.renderRecorderIdle();
        }
    }

    renderRecorderIdle() {
        return <div className="recorder">
            <a className="button-audio button is-primary" onClick={this.handleRecordStart}>
                <span className="icon is-small">
                    <i className="fa fa-microphone"></i>
                </span>
            </a>
            <LibRecorder command="stop" onStop={this.props.handleRecordTrack}/>
        </div>;
    }

    renderRecorderRecording() {
        return <div className="recorder">
            <a className="button-audio button is-primary" onClick={this.handleRecordStop}>
                <span className="icon is-small">
                    <i className="fa fa-stop"></i>
                </span>
            </a>
            <LibRecorder command="start" onStop={this.props.handleRecordTrack}/>
        </div>;
    }

    handleRecordStart() {
        this.setState({ recordState: STATE_RECORDING });
    }

    handleRecordStop() {
        this.setState({ recordState: STATE_IDLE });
    }
}

export default Recorder;

Recorder.propTypes = {
    handleRecordTrack: PropTypes.func.isRequired
};
