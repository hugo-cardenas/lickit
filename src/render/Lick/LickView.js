import React from 'react';
import {linkifier} from 'react-linkifier';
import TrackSectionView from './Track/TrackSectionView';

function LickView(props) {
    const {lick, handleEdit, handleDelete} = props;
    const {id, description, tracks, tags} = lick;

    return (
        <div className="card lick">
            <div className="card-content">
                {renderDescription(description)}
                <TrackSectionView tracks={tracks}/> 
                {renderTags(tags)}
            </div>
            {renderFooter(id, handleEdit, handleDelete)}
        </div>
    );
}

export default LickView;

function renderDescription(description) {
    // TODO Wrap long links
    return <pre className="description">
        {linkifier(description, {target: '_blank'})}
    </pre>;
}

function renderTags(tags) {
    return <div className="tags">
        {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
    </div>;
}

function renderFooter(id, handleEdit, handleDelete) {
    return <footer className="card-footer">
        <a className="card-footer-item lick-edit" onClick={() => handleEdit()}>
            <span className="icon is-small">
                <i className="fa fa-pencil-square-o"></i>
            </span>
        </a>
        <a className="card-footer-item lick-delete" onClick={() => handleDelete(id)}>
            <span className="icon is-small">
                <i className="fa fa-trash"></i>
            </span>
        </a>
    </footer>;
}