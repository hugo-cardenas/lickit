import React from 'react';
import PropTypes from 'prop-types';

class Recorder {
    constructor(props) {
        super(props);
        const {handleRecordStop} = props;
        this.state = {
            handleRecordStop
        };
    }

    render() {
        return <div className="track-container">
            <div className="track-list">
                {tracks.map(track => <div key={track.id} className="track level">
                    <div>
                        <audio className="level-left" controls src={track.link}>
                            Your browser does not support the
                            <code>audio</code>
                            element.
                        </audio>
                    </div>
                    <a className="level-right delete-track-link">
                        <span className="icon is-small">
                            <i className="fa fa-trash"></i>
                        </span>
                    </a>
                </div>)}
            </div>
            {renderRecorder(recordState, handleRecordStart, handleRecordStop)}
        </div>;
    }

    function renderRecorder(recordState, handleRecordStart, handleRecordStop) {
        switch (recordState) {
            case 'started':
                return renderRecorderStarted(handleRecordStart);
            case 'stopped':
            default:
                return renderRecorderStopped(handleRecordStop);
        }

    }

    function renderRecorderStopped(handleRecordStart) {
        return <div className="recorder">
            <a className="button is-primary" onClick={() => handleRecordStart()}>
                <span className="icon is-small">
                    <i className="fa fa-microphone"></i>
                </span>
            </a>
        </div>;
    }

    function renderRecorderStarted(handleRecordStop) {
        return <div className="recorder">
            <a className="button is-primary" onClick={() => handleRecordStop()}>
                <span className="icon is-small">
                    <i className="fa fa-stop"></i>
                </span>
            </a>
        </div>
    }
}

export default TrackSectionForm;

TrackSectionForm.propTypes = {
    handleRecordStop: PropTypes.func.isRequired
}
