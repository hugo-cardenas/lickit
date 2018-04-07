import React, { Component } from 'react';
import LickCollection from './LickCollection';
import Routine from './Routine/Routine';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

const propTypes = {
  error: PropTypes.object,
  lick: PropTypes.shape({
    isCreationOpen: PropTypes.bool.isRequired,
    licks: PropTypes.arrayOf(PropTypes.object).isRequired,
    enableCreateLickForm: PropTypes.func.isRequired,
    cancelCreateLickForm: PropTypes.func.isRequired,
    createLick: PropTypes.func.isRequired,
    saveLick: PropTypes.func.isRequired,
    deleteLick: PropTypes.func.isRequired,
    changeLickMode: PropTypes.func.isRequired
  }).isRequired,
  search: PropTypes.object.isRequired
};

const
  VIEW_LICK_COLLECTION = 'lick-collection',
  VIEW_ROUTINE = 'routine';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      view: VIEW_LICK_COLLECTION
    };
    this.setViewLickCollection = this.setViewLickCollection.bind(this);
    this.setViewRoutine = this.setViewRoutine.bind(this);
  }

  render() {
    const { view } = this.state;
    const { error } = this.props;

    if (error instanceof Error) {
      // TODO Use sweetalert
      alert(`Error: ${error.message}\n${error.stack}`);
    }

    return (
      <div className="main-container">
        {this.renderTopContainer()}
        { view === VIEW_LICK_COLLECTION ? 
          <LickCollection {...this.props}/> :
          <Routine {...this.props}/>
        }
      </div>
    );
  }

  renderTopContainer() {
    return (
      <div id="top-container">{this.renderNav()}</div>
    );
  }

  renderNav() {
    const { view } = this.state;
    return (
      <nav>
      <div className="field has-addons is-small">
        {this.renderNavButton('fa-music', 'Licks', view === VIEW_LICK_COLLECTION, this.setViewLickCollection)}
        {this.renderNavButton('fa-book', 'Routine', view === VIEW_ROUTINE, this.setViewRoutine)}
      </div>
      <ReactTooltip effect="solid" place="bottom" />
    </nav>
    );
  }

  renderNavButton(icon, title, isActive, onClick) {
    return (
      <p className="control" onClick={!isActive ? onClick : null}>
        <a className={`button is-small ${isActive ? 'is-active is-primary' : ''}`}>
          <span className="icon is-small">
            <i className={`fa ${icon}`} />
          </span>
          <span>{title}</span>
        </a>
      </p>
    );
  }

  setViewLickCollection() {
    this.setState({ view: VIEW_LICK_COLLECTION });
  }

  setViewRoutine() {
    this.setState({ view: VIEW_ROUTINE });
  }
}

App.propTypes = propTypes;
