import React, {Component} from 'react';
import './TrackSection.css';

class TrackSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: this.props.mode,
            recording: false
        };
    }

    render() {
        const {mode} = this.props;
        switch (mode) {
            case 'edit':
                return this.renderTracksEdit();
            case 'view':
            default:
                return this.renderTracksView();
        }
    }

    renderTracksView() {
        return <div className="track-container">
            <div className="track-list">
                <div className="track level">
                    <audio
                        className="level-left"
                        controls
                        src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
                        Your browser does not support the
                        <code>audio</code>
                        element.
                    </audio>
                </div>
            </div>
        </div>;
    }

    renderTracksEdit() {
        return <div className="track-container">
            <div className="track-list">
                {[0, 1].map(i => <div className="track level">
                    <div>
                        <audio
                            className="level-left"
                            controls
                            src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
                            Your browser does not support the
                            <code>audio</code>
                            element.
                        </audio>
                    </div>
                    <a className="level-right">
                        <span className="icon is-small">
                            <i className="fa fa-trash"></i>
                        </span>
                    </a>
                </div>)}

            </div>
            {this.renderRecorder()}
        </div>;
    }

    renderRecorder() {
        if (this.state.recording === true) {
            return <div className="recorder">
                <a
                    className="button is-primary"
                    onClick={() => this.setState({recording: false})}>
                    <span className="icon is-small">
                        <i className="fa fa-stop"></i>
                    </span>
                </a>
            </div>;
        }

        return <div className="recorder">
            <a
                className="button is-primary"
                onClick={() => this.setState({recording: true})}>
                <span className="icon is-small">
                    <i className="fa fa-microphone"></i>
                </span>
            </a>
        </div>;
    }

}

export default TrackSection;