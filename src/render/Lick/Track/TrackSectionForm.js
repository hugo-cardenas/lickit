import React from 'react';
import PropTypes from 'prop-types';
import './TrackSection.css';
import Recorder from './Recorder/Recorder';

function TrackSectionForm(props) {
    const { tracks, handleDeleteTrack, handleRecordTrack } = props;

    return <div className="track-container">
        <div className="track-list">
            {tracks.map(track => <div key={track.url} className="track level">
                <div>
                    <audio
                        className="level-left"
                        controls
                        src={track.url}>
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
        {renderRecorder(handleRecordTrack)}
    </div>;
}

export default TrackSectionForm;

function renderRecorder(handleRecordTrack) {
    return <Recorder {...{handleRecordTrack}}/>;
}

TrackSectionForm.propTypes = {
    tracks: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
    })).isRequired,
    handleDeleteTrack: PropTypes.func.isRequired,
    handleRecordTrack: PropTypes.func.isRequired
};
