import React from 'react';
import PropTypes from 'prop-types';
import Lick from './Lick';
import LickForm from './LickForm';
import { LICK_MODE_EDIT, LICK_MODE_VIEW } from '../../state/actions/lick/modes';

const propTypes = {
  licks: PropTypes.arrayOf(PropTypes.object).isRequired,
  createLick: PropTypes.func.isRequired,
  cancelCreateLickForm: PropTypes.func.isRequired,
  saveLick: PropTypes.func.isRequired,
  deleteLick: PropTypes.func.isRequired,
  changeLickMode: PropTypes.func.isRequired,
  mode: PropTypes.oneOf([LICK_MODE_EDIT, LICK_MODE_VIEW]),
  isCreateFormEnabled: PropTypes.bool
};

const LickList = props => {
  const {
    isCreateFormEnabled,
    licks,
    createLick,
    cancelCreateLickForm,
    deleteLick,
    saveLick,
    changeLickMode
  } = props;
  return (
    <div className="lick-list">
      {isCreateFormEnabled &&
        renderCreateLickForm(createLick, cancelCreateLickForm)}
      {licks.map(lick =>
        renderLick(lick, deleteLick, saveLick, changeLickMode)
      )}
    </div>
  );
};

LickList.propTypes = propTypes;

const renderCreateLickForm = (createLick, cancelCreateLickForm) => {
  const lick = {
    artist: '',
    description: '',
    tracks: [],
    tags: []
  };
  const props = {
    lick,
    saveLick: lick => createLick(lick),
    cancelLickEditor: () => cancelCreateLickForm()
  };
  return <LickForm {...props} />;
};

const renderLick = (lick, deleteLick, saveLick, changeLickMode) => (
  <Lick
    key={lick.id}
    lick={lick}
    deleteLick={deleteLick}
    saveLick={saveLick}
    changeLickMode={changeLickMode}
  />
);

export default LickList;
