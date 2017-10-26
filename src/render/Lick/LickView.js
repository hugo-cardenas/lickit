import PropTypes from 'prop-types';
import React from 'react';
import { linkifier } from 'react-linkifier';
import TrackSectionView from './Track/TrackSectionView';

function LickView(props) {
    const { lick, editLick, deleteLick } = props;
    const { id, artist, description, tracks, tags } = lick;

    return (
        <div className="card lick lick-view">
            {/* <header className="card-header"> */}
                {/* <span className="icon">
                    <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                </span> */}
            
                
            {/* </header> */}
            <div className="card-content">
                {renderMenu(id, editLick, deleteLick)}
                {renderArtist(artist)}
                {renderDescription(description)}
                <TrackSectionView tracks={tracks}/> 
                {renderTags(tags)}                
            </div>
            {renderFooter(id, editLick, deleteLick)}
        </div>
    );
}

function renderMenu(id, editLick, deleteLick) {
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
}

export default LickView;

function renderArtist(artist) {
    return <p className="artist">{artist}</p>;
}

function renderDescription(description) {
    // TODO Wrap long links
    return <pre className="description">
        {linkifier(description, {target: '_blank'})} | <a href="#">Link</a>
    </pre>;
}

function renderTags(tags) {
    // Render tags sorted alphabetically
    // tags.sort(); // TODO MOVE TO REDUX SELECTOR
    return <div className="tags">
        {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
    </div>;
}

function renderFooter(id, editLick, deleteLick) {
    return <footer className="card-footer">
        <div className="card-footer-item">
            <time className="is-size-7" dateTime="2016-1-1">3 days ago</time>
        </div>
        {/* <a className="card-footer-item lick-edit" onClick={() => editLick(id)}>
            <a className="button is-small is-pulled-right" onClick={() => editLick(id)}>
                <span className="icon is-small">
                    <i className="fa fa-pencil"></i>
                </span>
                {<span>Edit</span>}
            </a>
        </a>
        <div className="card-footer-item lick-delete">
            <a className="button is-small is-pulled-right" onClick={() => deleteLick(id)}>
                <span className="icon is-small">
                    <i className="fa fa-trash"></i>
                </span>
                {<span>Del</span>}
            </a>
        </div> */}
    </footer>;
}

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
