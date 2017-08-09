import React, { Component } from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Lick from './Lick/Lick';
import PropTypes from 'prop-types';
import _ from 'lodash';

function renderLick(lickState, deleteLick, saveLick, changeLickMode) {
    return <Lick
        lick={lickState.lick}
        mode={lickState.mode}
        deleteLick={deleteLick}
        saveLick={saveLick}
        changeLickMode={changeLickMode}
        />;
}

function renderRow(chunk, deleteLick, saveLick, changeLickMode) {
    const chunkKey = chunk
        .map(lickState => lickState.lick.id)
        .join('-');
    return (
        <div key={chunkKey} className="columns">
            {chunk.map(lickState => {
              return <div 
                  key={lickState.lick.id} 
                  className="column is-one-third">
                      {renderLick(lickState, deleteLick, saveLick, changeLickMode)}
              </div>;
            })}
        </div>
    );
}

class App extends Component {
    render() {
        const {
            error,
            licks,
            deleteLick,
            saveLick,
            createLick,
            changeLickMode
        } = this.props;

        if (error instanceof Error) {
            alert('ERROR:' + "\n" + error);
        }

        const chunks = _.chunk(licks, 3);

        return (
            <div className="main-container">
                <div className="top-container">
                    <header className="main-header">
                        <h5 className="title is-5">Lickit</h5>
                    </header>
                    <div className="lick-new">
                        <a className="button" onClick={createLick}>
                            <span className="icon">
                                <i className="fa fa-plus-circle"></i>
                            </span>
                            <span>New lick</span>
                        </a>
                    </div>
                </div>
                <div className="main-content">
                    <div className="lick-list">
                        {chunks.map(chunk => renderRow(chunk, deleteLick, saveLick, changeLickMode))}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;

App.propTypes = {
    error: PropTypes.object,
    licks: PropTypes.arrayOf(PropTypes.object).isRequired,
    createLick: PropTypes.func.isRequired,
    saveLick: PropTypes.func.isRequired,
    deleteLick: PropTypes.func.isRequired,
    changeLickMode: PropTypes.func.isRequired
};
