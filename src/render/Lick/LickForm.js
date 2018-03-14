import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Player from '../Audio/Player';
import Recorder from '../Audio/Recorder';

class LickForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageTrack: null,
      lick: this.props.lick,
      tagInput: ''
    };
    this.bindHandlers();
  }

  bindHandlers() {
    this.handleInputArtist = this.handleInputArtist.bind(this);
    this.handleInputDescription = this.handleInputDescription.bind(this);
    this.handleInputTag = this.handleInputTag.bind(this);
    this.setLickState = this.setLickState.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
    this.handleRecordTrack = this.handleRecordTrack.bind(this);
    this.handleDeleteTrack = this.handleDeleteTrack.bind(this);
  }

  render() {
    const { errorMessageTrack, lick, tagInput } = this.state;
    const { id, artist, description, tracks, tags } = lick;
    const { cancelLickEditor } = this.props;

    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-content">
          <div className="card lick lick-form">
            <div className="card-content">
              {this.renderArtist(artist)}
              {this.renderSong(description)}
              {this.renderTrackSection(
                tracks[0],
                errorMessageTrack,
                this.handleDeleteTrack,
                this.handleRecordTrack
              )}
              {this.renderTags(tags, tagInput)}
              {this.renderSubmitButtons(id, cancelLickEditor)}
            </div>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => cancelLickEditor(id)}
        />
      </div>
    );
  }

  renderArtist(artist) {
    return (
      <div className="field">
        <label className="label">Artist</label>
        <div className="control">
          <input
            name="artist"
            className="input artist"
            type="text"
            placeholder="Artist name (optional)"
            value={artist}
            onChange={this.handleInputArtist}
          />
        </div>
      </div>
    );
  }

  renderSong(song) {
    return (
      <div className="field">
        <label className="label">Song</label>
        <div className="control">
          <input
            name="song"
            className="input song"
            type="text"
            placeholder="Song name (optional)"
            value={song}
            onChange={this.handleInputDescription}
          />
        </div>
      </div>
    );
  }

  renderTrackSection(
    track,
    errorMessage,
    handleDeleteTrack,
    handleRecordTrack
  ) {
    const error = errorMessage ? (
      <span className="error-message"> - {errorMessage}</span>
    ) : (
      ''
    );
    return (
      <div className="field field-track">
        <label className="label">Audio {error}</label>
        <div className="track-container control">
          {this.renderTrackDeleteButton(track, handleDeleteTrack)}
          <div className="track">
            {track ? (
              <Player src={track.url} />
            ) : (
              <Recorder handleRecordTrack={handleRecordTrack} />
            )}
          </div>
        </div>
      </div>
    );
  }

  renderTrackDeleteButton(track, handleDeleteTrack) {
    if (track) {
      return (
        <a
          className="button is-small is-pulled-right track-delete"
          onClick={() => handleDeleteTrack(track.id)}>
          <span className="icon is-small">
            <i className="fa fa-trash" />
          </span>
          <span>Delete track</span>
        </a>
      );
    } else {
      return '';
    }
  }

  renderTags(tags, tagInput) {
    return (
      <div className="field tag-container">
        <label className="label">Tags</label>
        <div className="tags">
          {tags.map(tag => (
            <span key={tag} className="tag">
              {tag}
              <button
                className="delete is-small tag-delete"
                onClick={() => this.handleDeleteTag(tag)}
              />
            </span>
          ))}
        </div>
        {this.renderTagInput(tagInput)}
      </div>
    );
  }

  renderTagInput(tagInput) {
    return (
      <p className="control tag-input">
        <input
          name="tagInput"
          className="input is-small"
          type="text"
          placeholder="Add a tag and press Enter"
          value={tagInput}
          onChange={this.handleInputTag}
          onKeyPress={this.handleCreateTag}
        />
      </p>
    );
  }

  renderSubmitButtons(id, cancelLickEditor) {
    return (
      <div className="field is-grouped">
        <p className="control">
          <a
            className="button is-small is-primary lick-save"
            onClick={this.handleSave.bind(this)}>
            <span className="icon is-small">
              <i className="fa fa-check" />
            </span>
            <span>Save</span>
          </a>
        </p>
        <p className="control">
          <a
            className="button is-small is-light lick-cancel"
            onClick={() => cancelLickEditor(id)}>
            <span className="icon is-small">
              <i className="fa fa-times" />
            </span>
            <span>Cancel</span>
          </a>
        </p>
      </div>
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
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
    this.setState({ errorMessageTrack: null });
  }

  handleDeleteTag(tag) {
    this.setLickState({
      tags: this.getLickState().tags.filter(storedTag => storedTag !== tag)
    });
  }

  handleSave() {
    if (this.validateLick()) {
      this.props.saveLick(this.getLickState());
    }
  }

  getLickState() {
    return this.state.lick;
  }

  setLickState(state) {
    this.setState({
      lick: { ...this.getLickState(), ...state }
    });
  }

  validateLick() {
    if (this.getLickState().tracks.length < 1) {
      this.setState({ errorMessageTrack: 'An audio track is required' });
      return false;
    }
    return true;
  }
}

export default LickForm;

LickForm.propTypes = {
  lick: PropTypes.shape({
    id: PropTypes.string, // Form for new lick won't have id
    artist: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  saveLick: PropTypes.func.isRequired,
  cancelLickEditor: PropTypes.func.isRequired
};
