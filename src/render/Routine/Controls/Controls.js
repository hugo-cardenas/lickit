import React, { Component } from 'react';

export default class Controls extends Component {
  render() {
    return (
      <div className="controls-container">
        <div className="controls controls-routine">
          <div>
            {this.renderButton('fa-plus', 'Create routine')}
          </div>

          <div className="controls-routine-date">
            {this.renderButton('fa-chevron-left')}
            <p>07 April - 14 April</p>
            {this.renderButton('fa-chevron-right')}
          </div>

          <div>
            {this.renderButton('fa-trash', 'Delete routine')}
          </div>
        </div>
      </div>
    );
  }

  renderButton(icon, title) {
    return (
      <a
        id="button-lick-create"
        className="level-item button is-small">
        {icon && 
          <span className="icon is-small">
            <i className={`fa ${icon}`} />
          </span>
        }
        {title &&
          <span>{title}</span>
        }
      </a>
    );
  }
}
