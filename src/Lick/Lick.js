import React, {Component} from 'react';
import './Lick.css';

class Lick extends Component {
    render() {
        return (
            <div className={"card lick " + this.props.className}>
                <div className="card-content">
                    <div className="description">
                        {this.props.description}
                    </div>
                    <div className="track-container">
                        <audio
                            controls
                            src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg">
                            Your browser does not support the
                            <code>audio</code>
                            element.
                        </audio>
                    </div>
                    <div className="tags">
                        {this
                            .props
                            .tags
                            .map(tag => <span className="tag">{tag}</span>)}
                    </div>
                </div>
                <footer className="card-footer">
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
                </footer>
            </div>
        );
    }
}

export default Lick;