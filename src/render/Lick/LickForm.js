import React, {Component} from 'react';
import TrackSectionForm from './Track/TrackSectionForm';
import _ from 'lodash';

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
        const {id, description, trackSectionState, tags, tagInput} = this.state;

        const {handleSave, handleDelete} = this.props;

        return (
            <div className="card lick">
                <div className="card-content">
                    {this.renderDescription(description)}
                    <TrackSectionForm {...trackSectionState}/> {this.renderTags(tags, tagInput)}
                </div>
                {this.renderFooter(id, handleSave, handleDelete)}
            </div>
        );
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;

        this.setState({[name]: value});
        console.log('SET ', {[name]: value});
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
        if (event.key !== 'Enter') {
            return;
        }

        const tag = event.target.value;
        let tags = this.state.tags;
        tags.push(tag);
        this.setState({
            tagInput: '',
            tags: _.uniq(tags)
        });
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
                {tags.map(tag => <span className="tag">{tag}
                    <button
                        className="delete is-small"
                        onClick={(() => this.handleDeleteTag(tag)).bind(this)}></button>
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

    renderFooter(id, handleSave, handleDelete) {
        return <footer className="card-footer">
            <a className="card-footer-item" onClick={() => handleSave()}>
                <span className="icon is-small">
                    <i className="fa fa-floppy-o"></i>
                </span>
            </a>
            <a className="card-footer-item" onClick={() => handleDelete(id)}>
                <span className="icon is-small">
                    <i className="fa fa-trash"></i>
                </span>
            </a>
        </footer>;
    }
}

export default LickForm;
