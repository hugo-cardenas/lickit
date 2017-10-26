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
        changeLickMode={changeLickMode}/>;
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
                {renderTopContainer(handleCreateLick, search)}
                {renderControlsContainer(handleCreateLick, search)}
                <div className="main-content">
                    <div className="lick-list">
                        {chunks.map(chunk => renderRow(chunk, deleteLick, saveLick, changeLickMode))}
                    </div>
                </div>
            </div>
    );
};

const renderTopContainer = () =>
    <div className="top-container">
        {renderNav()}
    </div>;

const renderControlsContainer = (createLick, search) =>
    <div className="controls-container">
        {renderLickControls(createLick, search)}
    </div>;

const renderNav = () => 
    <div className="tabs is-centered is-small">
        <ul>
            <li className="is-active">
                <a href="#">
                    <span className="icon is-small"><i className="fa fa-music"></i></span>
                    <span>Licks</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <span className="icon is-small"><i className="fa fa-book"></i></span>
                    <span>Routine</span>
                </a>
            </li>
        </ul>
    </div>;

const renderLickControls = (createLick, search) => 
    <div id="lick-controls" className="">
        <a 
            id="button-lick-create" 
            className="level-item button is-small"
            onClick={createLick}>
            <span className="icon is-small">
                <i className="fa fa-plus"></i>
            </span>
            <span>Add lick</span>
        </a>
        <Search {...search}/>
    </div>;

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
