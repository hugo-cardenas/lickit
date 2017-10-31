import React, { Component } from 'react';
import PropTypes from 'prop-types';

const
    STATUS_STOPPED = 'stopped',
    STATUS_PLAYING = 'playing';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: STATUS_STOPPED
        };
        this.switchState = this.switchState.bind(this);
    }

    render() {
        const { src } = this.props;
        const { status } = this.state;

        const isPlaying = status === STATUS_PLAYING;
        const buttonStyle = isPlaying ? { visibility: 'visible'} : {};

        return <div>
            <audio src={src} onEnded={this.switchState} ref={audio => this.audio = audio}></audio>
            <a style={buttonStyle} className="button is-primary is-large" onClick={this.switchState}>
                <span className="icon">
                    <i className={isPlaying ? 'fa fa-stop' : 'fa fa-play'}></i>
                </span>
            </a>
        </div>;
    }

    switchState() {
        let newStatus;
        if (this.state.status === STATUS_STOPPED) {
            newStatus = STATUS_PLAYING;
        } else {
            newStatus = STATUS_STOPPED;
        }
        this.setState({ status: newStatus });
    }

    componentDidUpdate() {
        if (this.state.status === STATUS_PLAYING) {
            this.audio.play();
        } else {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
}

export default Player;

Player.propTypes = {
    src: PropTypes.string.isRequired
};
