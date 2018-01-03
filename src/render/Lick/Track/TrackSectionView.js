import PropTypes from 'prop-types';
import React from 'react';

function TrackSectionView(props) {
    const { tracks } = props;

    return (
        <div className="track-container">
            <div className="track-list">
                {tracks.map(track => (
                    <div key={track.id} className="track level">
                        <audio className="level-left" controls src={track.url}>
                            Your browser does not support the
                            <code>audio</code>
                            element.
                        </audio>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrackSectionView;

TrackSectionView.propTypes = {
    tracks: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        })
    ).isRequired
};
