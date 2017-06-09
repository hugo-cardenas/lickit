import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import TrackSectionForm from './Track/TrackSectionForm';

class LickForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            tagInput: ''
        };
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
        this.handleCreateTag = this
            .handleCreateTag
            .bind(this);
        this.handleRecordTrack = this
            .handleRecordTrack
            .bind(this);
    }

    render() {
        const {id, description, tracks, tags, tagInput} = this.state;
        const {handleCancel, handleDelete} = this.props;

        const trackSectionState = {
            tracks,
            handleDeleteTrack: this.handleDeleteTrack.bind(this),
            handleRecordTrack: this.handleRecordTrack
        };

        return (
            <div className="card lick">
                <div className="card-content">
                    {this.renderDescription(description)}
                    <TrackSectionForm {...trackSectionState}/> 
                    {this.renderTags(tags, tagInput)}
                </div>
                {this.renderFooter(id, handleCancel, handleDelete)}
            </div>
        );
    }

    renderDescription(description) {
        return <textarea
            name="description"
            className="textarea description"
            value={description}
            onChange={this.handleInputChange}/>;
    }

    renderTags(tags, tagInput) {
        return <div className="tag-container">
            <div className="tags">
                {tags.map(tag => <span key={tag} className="tag">{tag}
                    <button
                        className="delete is-small tag-delete"
                        onClick={() => this.handleDeleteTag(tag)}></button>
                </span>)}
            </div>
            {this.renderTagInput(tagInput)}
        </div>;
    }

    renderTagInput(tagInput) {
        return <p className="control tag-input">
            <input
                name="tagInput"
                className="input is-small"
                type="text"
                placeholder="Add new tag"
                value={tagInput}
                onChange={this.handleInputChange}
                onKeyPress={this.handleCreateTag}/>
        </p>;
    }

    renderFooter(id, handleCancel, handleDelete) {
        return <footer className="card-footer">
            <a className="card-footer-item lick-save" onClick={this.handleSave.bind(this)}>
                <span className="icon is-small">
                    <i className="fa fa-floppy-o"></i>
                </span>
            </a>
            <a className="card-footer-item lick-cancel" onClick={() => handleCancel()}>
                <span className="icon is-small">
                    <i className="fa fa-undo"></i>
                </span>
            </a>
            <a className="card-footer-item lick-delete" onClick={() => handleDelete(id)}>
                <span className="icon is-small">
                    <i className="fa fa-trash"></i>
                </span>
            </a>
        </footer>;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    handleDeleteTrack(id) {
        const tracks = this.state.tracks.filter(track => track.id !== id);
        this.setState({tracks});
    }

    handleRecordTrack(blob) {
        const url = URL.createObjectURL(blob);
        let tracks = [...this.state.tracks];
        // TODO Decide how to save non-stored tracks (with, without id, etc)
        tracks.push({id: url, link: url});
        this.setState({tracks});
    }

    handleDeleteTag(tag) {
        this.setState({
            tags: this
                .state
                .tags
                .filter(storedTag => storedTag !== tag)
        });
    }

    handleCreateTag(event) {
        const tag = event.target.value;
        if (event.key !== 'Enter' || tag === '') {
            return;
        }
        
        let tags = this.state.tags;
        tags.push(tag);
        this.setState({
            tagInput: '',
            tags: _.uniq(tags)
        });
    }

    handleSave() {
        const lick = _.pick(this.state, ['id', 'description', 'tracks', 'tags']);
        this.props.handleSave(lick);
    }
}

export default LickForm;

LickForm.propTypes = {
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
}