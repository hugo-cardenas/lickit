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
        switch (this.props.mode) {
            case 'edit':
                return this.renderTracksEdit();
            case 'view':
            default:
                return this.renderTracksView();
        }
    }

    renderTracksView() {
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
    }

    renderTracksEdit() {
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
                    <span className="icon">
                        <i className="fa fa-home"></i>
                    </span>
                </div>
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