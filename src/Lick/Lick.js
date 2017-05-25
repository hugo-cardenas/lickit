import React, {Component} from 'react';
import './Lick.css';

export default function (props) {
    return (
        <div className="card lick">
            {renderContent(props)}
            {renderFooter()}
        </div>
    );
}

const viewModeRenderer = {

};

const editModeRenderer = {

}

function renderContent(props) {
    return <div className="card-content">
        {renderDescription(props)}
        {renderTracks(props)}
        {renderTags(props)}
    </div>;
}

function renderDescription(props) {
    return <p className="description">
        {props.description}
    </p>;
}

function renderTracks(props) {
    return <div className="track-container">
        <audio
            controls
            src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
            Your browser does not support the
            <code>audio</code>
            element.
        </audio>
    </div>;
}

function renderTags(props) {
    return <div className="tags">
        {props
            .tags
            .map(tag => <span className="tag">{tag}</span>)}
    </div>;
}

function renderFooter() {
    return <footer className="card-footer">
        <a className="card-footer-item">
            <span className="icon is-small">
                <i className="fa fa-pencil"></i>
            </span>
        </a>
        <a className="card-footer-item">
            <span className="icon is-small">
                <i className="fa fa-trash"></i>
            </span>
        </a>
    </footer>;
}
