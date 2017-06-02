import React from 'react';
import TrackSectionView from './Track/TrackSectionView';

function LickView(props) {
    const {id, description, trackSectionState, tags, handleEdit, handleDelete} = props;

    return (
        <div className="card lick">
            <div className="card-content">
                {renderDescription(description)}
                <TrackSectionView {...trackSectionState}/> 
                {renderTags(tags)}
            </div>
            {renderFooter(id, handleEdit, handleDelete)}
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
        {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
    </div>;
}

function renderFooter(id, handleEdit, handleDelete) {
    return <footer className="card-footer">
        <a className="card-footer-item" onClick={() => handleEdit()}>
            <span className="icon is-small">
                <i className="fa fa-pencil-square-o"></i>
            </span>
        </a>
        <a className="card-footer-item" onClick={() => handleDelete(id)}>
            <span className="icon is-small">
                <i className="fa fa-trash"></i>
            </span>
        </a>
    </footer>;
}