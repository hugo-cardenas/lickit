import PropTypes from 'prop-types';
import React from 'react';
import Player from '../Audio/Player';
import radium from 'radium';
import ReactTooltip from 'react-tooltip';

const propTypes = {
    lick: PropTypes.shape({
        id: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    editLick: PropTypes.func.isRequired,
    deleteLick: PropTypes.func.isRequired
};

const LickView = props => {
    const { lick, editLick, deleteLick } = props;
    const { id, artist, artistIndex, description, tracks, tags } = lick;

    // TODO Mandatory track?
    const url = tracks[0] ? tracks[0].url : '';

    return (
        <div className="card lick lick-view">
            <div className="card-content">
                {renderMenu(id, editLick, deleteLick)}
                {renderArtist(artist)}
                {renderDescription(artistIndex, description)}
                {renderTrack(url)}
                {renderTags(tags)}
            </div>
        </div>
    );
};

const renderMenu = (id, editLick, deleteLick) => {
    return (
        <div className="dropdown is-right is-hoverable is-pulled-right">
            <div className="dropdown-trigger">
                <span
                    className="icon is-small"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu">
                    <i className="fa fa-bars" aria-hidden="true" />
                </span>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    <a className="dropdown-item" onClick={() => editLick(id)}>
                        <span className="icon is-small">
                            <i className="fa fa-pencil" aria-hidden="true" />
                        </span>
                        <span>Edit</span>
                    </a>
                    <a className="dropdown-item" onClick={() => deleteLick(id)}>
                        <span className="icon is-small">
                            <i className="fa fa-trash" aria-hidden="true" />
                        </span>
                        <span>Delete</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

const renderArtist = artist => (
    <p className="artist">{artist !== '' ? artist : 'Unknown artist'}</p>
);

const renderDescription = (artistIndex, song) => (
    <div className="description">
        #{artistIndex} {song !== '' ? `| ${song}` : ''}
        {/* | <a href="#">Link</a> */}
    </div>
);

const renderTrack = url => (
    <div className="track-container">
        <div className="center">
            <Player src={url} />
        </div>
    </div>
);

const renderTags = tags => {
    // Hack to estimate fitting tags in one line
    const letterWidth = 6;
    const paddingSum = 9 + 9;
    const marginRight = 8;

    const maxWidth = 228;
    const ellipsisWidth = 11 + paddingSum + marginRight;
    const tagWidths = tags.map(tag =>  letterWidth * tag.length + paddingSum + marginRight);
    
    let totalWidth = 0;
    const visibleTags = tags.reduce((visibleTags, tag, index) => {
        if (totalWidth + tagWidths[index] < maxWidth) {
            visibleTags.push(tag);
            totalWidth += tagWidths[index];
        }
        return visibleTags;
    }, []);
    
    if (visibleTags.length < tags.length) {
        visibleTags.push('...');
        totalWidth += ellipsisWidth;
        delete visibleTags[visibleTags.length - 2];
    }

    return <div className="tags">
        {visibleTags.map(tag => (
            <div key={tag} className="tag" data-tip={tag === '...' ? tags.join(' | ') : null}>
                {tag}
            </div>
        ))}
        <ReactTooltip effect="solid" place="bottom" />
    </div>;
};

LickView.propTypes = propTypes;

export default radium(LickView);
