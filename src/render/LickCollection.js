import React from 'react';
import LickList from './Lick/LickList';
import Search from './Search/Search';
import PropTypes from 'prop-types';

const propTypes = {
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

const LickCollection = props => {
  const { lick, search } = props;
  const {
    enableCreateLickForm
  } = lick;

  const enableCreateLick = () => {
    window.scrollTo(0, 0);
    enableCreateLickForm();
  };

  return (
    <div>
      {renderControlsContainer(enableCreateLick, search)}
      <div className="main-content">
        <LickList {...props.lick} />
        </div>
    </div>
  );
};

const renderControlsContainer = (enableLickCreateForm, search) => (
  <div className="controls-container">
    {renderLickControls(enableLickCreateForm, search)}
  </div>
);

const renderLickControls = (enableLickCreateForm, search) => (
  <div className="controls controls-lick">
    {renderCreateLickButton(enableLickCreateForm)}
    <Search {...search} />
  </div>
);

const renderCreateLickButton = enableLickCreateForm => (
  <a
    id="button-lick-create"
    className="level-item button is-small"
    onClick={enableLickCreateForm}>
    <span className="icon is-small">
      <i className="fa fa-plus" />
    </span>
    <span>Add lick</span>
  </a>
);

LickCollection.propTypes = propTypes;

export default LickCollection;
