import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import TrackSectionForm from './Track/TrackSectionForm';

class LickForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lick: this.props.lick,
            tagInput: ''
        };
        this.bindHandlers();
        
    }

    bindHandlers() {
        this.handleInputDescription = this
            .handleInputDescription
            .bind(this);
        this.handleInputTag = this
            .handleInputTag
            .bind(this);
        this.setLickState = this
            .setLickState
            .bind(this);
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
        const {lick, tagInput} = this.state;
        const {id, description, tracks, tags} = lick;
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
            placeholder="Add some description"
            value={description}
            onChange={this.handleInputDescription}/>;
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
                onChange={this.handleInputTag}
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

    handleInputDescription(event) {
        this.setLickState({description: event.target.value});
    }

    handleInputTag(event) {
        this.setState({
            tagInput: event.target.value
        });
    }

    handleDeleteTrack(id) {
        const tracks = this.getLickState().tracks.filter(track => track.id !== id);
        this.setLickState({tracks});
    }

    handleRecordTrack(blob) {
        const url = URL.createObjectURL(blob);
        let tracks = [...this.getLickState().tracks];
        // Set temporarily url as id until it gets saved (in order to be able to delete unsaved tracks)
        tracks.push({blob, id: url, url: url});
        this.setLickState({tracks});
    }

    handleDeleteTag(tag) {
        this.setLickState({
            tags: this.getLickState().tags.filter(storedTag => storedTag !== tag)
        });
    }

    handleCreateTag(event) {
        const tag = event.target.value;
        if (event.key !== 'Enter' || tag === '') {
            return;
        }
        
        let tags = this.getLickState().tags;
        tags.push(tag);
        this.setState({
            tagInput: '',
            lick: {...this.getLickState(), tags: _.uniq(tags)}
        });
    }

    handleSave() {
        this.props.handleSave(this.getLickState());
    }

    getLickState(){
        return this.state.lick;
    }

    setLickState(state){
        this.setState({
            lick: {...this.getLickState(), ...state}
        });
    }
}

export default LickForm;

LickForm.propTypes = {
    lick: PropTypes.shape({
        id: PropTypes.number,
        description: PropTypes.string,
        tracks: PropTypes.arrayOf(PropTypes.object),
        tags: PropTypes.arrayOf(PropTypes.string)
    }),
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
};