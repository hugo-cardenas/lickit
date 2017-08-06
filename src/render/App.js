import React, { Component } from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Lick from './Lick/Lick';
import PropTypes from 'prop-types';
import _ from 'lodash';

function renderLick(lickState, handleDelete, handleSave, changeLickMode) {
    return <Lick
        lick={lickState.lick}
        mode={lickState.mode}
        handleDelete={handleDelete}
        handleSave={handleSave}
        changeLickMode={changeLickMode}
        />;
}

function renderRow(chunk, handleDelete, handleSave, changeLickMode) {
    const chunkKey = chunk
        .map(lickState => lickState.lick.id)
        .join('-');
    return (
        <div key={chunkKey} className="columns">
            {chunk.map(lickState => {
              return <div 
                  key={lickState.lick.id} 
                  className="column is-one-third">
                      {renderLick(lickState, handleDelete, handleSave, changeLickMode)}
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
            handleDelete,
            handleSave,
            handleCreate,
            changeLickMode
        } = this.props;

        if (error instanceof Error) {
            alert('ERROR:' + "\n" + error);
        }

        const chunks = _.chunk(licks, 3);

        return (
            <div className="container main-container">
                <header className="main-header">
                    <h1 className="title">Lickit</h1>
                </header>
                <div className="main-content">
                    <div className="lick-new">
                        <a className="button" onClick={handleCreate}>
                            <span className="icon">
                                <i className="fa fa-plus-circle"></i>
                            </span>
                            <span>New lick</span>
                        </a>
                    </div>
                    <div className="lick-list">
                        {chunks.map(chunk => renderRow(chunk, handleDelete, handleSave, changeLickMode))}
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
    handleCreate: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    changeLickMode: PropTypes.func.isRequired
};
