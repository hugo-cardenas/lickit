import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import TrackSectionForm from './Track/TrackSectionForm';
import Player from '../Audio/Player';
import Recorder from '../Audio/Recorder';

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
        this.handleInputArtist = this
            .handleInputArtist
            .bind(this);
        this.handleInputDescription = this
            .handleInputDescription
            .bind(this);
        this.handleInputTag = this
            .handleInputTag
            .bind(this);
        this.setLickState = this
            .setLickState
            .bind(this);
        this.handleCreateTag = this
            .handleCreateTag
            .bind(this);
        this.handleRecordTrack = this
            .handleRecordTrack
            .bind(this);
    }

    render() {
        const { lick, tagInput } = this.state;
        const { id, artist, description, tracks, tags } = lick;
        const { cancelLickEditor, deleteLick } = this.props;

        const trackSectionState = {
            tracks,
            handleDeleteTrack: this.handleDeleteTrack.bind(this),
            handleRecordTrack: this.handleRecordTrack
        };

        return <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="card lick lick-form">
                    <div className="card-content">
                        {this.renderArtist(artist)}
                        {this.renderDescription(description)}
                        {this.renderTrackSection(trackSectionState)}
                        {this.renderTags(tags, tagInput)}
                        {this.renderSubmitButtons(id, cancelLickEditor)}
                    </div>
                    {/* this.renderFooter(id, cancelLickEditor, deleteLick) */}
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => cancelLickEditor(id)}></button>
        </div>;
    }

    renderArtist(artist) {
        return <div className="field">
            <label className="label">Artist</label>
            <div className="control">
                <input 
                    name="artist" 
                    className="input artist" 
                    type="text" 
                    placeholder="Artist name"
                    value={artist}
                    onChange={this.handleInputArtist}/>
            </div>
        </div>;
    }

    renderDescription(description) {
        return <div className="field">
            <label className="label">Song</label>
            <div className="control">
                <input 
                    name="song" 
                    className="input song" 
                    type="text" 
                    placeholder="Song name"
                    value={description}
                    onChange={this.handleInputDescription}/>
            </div>
        </div>;
    }

    renderTrackSection(trackSectionState) {
        const {
            tracks,
            handleDeleteTrack,
            handleRecordTrack
        } = trackSectionState;

        const deleteControl = tracks.length > 0 ? 
            <a className="icon is-small is-pulled-right" onClick={() => handleDeleteTrack(tracks[0].id)}>
                <i className="fa fa-trash"></i>
            </a> : 
            '';

        return <div className="field">
            <label className="label">Audio</label>
            <div id="track-container" className="control">
                {deleteControl}
                <div className="center">
                    {tracks[0] ? <Player src={tracks[0].url}/> : <Recorder handleRecordTrack={handleRecordTrack}/>}
                </div>
            </div>

            {/* <div className="control">
                {tracks[0] ? <Player src={tracks[0].url}/> : <Recorder handleRecordTrack={handleRecordTrack}/>}
            </div> */}
        </div>;
    }

    renderTags(tags, tagInput) {
        return <div className="field">
            <label className="label">Tags</label>
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
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={this.handleInputTag}
                onKeyPress={this.handleCreateTag}/>
        </p>;
    }

    renderFooter(id, cancelLickEditor, deleteLick) {
        return <footer className="card-footer">
            <div className="card-footer-item lick-save">
                <a className="button is-small is-primary" onClick={this.handleSave.bind(this)}>
                    <span className="icon is-small">
                        <i className="fa fa-check"></i>
                    </span>
                    {<span>Save</span>}
                </a>
            </div>
            <div className="card-footer-item lick-cancel">
                <a className="button is-small" onClick={() => cancelLickEditor(id)}>
                    <span className="icon is-small">
                        <i className="fa fa-undo"></i>
                    </span>
                    {<span>Cancel</span>}
                </a>
            </div>
        </footer>;
    }

    renderSubmitButtons(id, cancelLickEditor) {
        return <div className="field is-grouped">
            <p className="control">
                <a className="button is-small is-primary" onClick={this.handleSave.bind(this)}>
                    <span className="icon is-small">
                        <i className="fa fa-check"></i>
                    </span>
                    <span>Save</span>
                </a>
            </p>
            <p className="control">
                <a className="button is-small is-light" onClick={() => cancelLickEditor(id)}>
                    <span className="icon is-small">
                        <i className="fa fa-times"></i>
                    </span>
                    <span>Cancel</span>
                </a>
            </p>
        </div>;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ?
            target.checked :
            target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleInputArtist(event) {
        this.handleLickStateInput('artist', event);
    }

    handleInputDescription(event) {
        this.handleLickStateInput('description', event);
    }

    handleLickStateInput(name, event) {
        this.setLickState({
            [name]: event.target.value
        });
    }

    handleInputTag(event) {
        this.setState({
            tagInput: event.target.value
        });
    }

    handleCreateTag(event) {
        const tag = event.target.value;
        if (event.key !== 'Enter' || tag === '') {
            return;
        }

        let tags = this.getLickState().tags;
        tags.push(tag);
        // Display tags sorted alphabetically
        tags.sort();
        this.setState({
            tagInput: '',
            lick: { ...this.getLickState(), tags: _.uniq(tags) }
        });
    }

    handleDeleteTrack(id) {
        const tracks = this.getLickState().tracks.filter(track => track.id !== id);
        this.setLickState({ tracks });
    }

    handleRecordTrack(blob) {
        const url = URL.createObjectURL(blob);
        let tracks = [...this.getLickState().tracks];
        // TODO Do in a better way
        // Set temporarily url as id until it gets saved (in order to be able to delete unsaved tracks)
        tracks.push({ blob, id: url, url: url });
        this.setLickState({ tracks });
    }

    handleDeleteTag(tag) {
        this.setLickState({
            tags: this.getLickState().tags.filter(storedTag => storedTag !== tag)
        });
    }

    handleSave() {
        this.props.saveLick(this.getLickState());
    }

    getLickState() {
        return this.state.lick;
    }

    setLickState(state) {
        this.setState({
            lick: { ...this.getLickState(), ...state }
        });
    }
}

export default LickForm;

LickForm.propTypes = {
    lick: PropTypes.shape({
        id: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    saveLick: PropTypes.func.isRequired,
    cancelLickEditor: PropTypes.func.isRequired,
    deleteLick: PropTypes.func.isRequired
};
