import PropTypes from 'prop-types';
import React from 'react';
import { linkifier } from 'react-linkifier';
import Player from '../Audio/Player';
import radium from 'radium';

// const img = require('/Users/hugo/Library/Application Support/Electron/images/piano.jpeg');

const LickView = (props) => {
    const { lick, editLick, deleteLick } = props;
    const { id, artist, description, tracks, tags } = lick;

    // linear-gradient(rgba(222, 222, 222, 0.45), rgba(222, 222, 222, 0.45))

    // TODO Mandatory track?
    const url = tracks[0] ? tracks[0].url : '';

    return <div className="card lick lick-view">
        <div className="card-content">
            {renderMenu(id, editLick, deleteLick)}
            {renderArtist(artist)}
            {renderSong(description)}
            {renderTrack(url)}
            {renderTags(tags)}                
        </div>
    </div>;
};

const renderMenu = (id, editLick, deleteLick) => {
    return <div className="dropdown is-right is-hoverable is-pulled-right">
        <div className="dropdown-trigger">
            <span className="icon is-small" aria-haspopup="true" aria-controls="dropdown-menu">
                <i className="fa fa-bars" aria-hidden="true"></i>
            </span>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
                <a className="dropdown-item" onClick={() => editLick(id)}>
                    <span className="icon is-small">
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                    </span>
                    <span>Edit</span>
                </a>
                <a className="dropdown-item" onClick={() => deleteLick(id)}>
                    <span className="icon is-small">
                        <i className="fa fa-trash" aria-hidden="true"></i>
                    </span>
                    <span>Delete</span>
                </a>
            </div>
        </div>
    </div>;
};

const renderArtist = artist => 
    <p className="artist">{artist}</p>;

const renderSong = song => 
    <div className="song">
        {song}{/* | <a href="#">Link</a> */}
    </div>;

const renderTrack = url => {

    const backgroundImage = `url("file:///Users/hugo/Library/Application Support/Electron/images/piano.jpeg")`;
    const style = {
        backgroundImage: [
            `linear-gradient(
                rgba(222, 222, 222, 0.45), 
                rgba(222, 222, 222, 0.45)
            )`,
            backgroundImage,
        ].join(', '),
        // filter: `blur(1px)`,
        // height: '50px',
        backgroundSize: 'cover',
        ':hover': {
            backgroundImage: [
                `linear-gradient(
                    rgba(222, 222, 222, 0.65), 
                    rgba(222, 222, 222, 0.65)
                )`,
                backgroundImage,
            ].join(', ')
        }
    };
    
    return <div className="track-container">
        <div className="center">
            <Player src={url}/>
        </div>
    </div>;
};

const renderTags = tags =>
    <div className="tags">
        {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
    </div>;

export default radium(LickView);

LickView.propTypes = {
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
