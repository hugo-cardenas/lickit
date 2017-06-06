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
    }

    render() {
        const {id, description, tracks, tags, tagInput} = this.state;
        const {handleSave, handleCancel, handleDelete} = this.props;

        const trackSectionState = {
            tracks,
            handleDeleteTrack: this.handleDeleteTrack.bind(this),
            handleRecordStop: () => {}
        }

        return (
            <div className="card lick">
                <div className="card-content">
                    {this.renderDescription(description)}
                    <TrackSectionForm {...trackSectionState}/> 
                    {this.renderTags(tags, tagInput)}
                </div>
                {this.renderFooter(id, handleSave, handleCancel, handleDelete)}
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
                        className="delete is-small"
                        onClick={() => this.handleDeleteTag(tag)}></button>
                </span>)}
            </div>
            {this.renderTagInput(tagInput)}
        </div>;
    }

    renderTagInput(tagInput) {
        return <p className="control">
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

    renderFooter(id, handleSave, handleCancel, handleDelete) {
        return <footer className="card-footer">
            <a className="card-footer-item" onClick={() => handleSave()}>
                <span className="icon is-small">
                    <i className="fa fa-floppy-o"></i>
                </span>
            </a>
            <a className="card-footer-item" onClick={() => handleCancel()}>
                <span className="icon is-small">
                    <i className="fa fa-undo"></i>
                </span>
            </a>
            <a className="card-footer-item" onClick={() => handleDelete(id)}>
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

    handleDeleteTrack(id){
        const tracks = this.state.tracks.filter(track => track.id !== id);
        this.setState({tracks});
    }

    handleDeleteTag(tag) {
        this.setState({
            tags: this
                .state
                .tags
                .filter(storedTag => storedTag !== tag)
        })
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
}

export default LickForm;

LickForm.propTypes = {
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleUpdate: PropTypes.func.isRequired,
}