import React, {Component} from 'react';
import './Lick.css';
import TrackSection from './Track/TrackSection';

function LickView(props) {

    const {description, tracks, tags, handleEdit} = props;

    return (
        <div className="card lick">
            <div className="card-content">
                {renderDescription(description)}
                <TrackSection mode="view"/> 
                {renderTags(tags)}
            </div>
            {renderFooter(handleEdit)}
        </div>
    );
}

export default LickView;

function renderDescription(description) {
    return <p className="description">
        {description}
    </p>;
}

function renderTags(tags) {
    return <div className="tags">
        {tags.map(tag => <span className="tag">{tag}</span>)}
    </div>;
}

function renderFooter(handleEdit) {
    return <footer className="card-footer">
        <a className="card-footer-item" onClick={() => handleEdit()}>
            <span className="icon is-small">
                <i className="fa fa-pencil-square-o"></i>
            </span>
        </a>
        <a className="card-footer-item">
            <span className="icon is-small">
                <i className="fa fa-trash"></i>
            </span>
        </a>
    </footer>;
}