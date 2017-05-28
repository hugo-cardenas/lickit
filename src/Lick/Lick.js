import React, {Component} from 'react';
import './Lick.css';
import TrackSection from './Track/TrackSection';

class Lick extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: this.props.mode
        };
    }

    render() {
        const props = this.props;
        const renderer = getRenderer(this.state.mode);

        return (
            <div className="card lick">
                <div className="card-content">
                    {renderer.renderDescription(props)}
                    <TrackSection mode={this.state.mode}/> 
                    {renderer.renderTags(props)}
                </div>
                {renderer.renderFooter(this)}
            </div>
        );
    }
}

export default Lick;

function getRenderer(mode) {
    switch (mode) {
        case 'edit':
            return editModeRenderer;
        case 'view':
        default:
            return viewModeRenderer;
    }
}

const viewModeRenderer = {
    renderDescription: function (props) {
        return <p className="description">
            {props.description}
        </p>;
    },

    renderTracks: function (props) {
        return <div className="track-container">
            <div className="tracks">
                <div className="track">
                    <audio
                        controls
                        src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
                        Your browser does not support the
                        <code>audio</code>
                        element.
                    </audio>
                </div>
            </div>
        </div>;
    },

    renderTags: function (props) {
        return <div className="tags">
            {props
                .tags
                .map(tag => <span className="tag">{tag}</span>)}
        </div>;
    },

    renderFooter: function (lick) {
        return <footer className="card-footer">
            <a className="card-footer-item" onClick={() => lick.setState({mode: 'edit'})}>
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
};

const editModeRenderer = Object.assign({}, viewModeRenderer, {
    renderDescription: function (props) {
        return <textarea className="textarea description" value={props.description}></textarea>;
    },

    renderTracks: function (props) {
        return <div className="track-container">
            <div className="tracks">
                <div className="track">
                    <audio
                        controls
                        src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
                        Your browser does not support the
                        <code>audio</code>
                        element.
                    </audio>
                </div>
            </div>
            <div className="recorder">
                <a className="button is-primary">
                    <span className="icon is-small">
                        <i className="fa fa-microphone"></i>
                    </span>
                </a>
            </div>
        </div>;
    },

    renderTags: function (props) {
        return <div className="tag-container">
            <div className="tags">
                {props
                    .tags
                    .map(tag => <span className="tag">{tag}
                        <button className="delete is-small"></button>
                    </span>)}
            </div>
            <p className="control">
                <input className="input is-small" type="text" placeholder="Add new tag"/>
            </p>
        </div>;
    },

    renderFooter: function (lick) {
        return <footer className="card-footer">
            <a className="card-footer-item" onClick={() => lick.setState({mode: 'view'})}>
                <span className="icon is-small">
                    <i className="fa fa-floppy-o"></i>
                </span>
            </a>
            <a className="card-footer-item">
                <span className="icon is-small">
                    <i className="fa fa-trash"></i>
                </span>
            </a>
        </footer>;
    }
});
