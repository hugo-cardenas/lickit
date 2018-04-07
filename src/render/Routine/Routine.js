import React from 'react';
import LickList from '../Lick/LickList';
import PropTypes from 'prop-types';
import Controls from './Controls/Controls';

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

const Routine = props => {
  return (
    <div>
      {renderControls()}
      <div className="main-content">
        <div>
          <p>* Foo bar</p>
          <p>* Baz</p>
        </div>
        <br/>
        <LickList {...props.lick} />
        <hr/>

        <div>
          <p>* Foo bar</p>
          <p>* Baz</p>
        </div>
        <br/>
        <LickList {...props.lick} />
        <hr/>
      </div>
    </div>
  );
};

const renderControls = () => {
  return (
    <Controls />
  );
}


Routine.propTypes = propTypes;

export default Routine;
