import React from 'react';
import 'bulma/css/bulma.css';
import './App.styl';
import Lick from './Lick/Lick';
import Search from './Search';
import PropTypes from 'prop-types';
import _ from 'lodash';

const renderItem = (item, deleteLick, saveLick, changeLickMode) => {
    return <Lick
        lick={item.lick}
        mode={item.mode}
        deleteLick={deleteLick}
        saveLick={saveLick}
        changeLickMode={changeLickMode}
        />;
};

const renderRow = (chunk, deleteLick, saveLick, changeLickMode) => {
    const chunkKey = chunk
        .map(item => item.lick.id)
        .join('-');
    return (
        <div key={chunkKey} className="columns">
            {chunk.map(item => {
              return <div 
                  key={item.lick.id} 
                  className="column is-one-third">
                      {renderItem(item, deleteLick, saveLick, changeLickMode)}
              </div>;
            })}
        </div>
    );
};

const App = (props) => {
    const { error, lick, search } = props;
    const {
        items,
        createLick,
        saveLick,
        deleteLick,
        changeLickMode
    } = lick;

    if (error instanceof Error) {
        alert('ERROR:' + "\n" + error);
    }

    const handleCreateLick = () => {
        window.scrollTo(0, 0);
        createLick();
    };

    const chunks = _.chunk(items, 3);

    return (
        <div className="main-container">
                {renderTopContainer()}
                <div className="main-content">
                    {renderLickControls(handleCreateLick, search)}
                    <div className="lick-list">
                        {chunks.map(chunk => renderRow(chunk, deleteLick, saveLick, changeLickMode))}
                    </div>
                </div>
            </div>
    );
};

const renderTopContainer = () => {
    return <div className="top-container">
        <header className="main-header">
            <h5 className="subtitle is-5">Lickit</h5>
        </header>
    </div>;
};

const renderLickControls = (handleCreateLick, search) => {
    return <div className="lick-controls field is-grouped">
        <a className="button control lick-create" onClick={handleCreateLick}>
            <span className="icon">
                <i className="fa fa-plus-circle"></i>
            </span>
            <span>New lick</span>
        </a>
        <Search {...search}/>
    </div>;
};

export default App;

App.propTypes = {
    error: PropTypes.object,
    lick: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            lick: PropTypes.object.isRequired,
            mode: PropTypes.string
        })).isRequired,
        createLick: PropTypes.func.isRequired,
        saveLick: PropTypes.func.isRequired,
        deleteLick: PropTypes.func.isRequired,
        changeLickMode: PropTypes.func.isRequired
    }).isRequired,
    search: PropTypes.object.isRequired,
};
