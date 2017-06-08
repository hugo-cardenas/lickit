import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Recorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordState: 'idle'
        };
    }

    render() {
        const {handleRecordStop} = this.props;

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
            <a className="button is-primary" onClick={this.handleRecordStart.bind(this)}>
                <span className="icon is-small">
                    <i className="fa fa-microphone"></i>
                </span>
            </a>
        </div>;
    }

    renderRecorderRecording(handleRecordStop) {
        return <div className="recorder">
            <a className="button is-primary" onClick={this.handleRecordStop.bind(this)}>
                <span className="icon is-small">
                    <i className="fa fa-stop"></i>
                </span>
            </a>
        </div>
    }

    handleRecordStart(){
        this.setState({recordState: 'recording'});
    }

    handleRecordStop(){
        // TODO Pass here the track data recorded
        this.props.handleRecordStop();
        this.setState({recordState: 'idle'});
    }
}

export default Recorder;

Recorder.propTypes = {
    handleRecordStop: PropTypes.func.isRequired
}
