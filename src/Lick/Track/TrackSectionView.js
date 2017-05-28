import React from 'react';
import './TrackSection.css';

function TrackSectionView(props) {
    return <div className="track-container">
        <div className="track-list">
            <div className="track level">
                <audio
                    className="level-left"
                    controls
                    src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
                    Your browser does not support the
                    <code>audio</code>
                    element.
                </audio>
            </div>
        </div>
    </div>;
}

export default TrackSectionView;