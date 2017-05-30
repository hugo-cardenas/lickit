import React from 'react';
import './TrackSection.css';

function TrackSectionView(props) {
    const {recordState, handleRecordStart, handleRecordStop} = props;

    return <div className="track-container">
        <div className="track-list">
            {[0, 1].map(i => <div className="track level">
                <div>
                    <audio
                        className="level-left"
                        controls
                        src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
                        Your browser does not support the
                        <code>audio</code>
                        element.
                    </audio>
                </div>
                <a className="level-right">
                    <span className="icon is-small">
                        <i className="fa fa-trash"></i>
                    </span>
                </a>
            </div>)}

        </div>
        {renderRecorder(recordState, handleRecordStart, handleRecordStop)}
    </div>;
}

export default TrackSectionView;

function renderRecorder(recordState, handleRecordStart, handleRecordStop) {
    switch(recordState) {
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