import React from 'react';
import './TrackSection.css';
import PropTypes from 'prop-types';

function TrackSectionForm(props) {
    const {tracks, handleDeleteTrack, handleRecordStop} = props;

    return <div className="track-container">
        <div className="track-list">
            {tracks.map(track => <div key={track.id} className="track level">
                <div>
                    <audio
                        className="level-left"
                        controls
                        src={track.link}>
                        Your browser does not support the
                        <code>audio</code>
                        element.
                    </audio>
                </div>
                <a className="level-right track-delete" onClick={() => handleDeleteTrack(track.id)}>
                    <span className="icon is-small">
                        <i className="fa fa-trash"></i>
                    </span>
                </a>
            </div>)}
        </div>
        {renderRecorder(handleRecordStop)}
    </div>;
}

export default TrackSectionForm;

function renderRecorder(recordState, handleRecordStart, handleRecordStop) {
    return 'foo';
}

TrackSectionForm.propTypes = {
    tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleDeleteTrack: PropTypes.func.isRequired,
    handleRecordStop: PropTypes.func.isRequired
}
