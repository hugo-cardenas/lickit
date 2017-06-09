import React, {Component} from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Lick from './Lick/Lick';
import _ from 'lodash';

// import {bindActionCreators} from 'redux'; import {connect} from
// 'react-redux'; import deleteLick from '../state/actions/lick';

function renderLick(lick, handleDelete, handleSave) {
  return <Lick
    lick={lick.lick}
    handleDelete={handleDelete}
    handleSave={handleSave}
    mode={lick.mode}/>;
}

function renderRow(chunk, handleDelete, handleSave) {
  const chunkKey = chunk.map(lick => lick.lick.id).join('-');
  return (
    <div key={chunkKey} className="columns">
      {chunk.map(lick => {
        return <div key={lick.lick.id} className="column is-one-third">{renderLick(lick, handleDelete, handleSave)}</div>
      })}
    </div>
  );
}

function getChunks(licks) {
  return _.chunk(licks, 3);
}

class App extends Component {
  render() {
    const {licks, handleDelete, handleSave, handleCreate} = this.props;
    const chunks = getChunks(licks);


    return (
      <div className="container main-container">
        <header className="main-header">
          <h1 className="title">JazzRoutine</h1>
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
            {chunks.map(chunk => renderRow(chunk, handleDelete, handleSave))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

// function mapStateToProps(state, props) {   return {licks: state.licks} }
// function mapDispatchToProps(dispatch) {   return {     // actions:
// bindActionCreators(lickActions, dispatch)     handleDelete: (id) =>
// dispatch(deleteLick(id))   } } export default connect(mapStateToProps,
// mapDispatchToProps)(App);