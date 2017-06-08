import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LibRecorder from 'react-recorder';

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
            case 'recording':
                return this.renderRecorderRecording();
            case 'idle':
            default:
                return this.renderRecorderIdle();
        }
    }

    renderRecorderIdle(handleRecordStart) {
        return <div className="recorder">
            <a className="button is-primary" onClick={this.handleRecordStart}>
                <span className="icon is-small">
                    <i className="fa fa-microphone"></i>
                </span>
            </a>
            <LibRecorder command="stop" onStop={this.props.handleRecordTrack}/>
        </div>;
    }

    renderRecorderRecording(handleRecordStop) {
        return <div className="recorder">
            <a className="button is-primary" onClick={this.handleRecordStop}>
                <span className="icon is-small">
                    <i className="fa fa-stop"></i>
                </span>
            </a>
            <LibRecorder command="start" onStop={this.props.handleRecordTrack}/>
        </div>
    }

    handleRecordStart(){
        this.setState({recordState: 'recording'});
    }

    handleRecordStop(){
        this.setState({recordState: 'idle'});
    }
}

export default Recorder;

Recorder.propTypes = {
    handleRecordTrack: PropTypes.func.isRequired
}
