import React, {Component} from 'react';
import './Lick.css';

class Lick extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mode: this.props.mode};
    }

    render() {
        const props = this.props;
        const renderer = getRenderer(this.state.mode);

        return (
            <div className="card lick">
                {renderer.renderContent(props)}
                {renderer.renderFooter()}
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
    renderContent: function (props) {
        return <div className="card-content">
            {this.renderDescription(props)}
            {this.renderTracks(props)}
            {this.renderTags(props)}
        </div>;
    },

    renderDescription: function (props) {
        return <p className="description">
            {props.description}
        </p>;
    },

    renderTracks: function (props) {
        return <div className="track-container">
            <audio
                controls
                src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
                Your browser does not support the
                <code>audio</code>
                element.
            </audio>
        </div>;
    },

    renderTags: function (props) {
        return <div className="tags">
            {props
                .tags
                .map(tag => <span className="tag">{tag}</span>)}
        </div>;
    },

    renderFooter: function () {
        return <footer className="card-footer">
            <a className="card-footer-item">
                <span className="icon is-small">
                    <i className="fa fa-pencil"></i>
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
        return <textarea className="textarea description">
            {props.description}
        </textarea>;
    },

    renderFooter: function () {
        return <footer className="card-footer">
            <a className="card-footer-item">
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
