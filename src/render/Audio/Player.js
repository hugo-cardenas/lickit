import React, { Component } from 'react';
import PropTypes from 'prop-types';

const
    STATE_STOPPED = 'stopped',
    STATE_PLAYING = 'playing';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            state: STATE_STOPPED
        };
    }

    render() {
        const { src } = this.props;
        const { state } = this.state;

        const props = {};
        if (state === STATE_PLAYING) {
            props['autoplay'] = true;
        }

        return <div>
            <audio src={src} onEnded={this.switchState.bind(this)} ref={audio => this.audio = audio}></audio>
            <a className="button is-primary is-large" onClick={this.switchState.bind(this)}>
                <span className="icon">
                    <i className={state === STATE_PLAYING ? 'fa fa-stop' : 'fa fa-play'}></i>
                </span>
            </a>
        </div>;
    }

    switchState() {
        let newState;
        if (this.state.state === STATE_STOPPED) {
            newState = STATE_PLAYING;
        } else {
            newState = STATE_STOPPED;
        }
        this.setState({ state: newState });
    }

    componentDidUpdate() {
        if (this.state.state === STATE_PLAYING) {
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
