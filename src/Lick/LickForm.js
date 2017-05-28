import React, {Component} from 'react';
import './Lick.css';
import TrackSection from './Track/TrackSection';

function LickForm(props) {

    const {description, tracks, tags, handleSave} = props;

    return (
        <div className="card lick">
            <div className="card-content">
                {renderDescription(description)}
                <TrackSection mode="edit"/> 
                {renderTags(tags)}
            </div>
            {renderFooter(handleSave)}
        </div>
    );
}

export default LickForm;

function renderDescription(description) {
    return <textarea className="textarea description" value={description}></textarea>;
}

function renderTracks(tracks) {
    return <div className="track-container">
        <div className="tracks">
            <div className="track">
                <audio
                    controls
                    src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
                    Your browser does not support the
                    <code>audio</code>
                    element.
                </audio>
            </div>
        </div>
        <div className="recorder">
            <a className="button is-primary">
                <span className="icon is-small">
                    <i className="fa fa-microphone"></i>
                </span>
            </a>
        </div>
    </div>;
}

function renderTags(tags) {
    return <div className="tag-container">
        <div className="tags">
            {tags.map(tag => <span className="tag">{tag}
                <button className="delete is-small"></button>
            </span>)}
        </div>
        <p className="control">
            <input className="input is-small" type="text" placeholder="Add new tag"/>
        </p>
    </div>;
}

function renderFooter(handleSave) {
    return <footer className="card-footer">
        <a className="card-footer-item" onClick={() => handleSave()}>
            <span className="icon is-small">
                <i className="fa fa-floppy-o"></i>
            </span>
        </a>
        <a className="card-footer-item">
            <span className="icon is-small">
                <i className="fa fa-trash"></i>
            </span>
        </a>
    </footer>;
}